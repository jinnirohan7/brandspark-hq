import { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from '@/contexts/AuthContext'

export interface ReportJob {
  id: string
  name: string
  type: string
  parameters: any
  status: 'queued' | 'processing' | 'completed' | 'failed'
  file_url?: string
  file_size?: number
  error_message?: string
  created_at: string
  completed_at?: string
}

export interface ReportParameters {
  reportType: string
  startDate: Date
  endDate: Date
  timeframe: string
  includeFields: string[]
  format: 'csv' | 'excel' | 'pdf'
}

export function useReportsData() {
  const { user } = useAuth()
  const [reports, setReports] = useState<ReportJob[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchReports = async () => {
    if (!user) return

    try {
      setLoading(true)
      setError(null)

      // Get seller ID
      const { data: seller } = await supabase
        .from('sellers')
        .select('id')
        .eq('user_id', user.id)
        .single()

      if (!seller) {
        throw new Error('Seller profile not found')
      }

      // Temporarily use mock data until types are updated
      const mockReports: ReportJob[] = [
        {
          id: '1',
          name: 'Sales Summary - December 2024',
          type: 'sales',
          parameters: {},
          status: 'completed',
          file_url: 'https://example.com/report1.csv',
          file_size: 2457600,
          created_at: '2024-12-15T10:00:00Z',
          completed_at: '2024-12-15T10:05:00Z'
        }
      ]

      setReports(mockReports)
    } catch (err) {
      console.error('Error fetching reports:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch reports')
    } finally {
      setLoading(false)
    }
  }

  const generateReport = async (parameters: ReportParameters) => {
    if (!user) throw new Error('User not authenticated')

    try {
      // Get seller ID
      const { data: seller } = await supabase
        .from('sellers')
        .select('id')
        .eq('user_id', user.id)
        .single()

      if (!seller) {
        throw new Error('Seller profile not found')
      }

      const reportName = `${parameters.reportType.charAt(0).toUpperCase() + parameters.reportType.slice(1)} Report - ${parameters.startDate.toLocaleDateString('en-IN')} to ${parameters.endDate.toLocaleDateString('en-IN')}`

      // Simulate report generation for now
      const mockReport: ReportJob = {
        id: Math.random().toString(36).substring(7),
        name: reportName,
        type: parameters.reportType,
        parameters: {
          startDate: parameters.startDate.toISOString(),
          endDate: parameters.endDate.toISOString(),
          timeframe: parameters.timeframe,
          includeFields: parameters.includeFields,
          format: parameters.format
        },
        status: 'processing',
        created_at: new Date().toISOString()
      }

      // Simulate processing delay
      setTimeout(async () => {
        mockReport.status = 'completed'
        mockReport.file_url = `https://example.com/${mockReport.id}.csv`
        mockReport.file_size = 1024 * 1024 // 1MB
        mockReport.completed_at = new Date().toISOString()
        await fetchReports()
      }, 3000)

      await fetchReports()
      return mockReport
    } catch (err) {
      console.error('Error generating report:', err)
      throw err
    }
  }

  const downloadReport = async (reportId: string) => {
    try {
      const report = reports.find(r => r.id === reportId)
      if (!report || !report.file_url) {
        throw new Error('Report file not found')
      }

      // Download file
      const response = await fetch(report.file_url)
      if (!response.ok) throw new Error('Failed to download report')

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${report.name}.${report.parameters.format || 'csv'}`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (err) {
      console.error('Error downloading report:', err)
      throw err
    }
  }

  useEffect(() => {
    fetchReports()
  }, [user])

  // Set up real-time subscription for report updates
  useEffect(() => {
    if (!user) return

    const channel = supabase
      .channel('report-updates')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'report_jobs'
        },
        () => {
          fetchReports()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user])

  return {
    reports,
    loading,
    error,
    generateReport,
    downloadReport,
    refetch: fetchReports
  }
}