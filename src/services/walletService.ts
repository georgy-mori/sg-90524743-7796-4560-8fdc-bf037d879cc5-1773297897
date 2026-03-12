import { supabase } from "@/integrations/supabase/client";

export interface TopUpData {
  amount: number;
  payment_method: "paystack" | "flutterwave" | "stripe";
  reference: string;
}

class WalletService {
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

  async getTransactions(limit = 50) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("wallet_transactions")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error: any) {
      console.error("Get transactions error:", error);
      throw new Error(error.message || "Failed to fetch transactions");
    }
  }

  async topUp(data: TopUpData) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data: wallet } = await supabase
        .from("wallets")
        .select("id, balance")
        .eq("user_id", user.id)
        .single();

      if (!wallet) throw new Error("Wallet not found");

      const newBalance = Number(wallet.balance) + Number(data.amount);

      const { error: walletError } = await supabase
        .from("wallets")
        .update({ balance: newBalance } as any)
        .eq("user_id", user.id);

      if (walletError) throw walletError;

      const { data: transaction, error: txError } = await supabase
        .from("wallet_transactions")
        .insert({
          wallet_id: wallet.id,
          user_id: user.id,
          type: "topup",
          amount: data.amount,
          balance_before: wallet.balance,
          balance_after: newBalance,
          description: `Wallet top-up via ${data.payment_method}`,
          reference: data.reference || `TU-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
          status: "completed",
        } as any)
        .select()
        .single();

      if (txError) throw txError;

      return transaction;
    } catch (error: any) {
      console.error("Top up error:", error);
      throw new Error(error.message || "Failed to top up wallet");
    }
  }

  async requestPayout(amount: number, bankDetails: {
    bank_name: string;
    account_number: string;
    account_name: string;
  }) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data: wallet } = await supabase
        .from("wallets")
        .select("id, balance")
        .eq("user_id", user.id)
        .single();

      if (!wallet || Number(wallet.balance) < amount) {
        throw new Error("Insufficient balance");
      }

      const reference = `PO-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

      const { data: payout, error } = await supabase
        .from("payouts")
        .insert({
          vendor_id: user.id,
          amount,
          bank_name: bankDetails.bank_name,
          account_number: bankDetails.account_number,
          account_name: bankDetails.account_name,
          reference,
          status: "pending",
        } as any)
        .select()
        .single();

      if (error) throw error;

      const newBalance = Number(wallet.balance) - amount;

      await supabase
        .from("wallets")
        .update({ balance: newBalance } as any)
        .eq("user_id", user.id);
        
      await supabase.from("wallet_transactions").insert({
        wallet_id: wallet.id,
        user_id: user.id,
        type: "payout",
        amount: amount,
        balance_before: wallet.balance,
        balance_after: newBalance,
        description: `Payout request to ${bankDetails.bank_name}`,
        reference: reference,
        status: "pending",
      } as any);

      return payout;
    } catch (error: any) {
      console.error("Request payout error:", error);
      throw new Error(error.message || "Failed to request payout");
    }
  }

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