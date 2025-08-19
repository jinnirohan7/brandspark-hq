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
      orders: {
        Row: {
          courier_partner: string | null
          created_at: string
          customer_email: string
          customer_name: string
          customer_phone: string | null
          estimated_delivery: string | null
          id: string
          payment_status: string | null
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
          estimated_delivery?: string | null
          id?: string
          payment_status?: string | null
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
          estimated_delivery?: string | null
          id?: string
          payment_status?: string | null
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
      returns: {
        Row: {
          created_at: string
          id: string
          notes: string | null
          order_id: string
          reason: string
          refund_amount: number | null
          seller_id: string
          status: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          notes?: string | null
          order_id: string
          reason: string
          refund_amount?: number | null
          seller_id: string
          status?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          notes?: string | null
          order_id?: string
          reason?: string
          refund_amount?: number | null
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
      sellers: {
        Row: {
          address: string | null
          bank_account: string | null
          company_name: string
          created_at: string
          email: string
          full_name: string
          gst_number: string | null
          id: string
          kyc_verified: boolean | null
          pan_number: string | null
          phone: string | null
          subscription_plan: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          address?: string | null
          bank_account?: string | null
          company_name: string
          created_at?: string
          email: string
          full_name: string
          gst_number?: string | null
          id?: string
          kyc_verified?: boolean | null
          pan_number?: string | null
          phone?: string | null
          subscription_plan?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          address?: string | null
          bank_account?: string | null
          company_name?: string
          created_at?: string
          email?: string
          full_name?: string
          gst_number?: string | null
          id?: string
          kyc_verified?: boolean | null
          pan_number?: string | null
          phone?: string | null
          subscription_plan?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
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
