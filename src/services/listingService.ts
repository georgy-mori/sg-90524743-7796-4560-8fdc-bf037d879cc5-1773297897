import { supabase } from "@/integrations/supabase/client";

export interface CreateListingData {
  title: string;
  description: string;
  category_id: string;
  price_per_day: number;
  price_per_week?: number;
  price_per_month?: number;
  location: string;
  images?: string[];
  availability?: "active" | "rented" | "maintenance" | "draft";
}

class ListingService {
  async createListing(data: CreateListingData) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const listingData = {
        vendor_id: user.id,
        ...data,
      };

      const { data: listing, error } = await supabase
        .from("listings")
        .insert(listingData as any)
        .select()
        .single();

      if (error) throw error;
      return listing;
    } catch (error: any) {
      console.error("Create listing error:", error);
      throw new Error(error.message || "Failed to create listing");
    }
  }

  async getListings(filters?: {
    category_id?: string;
    min_price?: number;
    max_price?: number;
    location?: string;
    availability?: string;
    search?: string;
  }) {
    try {
      let query = supabase
        .from("listings")
        .select(`
          *,
          vendor:profiles!vendor_id(id, full_name, avatar_url),
          category:categories(id, name)
        `) as any;

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
      if (filters?.availability) {
        query = query.eq("availability", filters.availability);
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

  async updateListing(id: string, data: Partial<CreateListingData>) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data: listing, error } = await supabase
        .from("listings")
        .update(data as any)
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

  async updateAvailability(id: string, status: "active" | "rented" | "maintenance") {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from("listings")
        .update({ availability: status } as any)
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