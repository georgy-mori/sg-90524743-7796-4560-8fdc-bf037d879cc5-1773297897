import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type Booking = Database["public"]["Tables"]["bookings"]["Row"];
type BookingInsert = Database["public"]["Tables"]["bookings"]["Insert"];
type BookingStatus = Database["public"]["Enums"]["booking_status"];

export interface CreateBookingData {
  listing_id: string;
  start_date: string;
  end_date: string;
  total_price: number;
  delivery_required?: boolean;
  delivery_address?: string;
}

class BookingService {
  /**
   * Create a new booking
   */
  async createBooking(data: CreateBookingData) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Check wallet balance
      const { data: wallet } = await supabase
        .from("wallets")
        .select("balance")
        .eq("user_id", user.id)
        .single();

      if (!wallet || wallet.balance < data.total_price) {
        throw new Error("Insufficient wallet balance");
      }

      // Create booking
      const bookingData: BookingInsert = {
        renter_id: user.id,
        ...data,
        status: "pending",
      };

      const { data: booking, error: bookingError } = await supabase
        .from("bookings")
        .insert(bookingData)
        .select(`
          *,
          listing:listings(
            id,
            title,
            images,
            vendor_id,
            vendor:profiles!vendor_id(full_name, phone)
          )
        `)
        .single();

      if (bookingError) throw bookingError;

      // Deduct from wallet
      const { error: walletError } = await supabase
        .from("wallets")
        .update({ balance: wallet.balance - data.total_price })
        .eq("user_id", user.id);

      if (walletError) throw walletError;

      // Create wallet transaction
      await supabase.from("wallet_transactions").insert({
        wallet_id: user.id,
        type: "debit",
        amount: data.total_price,
        description: `Booking payment for ${booking.listing?.title}`,
        reference: `BK-${booking.id}`,
        status: "completed",
      });

