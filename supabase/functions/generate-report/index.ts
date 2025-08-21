import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface Database {
  public: {
    Tables: {
      report_jobs: any
      sellers: any
      orders: any
      products: any
      customers: any
      payments: any
      reviews: any
    }
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    
    const supabase = createClient<Database>(supabaseUrl, supabaseServiceKey)

    const { reportJobId } = await req.json()

    if (!reportJobId) {
      throw new Error('Report job ID is required')
    }

    // Get the report job
    const { data: reportJob, error: jobError } = await supabase
      .from('report_jobs')
      .select('*')
      .eq('id', reportJobId)
      .single()

    if (jobError || !reportJob) {
      throw new Error('Report job not found')
    }

    // Update status to processing
    await supabase
      .from('report_jobs')
      .update({ status: 'processing' })
      .eq('id', reportJobId)

    console.log(`Processing report: ${reportJob.name}`)

    const parameters = reportJob.parameters
    const startDate = new Date(parameters.startDate)
    const endDate = new Date(parameters.endDate)

    // Generate report data based on type
    let reportData: any[] = []
    let fileName = ''

    switch (reportJob.type) {
      case 'sales':
        reportData = await generateSalesReport(supabase, reportJob.seller_id, startDate, endDate, parameters)
        fileName = `sales-report-${reportJobId}.csv`
        break
      case 'inventory':
        reportData = await generateInventoryReport(supabase, reportJob.seller_id, parameters)
        fileName = `inventory-report-${reportJobId}.csv`
        break
      case 'customer':
        reportData = await generateCustomerReport(supabase, reportJob.seller_id, startDate, endDate, parameters)
        fileName = `customer-report-${reportJobId}.csv`
        break
      case 'financial':
        reportData = await generateFinancialReport(supabase, reportJob.seller_id, startDate, endDate, parameters)
        fileName = `financial-report-${reportJobId}.csv`
        break
      default:
        throw new Error('Unsupported report type')
    }

    // Convert to CSV
    const csvContent = convertToCSV(reportData)
    const fileSize = new Blob([csvContent]).size

    // In a real implementation, you would upload to storage here
    const fileUrl = `https://example.com/reports/${fileName}`

    // Update report job with completion
    await supabase
      .from('report_jobs')
      .update({
        status: 'completed',
        file_url: fileUrl,
        file_size: fileSize,
        completed_at: new Date().toISOString()
      })
      .eq('id', reportJobId)

    console.log(`Report completed: ${reportJob.name}`)

    return new Response(
      JSON.stringify({ success: true, fileUrl, fileSize }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error generating report:', error)

    // Update report job with error
    if (req.body) {
      try {
        const { reportJobId } = await req.json()
        if (reportJobId) {
          const supabaseUrl = Deno.env.get('SUPABASE_URL')!
          const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
          const supabase = createClient<Database>(supabaseUrl, supabaseServiceKey)

          await supabase
            .from('report_jobs')
            .update({
              status: 'failed',
              error_message: error.message
            })
            .eq('id', reportJobId)
        }
      } catch (updateError) {
        console.error('Error updating failed report:', updateError)
      }
    }

    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})

async function generateSalesReport(supabase: any, sellerId: string, startDate: Date, endDate: Date, parameters: any) {
  const { data: orders } = await supabase
    .from('orders')
    .select(`
      *,
      order_items (
        quantity,
        unit_price,
        total_price,
        products (name, category, sku)
      )
    `)
    .eq('seller_id', sellerId)
    .gte('created_at', startDate.toISOString())
    .lte('created_at', endDate.toISOString())

  return (orders || []).map((order: any) => ({
    order_id: order.id,
    date: new Date(order.created_at).toLocaleDateString(),
    customer_name: order.customer_name,
    customer_email: order.customer_email,
    total_amount: order.total_amount,
    status: order.status,
    payment_status: order.payment_status,
    items_count: order.order_items?.length || 0,
    courier_partner: order.courier_partner || '',
    tracking_number: order.tracking_number || ''
  }))
}

async function generateInventoryReport(supabase: any, sellerId: string, parameters: any) {
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .eq('seller_id', sellerId)
    .eq('status', 'active')

  return (products || []).map((product: any) => ({
    product_id: product.id,
    name: product.name,
    sku: product.sku,
    category: product.category,
    current_stock: product.stock_quantity,
    low_stock_threshold: product.low_stock_threshold,
    price: product.price,
    status: product.stock_quantity <= (product.low_stock_threshold || 10) ? 'Low Stock' : 'In Stock',
    last_updated: new Date(product.updated_at).toLocaleDateString()
  }))
}

async function generateCustomerReport(supabase: any, sellerId: string, startDate: Date, endDate: Date, parameters: any) {
  const { data: customers } = await supabase
    .from('customers')
    .select('*')
    .eq('seller_id', sellerId)

  return (customers || []).map((customer: any) => ({
    customer_id: customer.id,
    name: customer.name,
    email: customer.email,
    phone: customer.phone || '',
    total_orders: customer.total_orders || 0,
    total_spent: customer.total_spent || 0,
    registration_date: new Date(customer.created_at).toLocaleDateString(),
    last_order_date: customer.updated_at ? new Date(customer.updated_at).toLocaleDateString() : ''
  }))
}

async function generateFinancialReport(supabase: any, sellerId: string, startDate: Date, endDate: Date, parameters: any) {
  const { data: payments } = await supabase
    .from('payments')
    .select('*')
    .eq('seller_id', sellerId)
    .gte('created_at', startDate.toISOString())
    .lte('created_at', endDate.toISOString())

  return (payments || []).map((payment: any) => ({
    payment_id: payment.id,
    order_id: payment.order_id || '',
    date: new Date(payment.created_at).toLocaleDateString(),
    amount: payment.amount,
    type: payment.type,
    status: payment.status,
    gateway: payment.gateway || '',
    transaction_id: payment.transaction_id || '',
    processed_date: payment.processed_at ? new Date(payment.processed_at).toLocaleDateString() : ''
  }))
}

function convertToCSV(data: any[]): string {
  if (data.length === 0) return ''

  const headers = Object.keys(data[0])
  const csvRows = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        const value = row[header]
        // Escape quotes and wrap in quotes if contains comma
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`
        }
        return value
      }).join(',')
    )
  ]

  return csvRows.join('\n')
}