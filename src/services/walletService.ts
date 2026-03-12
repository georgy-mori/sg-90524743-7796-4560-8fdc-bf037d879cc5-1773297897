import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type WalletTransaction = Database["public"]["Tables"]["wallet_transactions"]["Row"];

export interface TopUpData {
  amount: number;
  payment_method: "paystack" | "flutterwave" | "stripe";
  reference: string;
}

class WalletService {
  /**
   * Get wallet balance
   */
  async getBalance() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("wallets")
        .select("balance")
        .eq("user_id", user.id)
        .single();

      if (error) throw error;
      return data?.balance || 0;
    } catch (error: any) {
      console.error("Get balance error:", error);
      throw new Error(error.message || "Failed to fetch balance");
    }
  }

  /**
   * Get wallet transactions
   */
  async getTransactions(limit = 50) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("wallet_transactions")
        .select("*")
        .eq("wallet_id", user.id)
        .order("created_at", { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error: any) {
      console.error("Get transactions error:", error);
      throw new Error(error.message || "Failed to fetch transactions");
    }
  }

  /**
   * Top up wallet
   */
  async topUp(data: TopUpData) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Get current balance
      const { data: wallet } = await supabase
        .from("wallets")
        .select("balance")
        .eq("user_id", user.id)
        .single();

      if (!wallet) throw new Error("Wallet not found");

      // Update balance
      const { error: walletError } = await supabase
        .from("wallets")
        .update({ balance: wallet.balance + data.amount })
        .eq("user_id", user.id);

      if (walletError) throw walletError;

      // Create transaction record
      const { data: transaction, error: txError } = await supabase
        .from("wallet_transactions")
        .insert({
          wallet_id: user.id,
          type: "credit",
          amount: data.amount,
          description: `Wallet top-up via ${data.payment_method}`,
          reference: data.reference,
          status: "completed",
        })
        .select()
        .single();

      if (txError) throw txError;

      return transaction;
    } catch (error: any) {
      console.error("Top up error:", error);
      throw new Error(error.message || "Failed to top up wallet");
    }
  }

  /**
   * Request payout (vendor)
   */
  async requestPayout(amount: number, bankDetails: {
    bank_name: string;
    account_number: string;
    account_name: string;
  }) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Check balance
      const { data: wallet } = await supabase
        .from("wallets")
        .select("balance")
        .eq("user_id", user.id)
        .single();

      if (!wallet || wallet.balance < amount) {
        throw new Error("Insufficient balance");
      }

      // Create payout request
      const { data: payout, error } = await supabase
        .from("payouts")
        .insert({
          vendor_id: user.id,
          amount,
          bank_name: bankDetails.bank_name,
          account_number: bankDetails.account_number,
          account_name: bankDetails.account_name,
          status: "pending",
        })
        .select()
        .single();

      if (error) throw error;

      // Deduct from available balance (hold funds)
      await supabase
        .from("wallets")
        .update({ balance: wallet.balance - amount })
        .eq("user_id", user.id);

      return payout;
    } catch (error: any) {
      console.error("Request payout error:", error);
      throw new Error(error.message || "Failed to request payout");
    }
  }

  /**
   * Get payout history
   */
  async getPayouts() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("payouts")
        .select("*")
        .eq("vendor_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error: any) {
      console.error("Get payouts error:", error);
      throw new Error(error.message || "Failed to fetch payouts");
    }
  }
}

export const walletService = new WalletService();