      return booking;
    } catch (error: any) {
      console.error("Create booking error:", error);
      throw new Error(error.message || "Failed to create booking");
    }
  }

  /**
   * Get user bookings (renter)
   */
  async getRenterBookings(status?: BookingStatus) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      let query = supabase
        .from("bookings")
        .select(`
          *,
          listing:listings(
            id,
            title,
            images,
            location,
            vendor_id,
            vendor:profiles!vendor_id(id, full_name, phone, avatar_url)
          )
        `)
        .eq("renter_id", user.id);

      if (status) {
        query = query.eq("status", status);
      }

      query = query.order("created_at", { ascending: false });

      const { data, error } = await query;
      if (error) throw error;

      return data || [];
    } catch (error: any) {
      console.error("Get renter bookings error:", error);
      throw new Error(error.message || "Failed to fetch bookings");
    }
  }

  /**
   * Get vendor bookings
   */
  async getVendorBookings(status?: BookingStatus) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      let query = supabase
        .from("bookings")
        .select(`
          *,
          listing:listings!inner(id, title, images, vendor_id),
          renter:profiles!renter_id(id, full_name, phone, avatar_url, email)
        `)
        .eq("listing.vendor_id", user.id);

      if (status) {
        query = query.eq("status", status);
      }

      query = query.order("created_at", { ascending: false });

      const { data, error } = await query;
      if (error) throw error;

      return data || [];
    } catch (error: any) {
      console.error("Get vendor bookings error:", error);
      throw new Error(error.message || "Failed to fetch vendor bookings");
    }
  }

  /**
   * Accept booking (vendor)
   */
  async acceptBooking(bookingId: string) {
    try {
      const { error } = await supabase
        .from("bookings")
        .update({ status: "confirmed" })
        .eq("id", bookingId);

      if (error) throw error;
      return true;
    } catch (error: any) {
      console.error("Accept booking error:", error);
      throw new Error(error.message || "Failed to accept booking");
    }
  }

  /**
   * Reject booking (vendor)
   */
  async rejectBooking(bookingId: string) {
    try {
      // Get booking details
      const { data: booking } = await supabase
        .from("bookings")
        .select("*, listing:listings(vendor_id)")
        .eq("id", bookingId)
        .single();

      if (!booking) throw new Error("Booking not found");

      // Update booking status
      const { error: bookingError } = await supabase
        .from("bookings")
        .update({ status: "cancelled" })
        .eq("id", bookingId);

      if (bookingError) throw bookingError;

      // Refund to renter wallet
      const { data: wallet } = await supabase
        .from("wallets")
        .select("balance")
        .eq("user_id", booking.renter_id)
        .single();

      if (wallet) {
        await supabase
          .from("wallets")
          .update({ balance: wallet.balance + booking.total_price })
          .eq("user_id", booking.renter_id);

        // Create refund transaction
        await supabase.from("wallet_transactions").insert({
          wallet_id: booking.renter_id,
          type: "credit",
          amount: booking.total_price,
          description: `Refund for cancelled booking`,
          reference: `REFUND-${bookingId}`,
          status: "completed",
        });
      }

      return true;
    } catch (error: any) {
      console.error("Reject booking error:", error);
      throw new Error(error.message || "Failed to reject booking");
    }
  }

  /**
   * Complete booking (vendor)
   */
  async completeBooking(bookingId: string) {
    try {
      const { data: booking } = await supabase
        .from("bookings")
        .select("*, listing:listings(vendor_id)")
        .eq("id", bookingId)
        .single();

      if (!booking) throw new Error("Booking not found");

      // Update booking status
      const { error: bookingError } = await supabase
        .from("bookings")
        .update({ status: "completed" })
        .eq("id", bookingId);

      if (bookingError) throw bookingError;

      // Credit vendor wallet
      const { data: vendorWallet } = await supabase
        .from("wallets")
        .select("balance")
        .eq("user_id", booking.listing?.vendor_id)
        .single();

      if (vendorWallet) {
        // Platform takes 10% commission
        const commission = booking.total_price * 0.1;
        const vendorAmount = booking.total_price - commission;

        await supabase
          .from("wallets")
          .update({ balance: vendorWallet.balance + vendorAmount })
          .eq("user_id", booking.listing?.vendor_id);

        // Create vendor transaction
        await supabase.from("wallet_transactions").insert({
          wallet_id: booking.listing?.vendor_id,
          type: "credit",
          amount: vendorAmount,
          description: `Earnings from completed booking`,
          reference: `EARN-${bookingId}`,
          status: "completed",
        });
      }

      return true;
    } catch (error: any) {
      console.error("Complete booking error:", error);
      throw new Error(error.message || "Failed to complete booking");
    }
  }

  /**
   * Cancel booking (renter)
   */
  async cancelBooking(bookingId: string) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data: booking } = await supabase
        .from("bookings")
        .select("*")
        .eq("id", bookingId)
        .eq("renter_id", user.id)
        .single();

      if (!booking) throw new Error("Booking not found");

      // Update booking
      const { error: bookingError } = await supabase
        .from("bookings")
        .update({ status: "cancelled" })
        .eq("id", bookingId);

      if (bookingError) throw bookingError;

      // Refund to wallet
      const { data: wallet } = await supabase
        .from("wallets")
        .select("balance")
        .eq("user_id", user.id)
        .single();

      if (wallet) {
        await supabase
          .from("wallets")
          .update({ balance: wallet.balance + booking.total_price })
          .eq("user_id", user.id);

        await supabase.from("wallet_transactions").insert({
          wallet_id: user.id,
          type: "credit",
          amount: booking.total_price,
          description: "Refund for cancelled booking",
          reference: `REFUND-${bookingId}`,
          status: "completed",
        });
      }

      return true;
    } catch (error: any) {
      console.error("Cancel booking error:", error);
      throw new Error(error.message || "Failed to cancel booking");
    }
  }
}

export const bookingService = new BookingService();