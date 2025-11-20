export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      activity_logs: {
        Row: {
          action: string
          details: Json | null
          id: string
          ip_address: unknown
          seller_id: string | null
          seller_theme_id: string | null
          template_id: string | null
          timestamp: string | null
          user_agent: string | null
        }
        Insert: {
          action: string
          details?: Json | null
          id?: string
          ip_address?: unknown
          seller_id?: string | null
          seller_theme_id?: string | null
          template_id?: string | null
          timestamp?: string | null
          user_agent?: string | null
        }
        Update: {
          action?: string
          details?: Json | null
          id?: string
          ip_address?: unknown
          seller_id?: string | null
          seller_theme_id?: string | null
          template_id?: string | null
          timestamp?: string | null
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "activity_logs_seller_theme_id_fkey"
            columns: ["seller_theme_id"]
            isOneToOne: false
            referencedRelation: "seller_themes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activity_logs_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "templates"
            referencedColumns: ["id"]
          },
        ]
      }
      admin_sessions: {
        Row: {
          action_type: string
          admin_id: string
          created_at: string | null
          details: Json | null
          id: string
          ip_address: unknown
          target_id: string | null
          target_type: string | null
          user_agent: string | null
        }
        Insert: {
          action_type: string
          admin_id: string
          created_at?: string | null
          details?: Json | null
          id?: string
          ip_address?: unknown
          target_id?: string | null
          target_type?: string | null
          user_agent?: string | null
        }
        Update: {
          action_type?: string
          admin_id?: string
          created_at?: string | null
          details?: Json | null
          id?: string
          ip_address?: unknown
          target_id?: string | null
          target_type?: string | null
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "admin_sessions_admin_id_fkey"
            columns: ["admin_id"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
        ]
      }
      admin_settings: {
        Row: {
          category: string
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          setting_key: string
          setting_value: Json
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          category: string
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          setting_key: string
          setting_value: Json
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          category?: string
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          setting_key?: string
          setting_value?: Json
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "admin_settings_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
        ]
      }
      admin_users: {
        Row: {
          created_at: string | null
          email: string
          full_name: string
          id: string
          is_active: boolean | null
          last_login: string | null
          permissions: Json | null
          role: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          full_name: string
          id?: string
          is_active?: boolean | null
          last_login?: string | null
          permissions?: Json | null
          role?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          full_name?: string
          id?: string
          is_active?: boolean | null
          last_login?: string | null
          permissions?: Json | null
          role?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      ai_suggestions: {
        Row: {
          after: string | null
          applied: boolean | null
          before: string | null
          business_type: string
          changes: Json | null
          confidence: number | null
          created_at: string
          current_theme: Json
          description: string | null
          effort: string | null
          examples: Json | null
          feedback: string | null
          id: string
          impact: string | null
          liked: boolean | null
          preview_data: Json | null
          reasoning: string | null
          suggestions: Json
          title: string | null
          type: string | null
          user_id: string
        }
        Insert: {
          after?: string | null
          applied?: boolean | null
          before?: string | null
          business_type: string
          changes?: Json | null
          confidence?: number | null
          created_at?: string
          current_theme: Json
          description?: string | null
          effort?: string | null
          examples?: Json | null
          feedback?: string | null
          id?: string
          impact?: string | null
          liked?: boolean | null
          preview_data?: Json | null
          reasoning?: string | null
          suggestions: Json
          title?: string | null
          type?: string | null
          user_id: string
        }
        Update: {
          after?: string | null
          applied?: boolean | null
          before?: string | null
          business_type?: string
          changes?: Json | null
          confidence?: number | null
          created_at?: string
          current_theme?: Json
          description?: string | null
          effort?: string | null
          examples?: Json | null
          feedback?: string | null
          id?: string
          impact?: string | null
          liked?: boolean | null
          preview_data?: Json | null
          reasoning?: string | null
          suggestions?: Json
          title?: string | null
          type?: string | null
          user_id?: string
        }
        Relationships: []
      }
      coupons: {
        Row: {
          code: string
          created_at: string
          end_date: string | null
          id: string
          is_active: boolean | null
          min_order_amount: number | null
          name: string
          seller_id: string
          start_date: string | null
          type: string
          usage_limit: number | null
          used_count: number | null
          value: number
        }
        Insert: {
          code: string
          created_at?: string
          end_date?: string | null
          id?: string
          is_active?: boolean | null
          min_order_amount?: number | null
          name: string
          seller_id: string
          start_date?: string | null
          type: string
          usage_limit?: number | null
          used_count?: number | null
          value: number
        }
        Update: {
          code?: string
          created_at?: string
          end_date?: string | null
          id?: string
          is_active?: boolean | null
          min_order_amount?: number | null
          name?: string
          seller_id?: string
          start_date?: string | null
          type?: string
          usage_limit?: number | null
          used_count?: number | null
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "coupons_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "sellers"
            referencedColumns: ["id"]
          },
        ]
      }
      courier_partners: {
        Row: {
          api_endpoint: string | null
          api_key_encrypted: string | null
          contract_details: Json | null
          created_at: string | null
          id: string
          is_active: boolean | null
          name: string
          performance_metrics: Json | null
          pricing_config: Json | null
          supported_regions: Json | null
          updated_at: string | null
        }
        Insert: {
          api_endpoint?: string | null
          api_key_encrypted?: string | null
          contract_details?: Json | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          performance_metrics?: Json | null
          pricing_config?: Json | null
          supported_regions?: Json | null
          updated_at?: string | null
        }
        Update: {
          api_endpoint?: string | null
          api_key_encrypted?: string | null
          contract_details?: Json | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          performance_metrics?: Json | null
          pricing_config?: Json | null
          supported_regions?: Json | null
          updated_at?: string | null
        }
        Relationships: []
      }
      customers: {
        Row: {
          address: Json | null
          created_at: string
          email: string
          id: string
          name: string
          phone: string | null
          seller_id: string
          total_orders: number | null
          total_spent: number | null
          updated_at: string
        }
        Insert: {
          address?: Json | null
          created_at?: string
          email: string
          id?: string
          name: string
          phone?: string | null
          seller_id: string
          total_orders?: number | null
          total_spent?: number | null
          updated_at?: string
        }
        Update: {
          address?: Json | null
          created_at?: string
          email?: string
          id?: string
          name?: string
          phone?: string | null
          seller_id?: string
          total_orders?: number | null
          total_spent?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "customers_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "sellers"
            referencedColumns: ["id"]
          },
        ]
      }
      domains: {
        Row: {
          created_at: string | null
          dns_provider: string | null
          dns_records: Json | null
          domain_name: string
          domain_type: string | null
          id: string
          seller_id: string | null
          seller_theme_id: string | null
          ssl_status: string | null
          updated_at: string | null
          verification_status: string | null
        }
        Insert: {
          created_at?: string | null
          dns_provider?: string | null
          dns_records?: Json | null
          domain_name: string
          domain_type?: string | null
          id?: string
          seller_id?: string | null
          seller_theme_id?: string | null
          ssl_status?: string | null
          updated_at?: string | null
          verification_status?: string | null
        }
        Update: {
          created_at?: string | null
          dns_provider?: string | null
          dns_records?: Json | null
          domain_name?: string
          domain_type?: string | null
          id?: string
          seller_id?: string | null
          seller_theme_id?: string | null
          ssl_status?: string | null
          updated_at?: string | null
          verification_status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "domains_seller_theme_id_fkey"
            columns: ["seller_theme_id"]
            isOneToOne: false
            referencedRelation: "seller_themes"
            referencedColumns: ["id"]
          },
        ]
      }
      hosting_metrics: {
        Row: {
          bandwidth_gb: number | null
          cpu_usage: number | null
          created_at: string | null
          date: string
          id: string
          memory_usage: number | null
          page_views: number | null
          seller_theme_id: string | null
          unique_visitors: number | null
          uptime_percentage: number | null
        }
        Insert: {
          bandwidth_gb?: number | null
          cpu_usage?: number | null
          created_at?: string | null
          date: string
          id?: string
          memory_usage?: number | null
          page_views?: number | null
          seller_theme_id?: string | null
          unique_visitors?: number | null
          uptime_percentage?: number | null
        }
        Update: {
          bandwidth_gb?: number | null
          cpu_usage?: number | null
          created_at?: string | null
          date?: string
          id?: string
          memory_usage?: number | null
          page_views?: number | null
          seller_theme_id?: string | null
          unique_visitors?: number | null
          uptime_percentage?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "hosting_metrics_seller_theme_id_fkey"
            columns: ["seller_theme_id"]
            isOneToOne: false
            referencedRelation: "seller_themes"
            referencedColumns: ["id"]
          },
        ]
      }
      marketing_campaigns: {
        Row: {
          budget: number | null
          clicks: number | null
          conversions: number | null
          created_at: string
          end_date: string | null
          id: string
          impressions: number | null
          name: string
          seller_id: string
          spent: number | null
          start_date: string | null
          status: string | null
          type: string
          updated_at: string
        }
        Insert: {
          budget?: number | null
          clicks?: number | null
          conversions?: number | null
          created_at?: string
          end_date?: string | null
          id?: string
          impressions?: number | null
          name: string
          seller_id: string
          spent?: number | null
          start_date?: string | null
          status?: string | null
          type: string
          updated_at?: string
        }
        Update: {
          budget?: number | null
          clicks?: number | null
          conversions?: number | null
          created_at?: string
          end_date?: string | null
          id?: string
          impressions?: number | null
          name?: string
          seller_id?: string
          spent?: number | null
          start_date?: string | null
          status?: string | null
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "marketing_campaigns_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "sellers"
            referencedColumns: ["id"]
          },
        ]
      }
      ndrs: {
        Row: {
          auto_resolution_attempted: boolean | null
          created_at: string
          customer_response: string | null
          id: string
          ndr_reason: string
          next_action: string | null
          order_id: string
          resolution_status: string | null
          resolved_at: string | null
          seller_id: string
        }
        Insert: {
          auto_resolution_attempted?: boolean | null
          created_at?: string
          customer_response?: string | null
          id?: string
          ndr_reason: string
          next_action?: string | null
          order_id: string
          resolution_status?: string | null
          resolved_at?: string | null
          seller_id: string
        }
        Update: {
          auto_resolution_attempted?: boolean | null
          created_at?: string
          customer_response?: string | null
          id?: string
          ndr_reason?: string
          next_action?: string | null
          order_id?: string
          resolution_status?: string | null
          resolved_at?: string | null
          seller_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_ndr_order"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      order_items: {
        Row: {
          created_at: string
          id: string
          order_id: string
          product_id: string
          quantity: number
          total_price: number
          unit_price: number
        }
        Insert: {
          created_at?: string
          id?: string
          order_id: string
          product_id: string
          quantity: number
          total_price: number
          unit_price: number
        }
        Update: {
          created_at?: string
          id?: string
          order_id?: string
          product_id?: string
          quantity?: number
          total_price?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      order_notifications: {
        Row: {
          created_at: string
          customer_response: string | null
          id: string
          message: string
          notification_type: string
          order_id: string
          seller_id: string
          sent_at: string | null
          sent_via: string[] | null
          status: string | null
        }
        Insert: {
          created_at?: string
          customer_response?: string | null
          id?: string
          message: string
          notification_type: string
          order_id: string
          seller_id: string
          sent_at?: string | null
          sent_via?: string[] | null
          status?: string | null
        }
        Update: {
          created_at?: string
          customer_response?: string | null
          id?: string
          message?: string
          notification_type?: string
          order_id?: string
          seller_id?: string
          sent_at?: string | null
          sent_via?: string[] | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_notification_order"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      order_timeline: {
        Row: {
          created_at: string
          created_by: string | null
          event_data: Json | null
          event_description: string
          event_type: string
          id: string
          order_id: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          event_data?: Json | null
          event_description: string
          event_type: string
          id?: string
          order_id: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          event_data?: Json | null
          event_description?: string
          event_type?: string
          id?: string
          order_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_timeline_order"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          courier_partner: string | null
          created_at: string
          customer_email: string
          customer_name: string
          customer_phone: string | null
          delivery_attempts: number | null
          delivery_instructions: string | null
          duplicate_of: string | null
          estimated_delivery: string | null
          expected_delivery_date: string | null
          id: string
          is_duplicate: boolean | null
          last_ndr_date: string | null
          ndr_count: number | null
          order_source: string | null
          payment_status: string | null
          priority: string | null
          seller_id: string
          shipping_address: Json
          status: string | null
          total_amount: number
          tracking_number: string | null
          updated_at: string
        }
        Insert: {
          courier_partner?: string | null
          created_at?: string
          customer_email: string
          customer_name: string
          customer_phone?: string | null
          delivery_attempts?: number | null
          delivery_instructions?: string | null
          duplicate_of?: string | null
          estimated_delivery?: string | null
          expected_delivery_date?: string | null
          id?: string
          is_duplicate?: boolean | null
          last_ndr_date?: string | null
          ndr_count?: number | null
          order_source?: string | null
          payment_status?: string | null
          priority?: string | null
          seller_id: string
          shipping_address: Json
          status?: string | null
          total_amount: number
          tracking_number?: string | null
          updated_at?: string
        }
        Update: {
          courier_partner?: string | null
          created_at?: string
          customer_email?: string
          customer_name?: string
          customer_phone?: string | null
          delivery_attempts?: number | null
          delivery_instructions?: string | null
          duplicate_of?: string | null
          estimated_delivery?: string | null
          expected_delivery_date?: string | null
          id?: string
          is_duplicate?: boolean | null
          last_ndr_date?: string | null
          ndr_count?: number | null
          order_source?: string | null
          payment_status?: string | null
          priority?: string | null
          seller_id?: string
          shipping_address?: Json
          status?: string | null
          total_amount?: number
          tracking_number?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "sellers"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          created_at: string
          gateway: string | null
          id: string
          order_id: string | null
          processed_at: string | null
          seller_id: string
          status: string | null
          transaction_id: string | null
          type: string
        }
        Insert: {
          amount: number
          created_at?: string
          gateway?: string | null
          id?: string
          order_id?: string | null
          processed_at?: string | null
          seller_id: string
          status?: string | null
          transaction_id?: string | null
          type: string
        }
        Update: {
          amount?: number
          created_at?: string
          gateway?: string | null
          id?: string
          order_id?: string | null
          processed_at?: string | null
          seller_id?: string
          status?: string | null
          transaction_id?: string | null
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "sellers"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          category: string
          created_at: string
          description: string | null
          dimensions: Json | null
          id: string
          image_url: string | null
          low_stock_threshold: number | null
          name: string
          price: number
          seller_id: string
          sku: string
          status: string | null
          stock_quantity: number
          updated_at: string
          weight: number | null
        }
        Insert: {
          category: string
          created_at?: string
          description?: string | null
          dimensions?: Json | null
          id?: string
          image_url?: string | null
          low_stock_threshold?: number | null
          name: string
          price: number
          seller_id: string
          sku: string
          status?: string | null
          stock_quantity?: number
          updated_at?: string
          weight?: number | null
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          dimensions?: Json | null
          id?: string
          image_url?: string | null
          low_stock_threshold?: number | null
          name?: string
          price?: number
          seller_id?: string
          sku?: string
          status?: string | null
          stock_quantity?: number
          updated_at?: string
          weight?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "products_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "sellers"
            referencedColumns: ["id"]
          },
        ]
      }
      return_policies: {
        Row: {
          auto_approve: boolean | null
          conditions: Json | null
          created_at: string
          id: string
          is_active: boolean | null
          policy_name: string
          refund_percentage: number | null
          require_qc: boolean | null
          return_window_days: number
          seller_id: string
          shipping_charges_refundable: boolean | null
          updated_at: string
        }
        Insert: {
          auto_approve?: boolean | null
          conditions?: Json | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          policy_name: string
          refund_percentage?: number | null
          require_qc?: boolean | null
          return_window_days?: number
          seller_id: string
          shipping_charges_refundable?: boolean | null
          updated_at?: string
        }
        Update: {
          auto_approve?: boolean | null
          conditions?: Json | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          policy_name?: string
          refund_percentage?: number | null
          require_qc?: boolean | null
          return_window_days?: number
          seller_id?: string
          shipping_charges_refundable?: boolean | null
          updated_at?: string
        }
        Relationships: []
      }
      returns: {
        Row: {
          courier_partner: string | null
          created_at: string
          id: string
          notes: string | null
          order_id: string
          pickup_completed_at: string | null
          pickup_scheduled_at: string | null
          qc_notes: string | null
          qc_status: string | null
          reason: string
          refund_amount: number | null
          refund_processed_at: string | null
          return_policy_id: string | null
          return_tracking_number: string | null
          seller_id: string
          status: string | null
          updated_at: string
        }
        Insert: {
          courier_partner?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          order_id: string
          pickup_completed_at?: string | null
          pickup_scheduled_at?: string | null
          qc_notes?: string | null
          qc_status?: string | null
          reason: string
          refund_amount?: number | null
          refund_processed_at?: string | null
          return_policy_id?: string | null
          return_tracking_number?: string | null
          seller_id: string
          status?: string | null
          updated_at?: string
        }
        Update: {
          courier_partner?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          order_id?: string
          pickup_completed_at?: string | null
          pickup_scheduled_at?: string | null
          qc_notes?: string | null
          qc_status?: string | null
          reason?: string
          refund_amount?: number | null
          refund_processed_at?: string | null
          return_policy_id?: string | null
          return_tracking_number?: string | null
          seller_id?: string
          status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "returns_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "returns_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "sellers"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          comment: string | null
          created_at: string
          customer_name: string
          id: string
          product_id: string
          rating: number
          seller_id: string
          status: string | null
        }
        Insert: {
          comment?: string | null
          created_at?: string
          customer_name: string
          id?: string
          product_id: string
          rating: number
          seller_id: string
          status?: string | null
        }
        Update: {
          comment?: string | null
          created_at?: string
          customer_name?: string
          id?: string
          product_id?: string
          rating?: number
          seller_id?: string
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reviews_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "sellers"
            referencedColumns: ["id"]
          },
        ]
      }
      seller_documents: {
        Row: {
          created_at: string | null
          document_name: string
          document_number: string | null
          document_type: string
          expires_at: string | null
          file_path: string
          file_size: number | null
          id: string
          issuing_authority: string | null
          mime_type: string | null
          remarks: string | null
          seller_id: string
          updated_at: string | null
          uploaded_at: string | null
          verification_status: string | null
          verified_at: string | null
        }
        Insert: {
          created_at?: string | null
          document_name: string
          document_number?: string | null
          document_type: string
          expires_at?: string | null
          file_path: string
          file_size?: number | null
          id?: string
          issuing_authority?: string | null
          mime_type?: string | null
          remarks?: string | null
          seller_id: string
          updated_at?: string | null
          uploaded_at?: string | null
          verification_status?: string | null
          verified_at?: string | null
        }
        Update: {
          created_at?: string | null
          document_name?: string
          document_number?: string | null
          document_type?: string
          expires_at?: string | null
          file_path?: string
          file_size?: number | null
          id?: string
          issuing_authority?: string | null
          mime_type?: string | null
          remarks?: string | null
          seller_id?: string
          updated_at?: string | null
          uploaded_at?: string | null
          verification_status?: string | null
          verified_at?: string | null
        }
        Relationships: []
      }
      seller_payouts: {
        Row: {
          amount: number
          bank_details: Json | null
          created_at: string | null
          currency: string | null
          fees: number | null
          id: string
          notes: string | null
          payout_date: string
          period_end: string
          period_start: string
          processed_at: string | null
          processed_by: string | null
          seller_id: string
          status: string | null
          tax_deducted: number | null
          transaction_reference: string | null
          updated_at: string | null
        }
        Insert: {
          amount: number
          bank_details?: Json | null
          created_at?: string | null
          currency?: string | null
          fees?: number | null
          id?: string
          notes?: string | null
          payout_date: string
          period_end: string
          period_start: string
          processed_at?: string | null
          processed_by?: string | null
          seller_id: string
          status?: string | null
          tax_deducted?: number | null
          transaction_reference?: string | null
          updated_at?: string | null
        }
        Update: {
          amount?: number
          bank_details?: Json | null
          created_at?: string | null
          currency?: string | null
          fees?: number | null
          id?: string
          notes?: string | null
          payout_date?: string
          period_end?: string
          period_start?: string
          processed_at?: string | null
          processed_by?: string | null
          seller_id?: string
          status?: string | null
          tax_deducted?: number | null
          transaction_reference?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "seller_payouts_processed_by_fkey"
            columns: ["processed_by"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "seller_payouts_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "sellers"
            referencedColumns: ["id"]
          },
        ]
      }
      seller_subscriptions: {
        Row: {
          auto_renew: boolean | null
          created_at: string | null
          expires_at: string | null
          id: string
          payment_method: string | null
          plan_id: string
          seller_id: string
          started_at: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          auto_renew?: boolean | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          payment_method?: string | null
          plan_id: string
          seller_id: string
          started_at?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          auto_renew?: boolean | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          payment_method?: string | null
          plan_id?: string
          seller_id?: string
          started_at?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "seller_subscriptions_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "subscription_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      seller_themes: {
        Row: {
          created_at: string | null
          custom_domain: string | null
          customizations: Json | null
          hosting_config: Json | null
          id: string
          last_published: string | null
          seller_id: string | null
          ssl_enabled: boolean | null
          status: string | null
          subdomain: string | null
          template_id: string | null
          theme_name: string
          updated_at: string | null
          version: number | null
        }
        Insert: {
          created_at?: string | null
          custom_domain?: string | null
          customizations?: Json | null
          hosting_config?: Json | null
          id?: string
          last_published?: string | null
          seller_id?: string | null
          ssl_enabled?: boolean | null
          status?: string | null
          subdomain?: string | null
          template_id?: string | null
          theme_name: string
          updated_at?: string | null
          version?: number | null
        }
        Update: {
          created_at?: string | null
          custom_domain?: string | null
          customizations?: Json | null
          hosting_config?: Json | null
          id?: string
          last_published?: string | null
          seller_id?: string | null
          ssl_enabled?: boolean | null
          status?: string | null
          subdomain?: string | null
          template_id?: string | null
          theme_name?: string
          updated_at?: string | null
          version?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "seller_themes_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "templates"
            referencedColumns: ["id"]
          },
        ]
      }
      sellers: {
        Row: {
          account_status: string | null
          address: string | null
          annual_turnover: number | null
          bank_account: string | null
          brand_certificate_url: string | null
          business_category: string | null
          business_type: string | null
          city: string | null
          company_name: string
          compliance_status: string | null
          country: string | null
          created_at: string
          email: string
          employee_count: number | null
          establishment_date: string | null
          fssai_license: string | null
          full_name: string
          gst_number: string | null
          id: string
          ifsc_code: string | null
          kyc_verified: boolean | null
          last_login: string | null
          pan_number: string | null
          phone: string | null
          pincode: string | null
          preferred_currency: string | null
          preferred_language: string | null
          profile_image_url: string | null
          shop_establishment_license: string | null
          state: string | null
          subscription_plan: string | null
          tax_id: string | null
          two_factor_enabled: boolean | null
          updated_at: string
          upi_id: string | null
          user_id: string
          vat_number: string | null
          verification_score: number | null
          website_url: string | null
        }
        Insert: {
          account_status?: string | null
          address?: string | null
          annual_turnover?: number | null
          bank_account?: string | null
          brand_certificate_url?: string | null
          business_category?: string | null
          business_type?: string | null
          city?: string | null
          company_name: string
          compliance_status?: string | null
          country?: string | null
          created_at?: string
          email: string
          employee_count?: number | null
          establishment_date?: string | null
          fssai_license?: string | null
          full_name: string
          gst_number?: string | null
          id?: string
          ifsc_code?: string | null
          kyc_verified?: boolean | null
          last_login?: string | null
          pan_number?: string | null
          phone?: string | null
          pincode?: string | null
          preferred_currency?: string | null
          preferred_language?: string | null
          profile_image_url?: string | null
          shop_establishment_license?: string | null
          state?: string | null
          subscription_plan?: string | null
          tax_id?: string | null
          two_factor_enabled?: boolean | null
          updated_at?: string
          upi_id?: string | null
          user_id: string
          vat_number?: string | null
          verification_score?: number | null
          website_url?: string | null
        }
        Update: {
          account_status?: string | null
          address?: string | null
          annual_turnover?: number | null
          bank_account?: string | null
          brand_certificate_url?: string | null
          business_category?: string | null
          business_type?: string | null
          city?: string | null
          company_name?: string
          compliance_status?: string | null
          country?: string | null
          created_at?: string
          email?: string
          employee_count?: number | null
          establishment_date?: string | null
          fssai_license?: string | null
          full_name?: string
          gst_number?: string | null
          id?: string
          ifsc_code?: string | null
          kyc_verified?: boolean | null
          last_login?: string | null
          pan_number?: string | null
          phone?: string | null
          pincode?: string | null
          preferred_currency?: string | null
          preferred_language?: string | null
          profile_image_url?: string | null
          shop_establishment_license?: string | null
          state?: string | null
          subscription_plan?: string | null
          tax_id?: string | null
          two_factor_enabled?: boolean | null
          updated_at?: string
          upi_id?: string | null
          user_id?: string
          vat_number?: string | null
          verification_score?: number | null
          website_url?: string | null
        }
        Relationships: []
      }
      subscription_plans: {
        Row: {
          billing_cycle: string | null
          commission_rate: number | null
          created_at: string | null
          currency: string | null
          features: Json | null
          id: string
          is_active: boolean | null
          max_orders: number | null
          max_products: number | null
          name: string
          price: number
          storage_limit_gb: number | null
          support_level: string | null
          updated_at: string | null
        }
        Insert: {
          billing_cycle?: string | null
          commission_rate?: number | null
          created_at?: string | null
          currency?: string | null
          features?: Json | null
          id?: string
          is_active?: boolean | null
          max_orders?: number | null
          max_products?: number | null
          name: string
          price: number
          storage_limit_gb?: number | null
          support_level?: string | null
          updated_at?: string | null
        }
        Update: {
          billing_cycle?: string | null
          commission_rate?: number | null
          created_at?: string | null
          currency?: string | null
          features?: Json | null
          id?: string
          is_active?: boolean | null
          max_orders?: number | null
          max_products?: number | null
          name?: string
          price?: number
          storage_limit_gb?: number | null
          support_level?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      template_ratings: {
        Row: {
          created_at: string | null
          id: string
          rating: number | null
          review: string | null
          seller_id: string | null
          template_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          rating?: number | null
          review?: string | null
          seller_id?: string | null
          template_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          rating?: number | null
          review?: string | null
          seller_id?: string | null
          template_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "template_ratings_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "templates"
            referencedColumns: ["id"]
          },
        ]
      }
      templates: {
        Row: {
          category: string | null
          description: string | null
          downloads: number | null
          file_path: string | null
          id: string
          is_premium: boolean | null
          name: string
          preview_url: string | null
          price: number | null
          rating: number | null
          stack: string | null
          status: string | null
          tags: string[] | null
          updated_at: string | null
          upload_date: string | null
          version: string | null
        }
        Insert: {
          category?: string | null
          description?: string | null
          downloads?: number | null
          file_path?: string | null
          id?: string
          is_premium?: boolean | null
          name: string
          preview_url?: string | null
          price?: number | null
          rating?: number | null
          stack?: string | null
          status?: string | null
          tags?: string[] | null
          updated_at?: string | null
          upload_date?: string | null
          version?: string | null
        }
        Update: {
          category?: string | null
          description?: string | null
          downloads?: number | null
          file_path?: string | null
          id?: string
          is_premium?: boolean | null
          name?: string
          preview_url?: string | null
          price?: number | null
          rating?: number | null
          stack?: string | null
          status?: string | null
          tags?: string[] | null
          updated_at?: string | null
          upload_date?: string | null
          version?: string | null
        }
        Relationships: []
      }
      theme_versions: {
        Row: {
          created_at: string
          customizations_json: Json
          id: string
          published_at: string | null
          seller_theme_id: string | null
          user_theme_id: string
          version_number: number
        }
        Insert: {
          created_at?: string
          customizations_json?: Json
          id?: string
          published_at?: string | null
          seller_theme_id?: string | null
          user_theme_id: string
          version_number?: number
        }
        Update: {
          created_at?: string
          customizations_json?: Json
          id?: string
          published_at?: string | null
          seller_theme_id?: string | null
          user_theme_id?: string
          version_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "theme_versions_seller_theme_id_fkey"
            columns: ["seller_theme_id"]
            isOneToOne: false
            referencedRelation: "seller_themes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "theme_versions_user_theme_id_fkey"
            columns: ["user_theme_id"]
            isOneToOne: false
            referencedRelation: "user_themes"
            referencedColumns: ["id"]
          },
        ]
      }
      user_themes: {
        Row: {
          created_at: string
          customizations_json: Json
          id: string
          is_active: boolean | null
          theme_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          customizations_json?: Json
          id?: string
          is_active?: boolean | null
          theme_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          customizations_json?: Json
          id?: string
          is_active?: boolean | null
          theme_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_themes_theme_id_fkey"
            columns: ["theme_id"]
            isOneToOne: false
            referencedRelation: "website_themes"
            referencedColumns: ["id"]
          },
        ]
      }
      website_analytics: {
        Row: {
          avg_session_duration: number | null
          bounce_rate: number | null
          conversion_rate: number | null
          created_at: string
          date: string
          device_types: Json | null
          id: string
          page_views: number | null
          revenue: number | null
          top_pages: Json | null
          traffic_sources: Json | null
          unique_visitors: number | null
          website_id: string
        }
        Insert: {
          avg_session_duration?: number | null
          bounce_rate?: number | null
          conversion_rate?: number | null
          created_at?: string
          date: string
          device_types?: Json | null
          id?: string
          page_views?: number | null
          revenue?: number | null
          top_pages?: Json | null
          traffic_sources?: Json | null
          unique_visitors?: number | null
          website_id: string
        }
        Update: {
          avg_session_duration?: number | null
          bounce_rate?: number | null
          conversion_rate?: number | null
          created_at?: string
          date?: string
          device_types?: Json | null
          id?: string
          page_views?: number | null
          revenue?: number | null
          top_pages?: Json | null
          traffic_sources?: Json | null
          unique_visitors?: number | null
          website_id?: string
        }
        Relationships: []
      }
      website_orders: {
        Row: {
          billing_address: Json | null
          created_at: string
          customer_email: string
          customer_name: string
          customer_phone: string | null
          discount_amount: number | null
          id: string
          items: Json
          notes: string | null
          order_number: string
          order_status: string | null
          payment_method: string
          payment_status: string | null
          shipping_address: Json
          shipping_cost: number | null
          subtotal: number
          tax_amount: number | null
          total_amount: number
          tracking_number: string | null
          updated_at: string
          website_id: string
        }
        Insert: {
          billing_address?: Json | null
          created_at?: string
          customer_email: string
          customer_name: string
          customer_phone?: string | null
          discount_amount?: number | null
          id?: string
          items: Json
          notes?: string | null
          order_number: string
          order_status?: string | null
          payment_method: string
          payment_status?: string | null
          shipping_address: Json
          shipping_cost?: number | null
          subtotal: number
          tax_amount?: number | null
          total_amount: number
          tracking_number?: string | null
          updated_at?: string
          website_id: string
        }
        Update: {
          billing_address?: Json | null
          created_at?: string
          customer_email?: string
          customer_name?: string
          customer_phone?: string | null
          discount_amount?: number | null
          id?: string
          items?: Json
          notes?: string | null
          order_number?: string
          order_status?: string | null
          payment_method?: string
          payment_status?: string | null
          shipping_address?: Json
          shipping_cost?: number | null
          subtotal?: number
          tax_amount?: number | null
          total_amount?: number
          tracking_number?: string | null
          updated_at?: string
          website_id?: string
        }
        Relationships: []
      }
      website_pages: {
        Row: {
          content: Json
          created_at: string
          id: string
          is_published: boolean | null
          page_type: string
          seo_description: string | null
          seo_keywords: string[] | null
          seo_title: string | null
          slug: string
          title: string
          updated_at: string
          website_id: string
        }
        Insert: {
          content: Json
          created_at?: string
          id?: string
          is_published?: boolean | null
          page_type: string
          seo_description?: string | null
          seo_keywords?: string[] | null
          seo_title?: string | null
          slug: string
          title: string
          updated_at?: string
          website_id: string
        }
        Update: {
          content?: Json
          created_at?: string
          id?: string
          is_published?: boolean | null
          page_type?: string
          seo_description?: string | null
          seo_keywords?: string[] | null
          seo_title?: string | null
          slug?: string
          title?: string
          updated_at?: string
          website_id?: string
        }
        Relationships: []
      }
      website_reviews: {
        Row: {
          comment: string | null
          created_at: string
          customer_email: string
          customer_name: string
          helpful_count: number | null
          id: string
          images: string[] | null
          is_approved: boolean | null
          is_verified: boolean | null
          order_id: string | null
          product_id: string | null
          rating: number
          title: string | null
          videos: string[] | null
          website_id: string
        }
        Insert: {
          comment?: string | null
          created_at?: string
          customer_email: string
          customer_name: string
          helpful_count?: number | null
          id?: string
          images?: string[] | null
          is_approved?: boolean | null
          is_verified?: boolean | null
          order_id?: string | null
          product_id?: string | null
          rating: number
          title?: string | null
          videos?: string[] | null
          website_id: string
        }
        Update: {
          comment?: string | null
          created_at?: string
          customer_email?: string
          customer_name?: string
          helpful_count?: number | null
          id?: string
          images?: string[] | null
          is_approved?: boolean | null
          is_verified?: boolean | null
          order_id?: string | null
          product_id?: string | null
          rating?: number
          title?: string | null
          videos?: string[] | null
          website_id?: string
        }
        Relationships: []
      }
      website_themes: {
        Row: {
          category: string
          created_at: string
          description: string | null
          downloads: number | null
          id: string
          is_featured: boolean | null
          is_premium: boolean | null
          layout_json: Json | null
          name: string
          preview_image_url: string | null
          price: number | null
          rating: number | null
          tags: string[] | null
          template_data: Json
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          description?: string | null
          downloads?: number | null
          id?: string
          is_featured?: boolean | null
          is_premium?: boolean | null
          layout_json?: Json | null
          name: string
          preview_image_url?: string | null
          price?: number | null
          rating?: number | null
          tags?: string[] | null
          template_data: Json
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          downloads?: number | null
          id?: string
          is_featured?: boolean | null
          is_premium?: boolean | null
          layout_json?: Json | null
          name?: string
          preview_image_url?: string | null
          price?: number | null
          rating?: number | null
          tags?: string[] | null
          template_data?: Json
          updated_at?: string
        }
        Relationships: []
      }
      website_widgets: {
        Row: {
          category: string
          created_at: string
          description: string | null
          id: string
          is_premium: boolean | null
          name: string
          preview_image_url: string | null
          widget_config: Json
        }
        Insert: {
          category: string
          created_at?: string
          description?: string | null
          id?: string
          is_premium?: boolean | null
          name: string
          preview_image_url?: string | null
          widget_config: Json
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          is_premium?: boolean | null
          name?: string
          preview_image_url?: string | null
          widget_config?: Json
        }
        Relationships: []
      }
      websites: {
        Row: {
          business_hours: Json | null
          contact_email: string | null
          contact_phone: string | null
          created_at: string
          custom_css: string | null
          domain_name: string | null
          facebook_pixel_id: string | null
          favicon_url: string | null
          google_analytics_id: string | null
          id: string
          is_active: boolean | null
          logo_url: string | null
          privacy_policy: string | null
          return_policy: string | null
          seller_id: string
          seo_description: string | null
          seo_keywords: string[] | null
          seo_title: string | null
          shipping_info: Json | null
          site_name: string
          social_links: Json | null
          ssl_enabled: boolean | null
          subdomain: string
          terms_of_service: string | null
          theme_id: string | null
          updated_at: string
        }
        Insert: {
          business_hours?: Json | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          custom_css?: string | null
          domain_name?: string | null
          facebook_pixel_id?: string | null
          favicon_url?: string | null
          google_analytics_id?: string | null
          id?: string
          is_active?: boolean | null
          logo_url?: string | null
          privacy_policy?: string | null
          return_policy?: string | null
          seller_id: string
          seo_description?: string | null
          seo_keywords?: string[] | null
          seo_title?: string | null
          shipping_info?: Json | null
          site_name: string
          social_links?: Json | null
          ssl_enabled?: boolean | null
          subdomain: string
          terms_of_service?: string | null
          theme_id?: string | null
          updated_at?: string
        }
        Update: {
          business_hours?: Json | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          custom_css?: string | null
          domain_name?: string | null
          facebook_pixel_id?: string | null
          favicon_url?: string | null
          google_analytics_id?: string | null
          id?: string
          is_active?: boolean | null
          logo_url?: string | null
          privacy_policy?: string | null
          return_policy?: string | null
          seller_id?: string
          seo_description?: string | null
          seo_keywords?: string[] | null
          seo_title?: string | null
          shipping_info?: Json | null
          site_name?: string
          social_links?: Json | null
          ssl_enabled?: boolean | null
          subdomain?: string
          terms_of_service?: string | null
          theme_id?: string | null
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_admin_permissions: { Args: { _user_id: string }; Returns: Json }
      increment_downloads: { Args: { theme_id: string }; Returns: undefined }
      is_admin: { Args: { _user_id: string }; Returns: boolean }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
