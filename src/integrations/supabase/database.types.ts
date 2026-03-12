 
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
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      bookings: {
        Row: {
          booking_number: string
          check_in_time: string | null
          check_out_time: string | null
          created_at: string | null
          end_date: string
          id: string
          listing_id: string
          notes: string | null
          payment_status: string | null
          price_per_day: number
          renter_id: string
          start_date: string
          status: Database["public"]["Enums"]["booking_status"] | null
          total_amount: number
          total_days: number
          updated_at: string | null
          vendor_id: string
        }
        Insert: {
          booking_number: string
          check_in_time?: string | null
          check_out_time?: string | null
          created_at?: string | null
          end_date: string
          id?: string
          listing_id: string
          notes?: string | null
          payment_status?: string | null
          price_per_day: number
          renter_id: string
          start_date: string
          status?: Database["public"]["Enums"]["booking_status"] | null
          total_amount: number
          total_days: number
          updated_at?: string | null
          vendor_id: string
        }
        Update: {
          booking_number?: string
          check_in_time?: string | null
          check_out_time?: string | null
          created_at?: string | null
          end_date?: string
          id?: string
          listing_id?: string
          notes?: string | null
          payment_status?: string | null
          price_per_day?: number
          renter_id?: string
          start_date?: string
          status?: Database["public"]["Enums"]["booking_status"] | null
          total_amount?: number
          total_days?: number
          updated_at?: string | null
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_renter_id_fkey"
            columns: ["renter_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          created_at: string | null
          description: string | null
          icon: string | null
          id: string
          is_active: boolean | null
          item_count: number | null
          name: string
          slug: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          item_count?: number | null
          name: string
          slug: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          item_count?: number | null
          name?: string
          slug?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      disputes: {
        Row: {
          booking_id: string
          complainant_id: string
          created_at: string | null
          description: string
          evidence: Json | null
          id: string
          reason: string
          resolution: string | null
          resolved_at: string | null
          resolved_by: string | null
          respondent_id: string
          status: Database["public"]["Enums"]["dispute_status"] | null
          updated_at: string | null
        }
        Insert: {
          booking_id: string
          complainant_id: string
          created_at?: string | null
          description: string
          evidence?: Json | null
          id?: string
          reason: string
          resolution?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          respondent_id: string
          status?: Database["public"]["Enums"]["dispute_status"] | null
          updated_at?: string | null
        }
        Update: {
          booking_id?: string
          complainant_id?: string
          created_at?: string | null
          description?: string
          evidence?: Json | null
          id?: string
          reason?: string
          resolution?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          respondent_id?: string
          status?: Database["public"]["Enums"]["dispute_status"] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "disputes_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "disputes_complainant_id_fkey"
            columns: ["complainant_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "disputes_resolved_by_fkey"
            columns: ["resolved_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "disputes_respondent_id_fkey"
            columns: ["respondent_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      favorites: {
        Row: {
          created_at: string | null
          id: string
          listing_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          listing_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          listing_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "favorites_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "favorites_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      kyc_submissions: {
        Row: {
          created_at: string | null
          document_back: string | null
          document_front: string
          document_number: string
          document_type: string
          id: string
          rejection_reason: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          selfie: string
          status: Database["public"]["Enums"]["kyc_status"] | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          document_back?: string | null
          document_front: string
          document_number: string
          document_type: string
          id?: string
          rejection_reason?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          selfie: string
          status?: Database["public"]["Enums"]["kyc_status"] | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          document_back?: string | null
          document_front?: string
          document_number?: string
          document_type?: string
          id?: string
          rejection_reason?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          selfie?: string
          status?: Database["public"]["Enums"]["kyc_status"] | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "kyc_submissions_reviewed_by_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "kyc_submissions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      listings: {
        Row: {
          availability: Database["public"]["Enums"]["listing_status"] | null
          category_id: string | null
          condition: string | null
          created_at: string | null
          description: string
          id: string
          images: Json | null
          is_available: boolean | null
          is_featured: boolean | null
          location: string
          price_per_day: number
          price_per_month: number | null
          price_per_week: number | null
          rating: number | null
          review_count: number | null
          specifications: Json | null
          title: string
          updated_at: string | null
          vendor_id: string
          views: number | null
        }
        Insert: {
          availability?: Database["public"]["Enums"]["listing_status"] | null
          category_id?: string | null
          condition?: string | null
          created_at?: string | null
          description: string
          id?: string
          images?: Json | null
          is_available?: boolean | null
          is_featured?: boolean | null
          location: string
          price_per_day: number
          price_per_month?: number | null
          price_per_week?: number | null
          rating?: number | null
          review_count?: number | null
          specifications?: Json | null
          title: string
          updated_at?: string | null
          vendor_id: string
          views?: number | null
        }
        Update: {
          availability?: Database["public"]["Enums"]["listing_status"] | null
          category_id?: string | null
          condition?: string | null
          created_at?: string | null
          description?: string
          id?: string
          images?: Json | null
          is_available?: boolean | null
          is_featured?: boolean | null
          location?: string
          price_per_day?: number
          price_per_month?: number | null
          price_per_week?: number | null
          rating?: number | null
          review_count?: number | null
          specifications?: Json | null
          title?: string
          updated_at?: string | null
          vendor_id?: string
          views?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "listings_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "listings_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          attachments: Json | null
          conversation_id: string
          created_at: string | null
          id: string
          is_read: boolean | null
          listing_id: string | null
          message: string
          receiver_id: string
          sender_id: string
        }
        Insert: {
          attachments?: Json | null
          conversation_id: string
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          listing_id?: string | null
          message: string
          receiver_id: string
          sender_id: string
        }
        Update: {
          attachments?: Json | null
          conversation_id?: string
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          listing_id?: string | null
          message?: string
          receiver_id?: string
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_receiver_id_fkey"
            columns: ["receiver_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string | null
          data: Json | null
          id: string
          is_read: boolean | null
          message: string
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          data?: Json | null
          id?: string
          is_read?: boolean | null
          message: string
          title: string
          type: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          data?: Json | null
          id?: string
          is_read?: boolean | null
          message?: string
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      payouts: {
        Row: {
          account_name: string
          account_number: string
          amount: number
          bank_name: string
          created_at: string | null
          id: string
          notes: string | null
          processed_at: string | null
          processed_by: string | null
          reference: string
          status: Database["public"]["Enums"]["payout_status"] | null
          updated_at: string | null
          vendor_id: string
        }
        Insert: {
          account_name: string
          account_number: string
          amount: number
          bank_name: string
          created_at?: string | null
          id?: string
          notes?: string | null
          processed_at?: string | null
          processed_by?: string | null
          reference: string
          status?: Database["public"]["Enums"]["payout_status"] | null
          updated_at?: string | null
          vendor_id: string
        }
        Update: {
          account_name?: string
          account_number?: string
          amount?: number
          bank_name?: string
          created_at?: string | null
          id?: string
          notes?: string | null
          processed_at?: string | null
          processed_by?: string | null
          reference?: string
          status?: Database["public"]["Enums"]["payout_status"] | null
          updated_at?: string | null
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payouts_processed_by_fkey"
            columns: ["processed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payouts_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          is_active: boolean | null
          is_verified: boolean | null
          kyc_status: Database["public"]["Enums"]["kyc_status"] | null
          location: string | null
          phone: string | null
          role: Database["public"]["Enums"]["user_role"] | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          is_active?: boolean | null
          is_verified?: boolean | null
          kyc_status?: Database["public"]["Enums"]["kyc_status"] | null
          location?: string | null
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          is_active?: boolean | null
          is_verified?: boolean | null
          kyc_status?: Database["public"]["Enums"]["kyc_status"] | null
          location?: string | null
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
          updated_at?: string | null
        }
        Relationships: []
      }
      reviews: {
        Row: {
          booking_id: string | null
          comment: string | null
          created_at: string | null
          helpful_count: number | null
          id: string
          images: Json | null
          is_verified: boolean | null
          listing_id: string
          rating: number
          reviewer_id: string
          updated_at: string | null
          vendor_id: string
        }
        Insert: {
          booking_id?: string | null
          comment?: string | null
          created_at?: string | null
          helpful_count?: number | null
          id?: string
          images?: Json | null
          is_verified?: boolean | null
          listing_id: string
          rating: number
          reviewer_id: string
          updated_at?: string | null
          vendor_id: string
        }
        Update: {
          booking_id?: string | null
          comment?: string | null
          created_at?: string | null
          helpful_count?: number | null
          id?: string
          images?: Json | null
          is_verified?: boolean | null
          listing_id?: string
          rating?: number
          reviewer_id?: string
          updated_at?: string | null
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_reviewer_id_fkey"
            columns: ["reviewer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      wallet_transactions: {
        Row: {
          amount: number
          balance_after: number
          balance_before: number
          created_at: string | null
          description: string
          id: string
          metadata: Json | null
          reference: string
          status: string | null
          type: Database["public"]["Enums"]["transaction_type"]
          user_id: string
          wallet_id: string
        }
        Insert: {
          amount: number
          balance_after: number
          balance_before: number
          created_at?: string | null
          description: string
          id?: string
          metadata?: Json | null
          reference: string
          status?: string | null
          type: Database["public"]["Enums"]["transaction_type"]
          user_id: string
          wallet_id: string
        }
        Update: {
          amount?: number
          balance_after?: number
          balance_before?: number
          created_at?: string | null
          description?: string
          id?: string
          metadata?: Json | null
          reference?: string
          status?: string | null
          type?: Database["public"]["Enums"]["transaction_type"]
          user_id?: string
          wallet_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wallet_transactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wallet_transactions_wallet_id_fkey"
            columns: ["wallet_id"]
            isOneToOne: false
            referencedRelation: "wallets"
            referencedColumns: ["id"]
          },
        ]
      }
      wallets: {
        Row: {
          available_balance: number | null
          balance: number | null
          created_at: string | null
          id: string
          pending_balance: number | null
          total_earned: number | null
          total_spent: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          available_balance?: number | null
          balance?: number | null
          created_at?: string | null
          id?: string
          pending_balance?: number | null
          total_earned?: number | null
          total_spent?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          available_balance?: number | null
          balance?: number | null
          created_at?: string | null
          id?: string
          pending_balance?: number | null
          total_earned?: number | null
          total_spent?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wallets_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      booking_status:
        | "pending"
        | "confirmed"
        | "active"
        | "completed"
        | "cancelled"
        | "disputed"
      dispute_status: "open" | "in_progress" | "resolved" | "closed"
      kyc_status: "pending" | "approved" | "rejected"
      listing_status:
        | "draft"
        | "pending"
        | "approved"
        | "rejected"
        | "active"
        | "inactive"
        | "rented"
        | "maintenance"
      payout_status:
        | "pending"
        | "processing"
        | "approved"
        | "rejected"
        | "completed"
      transaction_type:
        | "credit"
        | "debit"
        | "refund"
        | "payout"
        | "booking"
        | "topup"
        | "fee"
      user_role: "admin" | "vendor" | "renter"
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
    Enums: {
      booking_status: [
        "pending",
        "confirmed",
        "active",
        "completed",
        "cancelled",
        "disputed",
      ],
      dispute_status: ["open", "in_progress", "resolved", "closed"],
      kyc_status: ["pending", "approved", "rejected"],
      listing_status: [
        "draft",
        "pending",
        "approved",
        "rejected",
        "active",
        "inactive",
        "rented",
        "maintenance",
      ],
      payout_status: [
        "pending",
        "processing",
        "approved",
        "rejected",
        "completed",
      ],
      transaction_type: [
        "credit",
        "debit",
        "refund",
        "payout",
        "booking",
        "topup",
        "fee",
      ],
      user_role: ["admin", "vendor", "renter"],
    },
  },
} as const
