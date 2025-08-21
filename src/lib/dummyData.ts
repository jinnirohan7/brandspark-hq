import { Order, OrderItem } from '@/hooks/useOrders'

// Generate random data helpers
const randomDate = (start: Date, end: Date) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

const randomChoice = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

const randomNumber = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

// Mock data arrays
const firstNames = ['Rajesh', 'Priya', 'Amit', 'Sneha', 'Vikram', 'Anita', 'Rohit', 'Kavya', 'Suresh', 'Deepika', 'Arjun', 'Pooja', 'Kiran', 'Meera', 'Ravi'];
const lastNames = ['Sharma', 'Patel', 'Kumar', 'Singh', 'Reddy', 'Agarwal', 'Gupta', 'Mehta', 'Joshi', 'Iyer', 'Nair', 'Chopra', 'Bansal', 'Verma', 'Malhotra'];

const products = [
  { id: 'prod-1', name: 'Wireless Bluetooth Headphones', sku: 'WBH-001', price: 2499, image_url: '/placeholder.svg' },
  { id: 'prod-2', name: 'Smart Fitness Watch', sku: 'SFW-002', price: 5999, image_url: '/placeholder.svg' },
  { id: 'prod-3', name: 'Laptop Stand Adjustable', sku: 'LSA-003', price: 899, image_url: '/placeholder.svg' },
  { id: 'prod-4', name: 'USB-C Fast Charging Cable', sku: 'UFC-004', price: 299, image_url: '/placeholder.svg' },
  { id: 'prod-5', name: 'Wireless Mouse Ergonomic', sku: 'WME-005', price: 1299, image_url: '/placeholder.svg' },
  { id: 'prod-6', name: 'Smartphone Camera Lens Kit', sku: 'SCL-006', price: 1799, image_url: '/placeholder.svg' },
  { id: 'prod-7', name: 'Portable Bluetooth Speaker', sku: 'PBS-007', price: 1999, image_url: '/placeholder.svg' },
  { id: 'prod-8', name: 'Gaming Mechanical Keyboard', sku: 'GMK-008', price: 3499, image_url: '/placeholder.svg' },
  { id: 'prod-9', name: 'Desk Organizer with Charging', sku: 'DOC-009', price: 1599, image_url: '/placeholder.svg' },
  { id: 'prod-10', name: 'LED Ring Light for Video', sku: 'LRL-010', price: 2199, image_url: '/placeholder.svg' },
];

const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad', 'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow', 'Kanpur', 'Nagpur', 'Indore', 'Bhopal', 'Visakhapatnam'];
const states = ['Maharashtra', 'Delhi', 'Karnataka', 'Tamil Nadu', 'West Bengal', 'Telangana', 'Gujarat', 'Rajasthan', 'Uttar Pradesh', 'Madhya Pradesh', 'Andhra Pradesh'];

const orderStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned'];
const paymentStatuses = ['pending', 'paid', 'failed', 'refunded', 'partially_refunded'];
const courierPartners = ['Blue Dart', 'FedEx', 'DTDC', 'Delhivery', 'Ecom Express', 'Aramex', 'India Post'];

export const generateDummyOrders = (count: number = 100): Order[] => {
  const orders: Order[] = [];
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - 6); // 6 months ago
  
  for (let i = 0; i < count; i++) {
    const customerFirstName = randomChoice(firstNames);
    const customerLastName = randomChoice(lastNames);
    const customerName = `${customerFirstName} ${customerLastName}`;
    const orderId = `ORD-${Date.now()}-${i.toString().padStart(3, '0')}`;
    const createdAt = randomDate(startDate, new Date());
    
    // Generate order items
    const itemCount = randomNumber(1, 4);
    const orderItems: OrderItem[] = [];
    let totalAmount = 0;
    
    for (let j = 0; j < itemCount; j++) {
      const product = randomChoice(products);
      const quantity = randomNumber(1, 3);
      const unitPrice = product.price;
      const totalPrice = unitPrice * quantity;
      
      orderItems.push({
        id: `item-${orderId}-${j}`,
        order_id: orderId,
        product_id: product.id,
        quantity,
        unit_price: unitPrice,
        total_price: totalPrice,
        product: {
          name: product.name,
          sku: product.sku,
          image_url: product.image_url,
        },
      });
      
      totalAmount += totalPrice;
    }
    
    // Add shipping if order is above threshold
    if (totalAmount < 1000) {
      totalAmount += 99; // Shipping cost
    }
    
    const city = randomChoice(cities);
    const state = randomChoice(states);
    
    const order: Order = {
      id: orderId,
      customer_name: customerName,
      customer_email: `${customerFirstName.toLowerCase()}.${customerLastName.toLowerCase()}@email.com`,
      customer_phone: `+91 ${randomNumber(7000000000, 9999999999)}`,
      total_amount: totalAmount,
      status: randomChoice(orderStatuses),
      payment_status: randomChoice(paymentStatuses),
      tracking_number: Math.random() > 0.3 ? `TRK${randomNumber(100000000, 999999999)}` : undefined,
      courier_partner: Math.random() > 0.3 ? randomChoice(courierPartners) : undefined,
      shipping_address: {
        street: `${randomNumber(1, 999)} ${randomChoice(['MG Road', 'Brigade Road', 'Commercial Street', 'Residency Road', 'Church Street'])}`,
        city,
        state,
        pincode: randomNumber(100000, 999999).toString(),
        country: 'India',
      },
      estimated_delivery: randomDate(createdAt, new Date(createdAt.getTime() + 14 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0],
      created_at: createdAt.toISOString(),
      updated_at: randomDate(createdAt, new Date()).toISOString(),
      order_items: orderItems,
    };
    
    orders.push(order);
  }
  
  return orders.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
};

