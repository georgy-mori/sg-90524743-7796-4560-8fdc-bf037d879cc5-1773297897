import { supabase } from "@/integrations/supabase/client";

class AdminService {
  // User Management
  async getAllUsers(filters?: {
    role?: string;
    search?: string;
    status?: string;
  }) {
    try {
      let query = supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (filters?.role) {
        query = query.eq("role", filters.role);
      }

      if (filters?.search) {
        query = query.or(`full_name.ilike.%${filters.search}%,email.ilike.%${filters.search}%`);
      }

      if (filters?.status) {
        query = query.eq("status", filters.status);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    } catch (error: any) {
      console.error("Get all users error:", error);
      throw new Error(error.message || "Failed to fetch users");
    }
  }

  async updateUserStatus(userId: string, status: "active" | "suspended" | "banned") {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .update({ status })
        .eq("id", userId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error: any) {
      console.error("Update user status error:", error);
      throw new Error(error.message || "Failed to update user status");
    }
  }

  async deleteUser(userId: string) {
    try {
      const { error } = await supabase
        .from("profiles")
        .delete()
        .eq("id", userId);

      if (error) throw error;
    } catch (error: any) {
      console.error("Delete user error:", error);
      throw new Error(error.message || "Failed to delete user");
    }
  }

  // Vendor Management
  async getPendingVendors() {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("role", "vendor")
        .eq("status", "pending")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error: any) {
      console.error("Get pending vendors error:", error);
      throw new Error(error.message || "Failed to fetch pending vendors");
    }
  }

  async approveVendor(vendorId: string) {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .update({ status: "active" })
        .eq("id", vendorId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error: any) {
      console.error("Approve vendor error:", error);
      throw new Error(error.message || "Failed to approve vendor");
    }
  }

  async rejectVendor(vendorId: string, reason?: string) {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .update({ status: "suspended" })
        .eq("id", vendorId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error: any) {
      console.error("Reject vendor error:", error);
      throw new Error(error.message || "Failed to reject vendor");
    }
  }

