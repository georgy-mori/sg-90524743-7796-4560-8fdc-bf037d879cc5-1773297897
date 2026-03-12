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
  Plus,
  Loader2
} from "lucide-react";
import { SEO } from "@/components/SEO";
import { format } from "date-fns";
import { walletService } from "@/services/walletService";
import { authService } from "@/services/authService";
import { useToast } from "@/hooks/use-toast";

export default function RenterWallet() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [walletBalance, setWalletBalance] = useState(0);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [showTopUpModal, setShowTopUpModal] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState("");

  useEffect(() => {
    checkAuthAndLoadData();
  }, []);

  const checkAuthAndLoadData = async () => {
    try {
      const hasRole = await authService.hasRole("renter");
      if (!hasRole) {
        toast({
          title: "Access Denied",
          description: "You must be a renter to access this page",
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

  const handleTopUp = async () => {
    try {
      const amount = parseFloat(topUpAmount);
      
      if (!amount || amount <= 0) {
        toast({
          title: "Invalid Amount",
          description: "Please enter a valid amount",
          variant: "destructive"
        });
        return;
      }

      await walletService.topUpWallet({
        amount,
        payment_method: "card",
        reference: `TOPUP-${Math.floor(Math.random() * 1000000)}`
      });
      
      toast({
        title: "Success",
        description: "Wallet topped up successfully"
      });
      
      setShowTopUpModal(false);
      setTopUpAmount("");
      await loadWalletData();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to top up wallet",
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

  return (
    <>
      <SEO 
        title="My Wallet - Renter Dashboard"
        description="Manage your wallet and payments"
      />
      
      <div className="min-h-screen bg-slate-50">
        <Header />

        <main className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900">My Wallet</h1>
            <p className="text-slate-600 mt-1">Manage your funds and transaction history</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card className="p-8 bg-gradient-to-br from-primary to-primary/80 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <Wallet className="w-32 h-32" />
              </div>
              <div className="relative z-10">
                <p className="text-sm opacity-90 mb-2">Available Balance</p>
                <p className="text-4xl font-bold mb-6">₦{walletBalance.toLocaleString()}</p>
                <Button 
                  variant="secondary" 
                  className="w-full sm:w-auto"
                  onClick={() => setShowTopUpModal(true)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Top Up Wallet
                </Button>
              </div>
            </Card>

            <div className="grid grid-rows-2 gap-6">
              <Card className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 mb-1">Total Spent</p>
                  <p className="text-2xl font-bold text-slate-900">
                    ₦{transactions.filter(t => t.type === "debit" && t.status === "completed").reduce((sum, t) => sum + Number(t.amount), 0).toLocaleString()}
                  </p>
                </div>
                <div className="p-3 bg-red-100 rounded-full">
                  <ArrowUpRight className="w-6 h-6 text-red-600" />
                </div>
              </Card>
              <Card className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 mb-1">Total Added</p>
                  <p className="text-2xl font-bold text-slate-900">
                    ₦{transactions.filter(t => t.type === "credit" && t.status === "completed").reduce((sum, t) => sum + Number(t.amount), 0).toLocaleString()}
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <ArrowDownLeft className="w-6 h-6 text-green-600" />
                </div>
              </Card>
            </div>
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
                        txn.type === "credit" ? "text-green-600" : "text-slate-900"
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

        {showTopUpModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md p-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Top Up Wallet</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Amount (₦)
                  </label>
                  <Input
                    type="number"
                    placeholder="Enter amount"
                    value={topUpAmount}
                    onChange={(e) => setTopUpAmount(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {[5000, 10000, 50000].map((preset) => (
                    <Button
                      key={preset}
                      variant="outline"
                      type="button"
                      onClick={() => setTopUpAmount(preset.toString())}
                    >
                      ₦{preset.toLocaleString()}
                    </Button>
                  ))}
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setShowTopUpModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="flex-1"
                    onClick={handleTopUp}
                  >
                    Proceed to Pay
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