// Analytics dummy data
export const generateAnalyticsData = () => {
  const currentDate = new Date();
  const months = [];
  
  // Generate 12 months of data
  for (let i = 11; i >= 0; i--) {
    const date = new Date(currentDate);
    date.setMonth(date.getMonth() - i);
    
    const monthName = date.toLocaleDateString('en-US', { month: 'short' });
    const baseRevenue = 50000 + Math.random() * 100000;
    const visitors = Math.floor(5000 + Math.random() * 10000);
    const orders = Math.floor(visitors * (0.02 + Math.random() * 0.08)); // 2-10% conversion
    
    months.push({
      month: monthName,
      sales: Math.floor(baseRevenue),
      visitors,
      orders,
      conversion: ((orders / visitors) * 100).toFixed(2),
      pageViews: Math.floor(visitors * (1.5 + Math.random() * 2)), // 1.5-3.5 pages per visitor
    });
  }
  
  return months;
};

export const generateTrafficSources = () => [
  { name: 'Organic Search', value: 42, color: 'hsl(var(--primary))' },
  { name: 'Direct Traffic', value: 28, color: 'hsl(var(--secondary))' },
  { name: 'Social Media', value: 15, color: 'hsl(var(--accent))' },
  { name: 'Paid Advertising', value: 10, color: 'hsl(var(--muted))' },
  { name: 'Email Marketing', value: 5, color: 'hsl(var(--destructive))' },
];

export const generateTopProducts = () => {
  return products.slice(0, 8).map((product, index) => ({
    ...product,
    sales: randomNumber(50, 300),
    revenue: randomNumber(25000, 150000),
    growth: Math.random() > 0.2 ? `+${randomNumber(5, 25)}%` : `-${randomNumber(1, 8)}%`,
    views: randomNumber(500, 2000),
    conversionRate: (Math.random() * 10 + 2).toFixed(1),
  }));
};

export const generateRevenueByCategory = () => [
  { category: 'Electronics', revenue: 245000, orders: 1250, color: 'hsl(var(--primary))' },
  { category: 'Accessories', revenue: 189000, orders: 890, color: 'hsl(var(--secondary))' },
  { category: 'Gaming', revenue: 156000, orders: 445, color: 'hsl(var(--accent))' },
  { category: 'Mobile', revenue: 198000, orders: 780, color: 'hsl(var(--muted))' },
  { category: 'Audio', revenue: 134000, orders: 670, color: 'hsl(var(--destructive))' },
];

export const generateCustomerMetrics = () => ({
  totalCustomers: 12847,
  newCustomers: 1256,
  returningCustomers: 8934,
  customerRetentionRate: 69.2,
  averageOrderValue: 2847,
  customerLifetimeValue: 8956,
});

export const generateInventoryAlerts = () => [
  { product: 'Wireless Headphones', sku: 'WBH-001', currentStock: 5, threshold: 10, status: 'low' },
  { product: 'Gaming Keyboard', sku: 'GMK-008', currentStock: 2, threshold: 15, status: 'critical' },
  { product: 'Smart Watch', sku: 'SFW-002', currentStock: 8, threshold: 20, status: 'low' },
  { product: 'USB Cable', sku: 'UFC-004', currentStock: 0, threshold: 50, status: 'out_of_stock' },
];