  // Listing Management
  async getAllListings(filters?: {
    status?: string;
    category?: string;
    search?: string;
  }) {
    try {
      let query = supabase
        .from("listings")
        .select(`
          *,
          vendor:profiles!listings_vendor_id_fkey(id, full_name, email),
          category:categories(id, name)
        `)
        .order("created_at", { ascending: false });

      if (filters?.status) {
        query = query.eq("status", filters.status);
      }

      if (filters?.category) {
        query = query.eq("category_id", filters.category);
      }

      if (filters?.search) {
        query = query.ilike("title", `%${filters.search}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    } catch (error: any) {
      console.error("Get all listings error:", error);
      throw new Error(error.message || "Failed to fetch listings");
    }
  }

  async updateListingStatus(listingId: string, status: "active" | "inactive" | "suspended") {
    try {
      const { data, error } = await supabase
        .from("listings")
        .update({ status })
        .eq("id", listingId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error: any) {
      console.error("Update listing status error:", error);
      throw new Error(error.message || "Failed to update listing status");
    }
  }

  async deleteListing(listingId: string) {
    try {
      const { error } = await supabase
        .from("listings")
        .delete()
        .eq("id", listingId);

      if (error) throw error;
    } catch (error: any) {
      console.error("Delete listing error:", error);
      throw new Error(error.message || "Failed to delete listing");
    }
  }

  // Booking Management
  async getAllBookings(filters?: {
    status?: string;
    dateRange?: { start: string; end: string };
  }) {
    try {
      let query = supabase
        .from("bookings")
        .select(`
          *,
          listing:listings(id, title, images),
          renter:profiles!bookings_renter_id_fkey(id, full_name, email),
          vendor:profiles!bookings_vendor_id_fkey(id, full_name, email)
        `)
        .order("created_at", { ascending: false });

      if (filters?.status) {
        query = query.eq("status", filters.status);
      }

      if (filters?.dateRange) {
        query = query
          .gte("start_date", filters.dateRange.start)
          .lte("end_date", filters.dateRange.end);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    } catch (error: any) {
      console.error("Get all bookings error:", error);
      throw new Error(error.message || "Failed to fetch bookings");
    }
  }

  // Payout Management
  async getPendingPayouts() {
    try {
      const { data, error } = await supabase
        .from("payouts")
        .select(`
          *,
          vendor:profiles(id, full_name, email)
        `)
        .eq("status", "pending")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error: any) {
      console.error("Get pending payouts error:", error);
      throw new Error(error.message || "Failed to fetch pending payouts");
    }
  }

  async approvePayout(payoutId: string) {
    try {
      const { data, error } = await supabase
        .from("payouts")
        .update({ status: "completed", processed_at: new Date().toISOString() })
        .eq("id", payoutId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error: any) {
      console.error("Approve payout error:", error);
      throw new Error(error.message || "Failed to approve payout");
    }
  }

  async rejectPayout(payoutId: string, reason?: string) {
    try {
      const { data, error } = await supabase
        .from("payouts")
        .update({ status: "rejected" })
        .eq("id", payoutId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error: any) {
      console.error("Reject payout error:", error);
      throw new Error(error.message || "Failed to reject payout");
    }
  }

  // Platform Statistics
  async getPlatformStats() {
    try {
      const [usersResult, listingsResult, bookingsResult, walletsResult] = await Promise.all([
        supabase.from("profiles").select("id", { count: "exact", head: true }),
        supabase.from("listings").select("id", { count: "exact", head: true }),
        supabase.from("bookings").select("id", { count: "exact", head: true }),
        supabase.from("wallets").select("balance")
      ]);

      const totalRevenue = walletsResult.data?.reduce((sum, w) => sum + Number(w.balance || 0), 0) || 0;

      return {
        totalUsers: usersResult.count || 0,
        totalListings: listingsResult.count || 0,
        totalBookings: bookingsResult.count || 0,
        totalRevenue
      };
    } catch (error: any) {
      console.error("Get platform stats error:", error);
      throw new Error(error.message || "Failed to fetch platform statistics");
    }
  }

  // KYC Management
  async getPendingKYC() {
    try {
      const { data, error } = await supabase
        .from("kyc_submissions")
        .select(`
          *,
          user:profiles(id, full_name, email)
        `)
        .eq("status", "pending")
        .order("submitted_at", { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error: any) {
      console.error("Get pending KYC error:", error);
      throw new Error(error.message || "Failed to fetch pending KYC submissions");
    }
  }

  async approveKYC(kycId: string) {
    try {
      const { data, error } = await supabase
        .from("kyc_submissions")
        .update({ status: "approved", reviewed_at: new Date().toISOString() })
        .eq("id", kycId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error: any) {
      console.error("Approve KYC error:", error);
      throw new Error(error.message || "Failed to approve KYC");
    }
  }

  async rejectKYC(kycId: string, reason: string) {
    try {
      const { data, error } = await supabase
        .from("kyc_submissions")
        .update({ 
          status: "rejected", 
          reviewed_at: new Date().toISOString(),
          rejection_reason: reason 
        })
        .eq("id", kycId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error: any) {
      console.error("Reject KYC error:", error);
      throw new Error(error.message || "Failed to reject KYC");
    }
  }

  // Disputes Management
  async getAllDisputes(status?: string) {
    try {
      let query = supabase
        .from("disputes")
        .select(`
          *,
          booking:bookings(id, booking_number, listing:listings(title)),
          complainant:profiles!disputes_complainant_id_fkey(id, full_name),
          respondent:profiles!disputes_respondent_id_fkey(id, full_name)
        `)
        .order("created_at", { ascending: false });

      if (status) {
        query = query.eq("status", status);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    } catch (error: any) {
      console.error("Get disputes error:", error);
      throw new Error(error.message || "Failed to fetch disputes");
    }
  }

  async resolveDispute(disputeId: string, resolution: string, resolutionNotes?: string) {
    try {
      const { data, error } = await supabase
        .from("disputes")
        .update({ 
          status: "resolved",
          resolution,
          resolution_notes: resolutionNotes,
          resolved_at: new Date().toISOString()
        })
        .eq("id", disputeId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error: any) {
      console.error("Resolve dispute error:", error);
      throw new Error(error.message || "Failed to resolve dispute");
    }
  }
}

export const adminService = new AdminService();