import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type Listing = Database["public"]["Tables"]["listings"]["Row"];
type ListingInsert = Database["public"]["Tables"]["listings"]["Insert"];
type ListingUpdate = Database["public"]["Tables"]["listings"]["Update"];

export interface CreateListingData {
  title: string;
  description: string;
  category_id: string;
  price_per_day: number;
  price_per_week?: number;
  price_per_month?: number;
  location: string;
  latitude?: number;
  longitude?: number;
  images?: string[];
  availability_status?: "available" | "rented" | "maintenance";
  requires_kyc?: boolean;
  delivery_available?: boolean;
  pickup_available?: boolean;
}

class ListingService {
  /**
   * Create a new listing
   */
  async createListing(data: CreateListingData) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const listingData: ListingInsert = {
        vendor_id: user.id,
        ...data,
      };

      const { data: listing, error } = await supabase
        .from("listings")
        .insert(listingData)
        .select()
        .single();

      if (error) throw error;
      return listing;
    } catch (error: any) {
      console.error("Create listing error:", error);
      throw new Error(error.message || "Failed to create listing");
    }
  }

  /**
   * Get all listings with filters
   */
  async getListings(filters?: {
    category_id?: string;
    min_price?: number;
    max_price?: number;
    location?: string;
    availability_status?: string;
    search?: string;
  }) {
    try {
      let query = supabase
        .from("listings")
        .select(`
          *,
          vendor:profiles!vendor_id(id, full_name, avatar_url),
          category:categories(id, name)
        `)
        .eq("status", "approved");

      if (filters?.category_id) {
        query = query.eq("category_id", filters.category_id);
      }

      if (filters?.min_price) {
        query = query.gte("price_per_day", filters.min_price);
      }

      if (filters?.max_price) {
        query = query.lte("price_per_day", filters.max_price);
      }

      if (filters?.location) {
        query = query.ilike("location", `%${filters.location}%`);
      }

      if (filters?.availability_status) {
        query = query.eq("availability_status", filters.availability_status);
      }

      if (filters?.search) {
        query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
      }

      query = query.order("created_at", { ascending: false });

      const { data, error } = await query;

      if (error) throw error;
      return data || [];
    } catch (error: any) {
      console.error("Get listings error:", error);
      throw new Error(error.message || "Failed to fetch listings");
    }
  }

  /**
   * Get listing by ID
   */
  async getListingById(id: string) {
    try {
      const { data, error } = await supabase
        .from("listings")
        .select(`
          *,
          vendor:profiles!vendor_id(id, full_name, avatar_url, phone, email),
          category:categories(id, name),
          reviews(id, rating, comment, created_at, renter:profiles!renter_id(full_name, avatar_url))
        `)
        .eq("id", id)
        .single();

      if (error) throw error;
      return data;
    } catch (error: any) {
      console.error("Get listing error:", error);
      throw new Error(error.message || "Failed to fetch listing");
    }
  }

  /**
   * Get vendor's listings
   */
  async getVendorListings() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("listings")
        .select(`
          *,
          category:categories(id, name)
        `)
        .eq("vendor_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error: any) {
      console.error("Get vendor listings error:", error);
      throw new Error(error.message || "Failed to fetch vendor listings");
    }
  }

  /**
   * Update listing
   */
  async updateListing(id: string, data: Partial<CreateListingData>) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data: listing, error } = await supabase
        .from("listings")
        .update(data as ListingUpdate)
        .eq("id", id)
        .eq("vendor_id", user.id)
        .select()
        .single();

      if (error) throw error;
      return listing;
    } catch (error: any) {
      console.error("Update listing error:", error);
      throw new Error(error.message || "Failed to update listing");
    }
  }

  /**
   * Delete listing
   */
  async deleteListing(id: string) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from("listings")
        .delete()
        .eq("id", id)
        .eq("vendor_id", user.id);

      if (error) throw error;
      return true;
    } catch (error: any) {
      console.error("Delete listing error:", error);
      throw new Error(error.message || "Failed to delete listing");
    }
  }

  /**
   * Update listing availability
   */
  async updateAvailability(id: string, status: "available" | "rented" | "maintenance") {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from("listings")
        .update({ availability_status: status })
        .eq("id", id)
        .eq("vendor_id", user.id);

      if (error) throw error;
      return true;
    } catch (error: any) {
      console.error("Update availability error:", error);
      throw new Error(error.message || "Failed to update availability");
    }
  }
}

export const listingService = new ListingService();