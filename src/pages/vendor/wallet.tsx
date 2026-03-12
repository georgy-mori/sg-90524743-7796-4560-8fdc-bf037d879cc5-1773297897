import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  Download,
  Loader2
} from "lucide-react";
import { SEO } from "@/components/SEO";
import { format } from "date-fns";
import { walletService } from "@/services/walletService";
import { authService } from "@/services/authService";
import { useToast } from "@/hooks/use-toast";

export default function VendorWallet() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [walletBalance, setWalletBalance] = useState(0);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [showPayoutModal, setShowPayoutModal] = useState(false);
  const [payoutAmount, setPayoutAmount] = useState("");
  const [bankAccount, setBankAccount] = useState("");
  const [bankName, setBankName] = useState("");
  const [accountName, setAccountName] = useState("");

  useEffect(() => {
    checkAuthAndLoadData();
  }, []);

  const checkAuthAndLoadData = async () => {
    try {
      const hasRole = await authService.hasRole("vendor");
      if (!hasRole) {
        toast({
          title: "Access Denied",
          description: "You must be a vendor to access this page",
          variant: "destructive"
        });
        router.push("/");
        return;
      }

      await loadWalletData();
    } catch (error) {
      console.error("Auth check error:", error);
      router.push("/auth/login");
    }
  };

  const loadWalletData = async () => {
    try {
      setLoading(true);
      const balance = await walletService.getBalance();
      const txns = await walletService.getTransactions();
      
      setWalletBalance(Number(balance) || 0);
      setTransactions(txns || []);
    } catch (error: any) {
      console.error("Load wallet error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to load wallet data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRequestPayout = async () => {
    try {
      const amount = parseFloat(payoutAmount);
      
      if (!amount || amount <= 0) {
        toast({
          title: "Invalid Amount",
          description: "Please enter a valid amount",
          variant: "destructive"
        });
        return;
      }

      if (amount > walletBalance) {
        toast({
          title: "Insufficient Balance",
          description: "You don't have enough balance for this payout",
          variant: "destructive"
        });
        return;
      }

      if (!bankAccount) {
        toast({
          title: "Bank Account Required",
          description: "Please enter your bank account details",
          variant: "destructive"
        });
        return;
      }

      await walletService.requestPayout(amount, {
        bank_name: bankName || "Unknown Bank",
        account_number: bankAccount,
        account_name: accountName || "User"
      });
      
      toast({
        title: "Success",
        description: "Payout request submitted successfully"
      });
      
      setShowPayoutModal(false);
      setPayoutAmount("");
      setBankAccount("");
      setBankName("");
      setAccountName("");
      await loadWalletData();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to request payout",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const availableForPayout = walletBalance;
  const pendingPayouts = 0;

  return (
    <>
      <SEO 
        title="Wallet & Earnings - Vendor Dashboard"
        description="Manage your earnings and payouts"
      />
      
      <div className="min-h-screen bg-slate-50">
        <Header />

        <main className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900">Wallet & Earnings</h1>
            <p className="text-slate-600 mt-1">Track your income and manage payouts</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="p-6 bg-gradient-to-br from-primary to-primary/80 text-white">
              <div className="flex items-center justify-between mb-4">
                <Wallet className="w-8 h-8" />
                <Button 
                  size="sm" 
                  variant="secondary"
                  onClick={() => setShowPayoutModal(true)}
                >
                  Request Payout
                </Button>
              </div>
              <p className="text-sm opacity-90 mb-2">Total Balance</p>
              <p className="text-3xl font-bold">₦{walletBalance.toLocaleString()}</p>
              <p className="text-xs opacity-75 mt-2">Updated just now</p>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-green-100 rounded-full">
                  <ArrowDownLeft className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <p className="text-sm text-slate-600 mb-2">Available for Payout</p>
              <p className="text-3xl font-bold text-slate-900">₦{availableForPayout.toLocaleString()}</p>
              <p className="text-xs text-green-600 mt-2">Ready to withdraw</p>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-yellow-100 rounded-full">
                  <ArrowUpRight className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
              <p className="text-sm text-slate-600 mb-2">Pending Payouts</p>
              <p className="text-3xl font-bold text-slate-900">₦{pendingPayouts.toLocaleString()}</p>
              <p className="text-xs text-yellow-600 mt-2">Processing</p>
            </Card>
          </div>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-900">Transaction History</h2>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>

            {transactions.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-slate-600">No transactions yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {transactions.map((txn) => (
                  <div 
                    key={txn.id}
                    className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-full ${
                        txn.type === "credit" 
                          ? "bg-green-100" 
                          : "bg-red-100"
                      }`}>
                        {txn.type === "credit" ? (
                          <ArrowDownLeft className="w-5 h-5 text-green-600" />
                        ) : (
                          <ArrowUpRight className="w-5 h-5 text-red-600" />
                        )}
                      </div>
                      
                      <div>
                        <p className="font-medium text-slate-900">{txn.description}</p>
                        <div className="flex items-center gap-3 mt-1">
                          <p className="text-sm text-slate-600">
                            {format(new Date(txn.created_at), "MMM dd, yyyy 'at' HH:mm")}
                          </p>
                          <span className="text-xs text-slate-400">•</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            txn.status === "completed"
                              ? "bg-green-100 text-green-700"
                              : txn.status === "pending"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                          }`}>
                            {txn.status}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className={`text-lg font-bold ${
                        txn.type === "credit" ? "text-green-600" : "text-red-600"
                      }`}>
                        {txn.type === "credit" ? "+" : "-"}₦{Number(txn.amount).toLocaleString()}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">{txn.reference || "N/A"}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </main>

        {showPayoutModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md p-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Request Payout</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Amount (₦)
                  </label>
                  <Input
                    type="number"
                    placeholder="Enter amount"
                    value={payoutAmount}
                    onChange={(e) => setPayoutAmount(e.target.value)}
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    Available: ₦{walletBalance.toLocaleString()}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Bank Name
                  </label>
                  <Input
                    type="text"
                    placeholder="E.g. Access Bank"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Account Name
                  </label>
                  <Input
                    type="text"
                    placeholder="Full name on account"
                    value={accountName}
                    onChange={(e) => setAccountName(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Account Number
                  </label>
                  <Input
                    type="text"
                    placeholder="10-digit account number"
                    value={bankAccount}
                    onChange={(e) => setBankAccount(e.target.value)}
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setShowPayoutModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="flex-1"
                    onClick={handleRequestPayout}
                  >
                    Submit Request
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}

        <Footer />
      </div>
    </>
  );
}