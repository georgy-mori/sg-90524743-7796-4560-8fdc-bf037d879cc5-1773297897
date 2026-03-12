import { supabase } from "@/integrations/supabase/client";

export interface CreateBookingData {
  listing_id: string;
  start_date: string;
  end_date: string;
  notes?: string;
}

class BookingService {
  async createBooking(data: CreateBookingData) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data: listing } = await supabase
        .from("listings")
        .select("vendor_id, price_per_day, title")
        .eq("id", data.listing_id)
        .single();

      if (!listing) throw new Error("Listing not found");

      const start = new Date(data.start_date);
      const end = new Date(data.end_date);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const total_days = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
      const total_amount = total_days * Number(listing.price_per_day);
      const booking_number = `BK-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

      const { data: wallet } = await supabase
        .from("wallets")
        .select("id, balance")
        .eq("user_id", user.id)
        .single();

      if (!wallet || Number(wallet.balance) < total_amount) {
        throw new Error("Insufficient wallet balance");
      }

      const bookingData = {
        booking_number,
        renter_id: user.id,
        vendor_id: listing.vendor_id,
        listing_id: data.listing_id,
        start_date: data.start_date,
        end_date: data.end_date,
        total_days,
        price_per_day: listing.price_per_day,
        total_amount,
        status: "pending",
        notes: data.notes || "",
      };

      const { data: booking, error: bookingError } = await supabase
        .from("bookings")
        .insert(bookingData as any)
        .select(`*, listing:listings(title)`)
        .single();

      if (bookingError) throw bookingError;

      const newBalance = Number(wallet.balance) - total_amount;
      const { error: walletError } = await supabase
        .from("wallets")
        .update({ balance: newBalance } as any)
        .eq("user_id", user.id);

      if (walletError) throw walletError;

      await supabase.from("wallet_transactions").insert({
        wallet_id: wallet.id,
        user_id: user.id,
        type: "debit",
        amount: total_amount,
        balance_before: wallet.balance,
        balance_after: newBalance,
        description: `Booking payment for ${listing.title}`,
        reference: `TX-${booking_number}`,
        status: "completed",
      } as any);

      return booking;
    } catch (error: any) {
      console.error("Create booking error:", error);
      throw new Error(error.message || "Failed to create booking");
    }
  }

  async getRenterBookings(status?: string) {
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

  async getVendorBookings(status?: string) {
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
        .eq("vendor_id", user.id);

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

  async acceptBooking(bookingId: string) {
    try {
      const { error } = await supabase
        .from("bookings")
        .update({ status: "confirmed" } as any)
        .eq("id", bookingId);

      if (error) throw error;
      return true;
    } catch (error: any) {
      console.error("Accept booking error:", error);
      throw new Error(error.message || "Failed to accept booking");
    }
  }

  async rejectBooking(bookingId: string) {
    try {
      const { data: booking } = await supabase
        .from("bookings")
        .select("*")
        .eq("id", bookingId)
        .single();

      if (!booking) throw new Error("Booking not found");

      const { error: bookingError } = await supabase
        .from("bookings")
        .update({ status: "cancelled" } as any)
        .eq("id", bookingId);

      if (bookingError) throw bookingError;

      const { data: wallet } = await supabase
        .from("wallets")
        .select("id, balance")
        .eq("user_id", booking.renter_id)
        .single();

      if (wallet) {
        const newBalance = Number(wallet.balance) + Number(booking.total_amount);
        await supabase
          .from("wallets")
          .update({ balance: newBalance } as any)
          .eq("user_id", booking.renter_id);

        await supabase.from("wallet_transactions").insert({
          wallet_id: wallet.id,
          user_id: booking.renter_id,
          type: "refund",
          amount: booking.total_amount,
          balance_before: wallet.balance,
          balance_after: newBalance,
          description: `Refund for rejected booking ${booking.booking_number}`,
          reference: `REF-${booking.booking_number}`,
          status: "completed",
        } as any);
      }

      return true;
    } catch (error: any) {
      console.error("Reject booking error:", error);
      throw new Error(error.message || "Failed to reject booking");
    }
  }

  async completeBooking(bookingId: string) {
    try {
      const { data: booking } = await supabase
        .from("bookings")
        .select("*")
        .eq("id", bookingId)
        .single();

      if (!booking) throw new Error("Booking not found");

      const { error: bookingError } = await supabase
        .from("bookings")
        .update({ status: "completed" } as any)
        .eq("id", bookingId);

      if (bookingError) throw bookingError;

      const { data: vendorWallet } = await supabase
        .from("wallets")
        .select("id, balance")
        .eq("user_id", booking.vendor_id)
        .single();

      if (vendorWallet) {
        const commission = Number(booking.total_amount) * 0.1;
        const vendorAmount = Number(booking.total_amount) - commission;
        const newBalance = Number(vendorWallet.balance) + vendorAmount;

        await supabase
          .from("wallets")
          .update({ balance: newBalance } as any)
          .eq("user_id", booking.vendor_id);

        await supabase.from("wallet_transactions").insert({
          wallet_id: vendorWallet.id,
          user_id: booking.vendor_id,
          type: "booking",
          amount: vendorAmount,
          balance_before: vendorWallet.balance,
          balance_after: newBalance,
          description: `Earnings from completed booking ${booking.booking_number}`,
          reference: `EARN-${booking.booking_number}`,
          status: "completed",
        } as any);
      }

      return true;
    } catch (error: any) {
      console.error("Complete booking error:", error);
      throw new Error(error.message || "Failed to complete booking");
    }
  }

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

      const { error: bookingError } = await supabase
        .from("bookings")
        .update({ status: "cancelled" } as any)
        .eq("id", bookingId);

      if (bookingError) throw bookingError;

      const { data: wallet } = await supabase
        .from("wallets")
        .select("id, balance")
        .eq("user_id", user.id)
        .single();

      if (wallet) {
        const newBalance = Number(wallet.balance) + Number(booking.total_amount);
        await supabase
          .from("wallets")
          .update({ balance: newBalance } as any)
          .eq("user_id", user.id);

        await supabase.from("wallet_transactions").insert({
          wallet_id: wallet.id,
          user_id: user.id,
          type: "refund",
          amount: booking.total_amount,
          balance_before: wallet.balance,
          balance_after: newBalance,
          description: `Refund for cancelled booking ${booking.booking_number}`,
          reference: `CAN-${booking.booking_number}`,
          status: "completed",
        } as any);
      }

      return true;
    } catch (error: any) {
      console.error("Cancel booking error:", error);
      throw new Error(error.message || "Failed to cancel booking");
    }
  }
}

export const bookingService = new BookingService();