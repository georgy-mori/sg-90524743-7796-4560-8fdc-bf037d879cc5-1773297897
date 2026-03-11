import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  DollarSign,
  TrendingUp,
  Download,
  Plus
} from "lucide-react";
import { SEO } from "@/components/SEO";
import { format } from "date-fns";

export default function VendorWallet() {
  const [showTopUpModal, setShowTopUpModal] = useState(false);
  const [showPayoutModal, setShowPayoutModal] = useState(false);

  const walletBalance = 1245000;
  const availableForPayout = 985000;
  const pendingPayouts = 260000;

  const transactions = [
    {
      id: "TXN001",
      type: "credit" as const,
      description: "Booking payment - Concrete Mixer",
      amount: 75000,
      date: "2025-01-14T10:30:00",
      status: "completed",
      reference: "BK001",
    },
    {
      id: "TXN002",
      type: "debit" as const,
      description: "Payout to bank account",
      amount: 500000,
      date: "2025-01-12T14:20:00",
      status: "completed",
      reference: "PO001",
    },
    {
      id: "TXN003",
      type: "credit" as const,
      description: "Booking payment - Scaffolding",
      amount: 120000,
      date: "2025-01-11T09:15:00",
      status: "completed",
      reference: "BK002",
    },
    {
      id: "TXN004",
      type: "debit" as const,
      description: "Payout request",
      amount: 260000,
      date: "2025-01-10T16:45:00",
      status: "pending",
      reference: "PO002",
    },
    {
      id: "TXN005",
      type: "credit" as const,
      description: "Booking payment - Power Generator",
      amount: 85000,
      date: "2025-01-09T11:30:00",
      status: "completed",
      reference: "BK003",
    },
  ];

  return (
    <>
      <SEO 
        title="Wallet & Earnings - Vendor Dashboard"
        description="Manage your earnings and payouts"
      />
      
      <div className="min-h-screen bg-slate-50">
        <Header />

        <main className="container mx-auto px-4 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900">Wallet & Earnings</h1>
            <p className="text-slate-600 mt-1">Track your income and manage payouts</p>
          </div>

          {/* Wallet Cards */}
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
                  <TrendingUp className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
              <p className="text-sm text-slate-600 mb-2">Pending Payouts</p>
              <p className="text-3xl font-bold text-slate-900">₦{pendingPayouts.toLocaleString()}</p>
              <p className="text-xs text-yellow-600 mt-2">Processing</p>
            </Card>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card className="p-4">
              <p className="text-sm text-slate-600 mb-1">This Month</p>
              <p className="text-xl font-bold text-slate-900">₦425,000</p>
              <p className="text-xs text-green-600 mt-1">+18% from last month</p>
            </Card>
            <Card className="p-4">
              <p className="text-sm text-slate-600 mb-1">Last Month</p>
              <p className="text-xl font-bold text-slate-900">₦360,000</p>
            </Card>
            <Card className="p-4">
              <p className="text-sm text-slate-600 mb-1">Total Earned</p>
              <p className="text-xl font-bold text-slate-900">₦2,450,000</p>
            </Card>
            <Card className="p-4">
              <p className="text-sm text-slate-600 mb-1">Total Payouts</p>
              <p className="text-xl font-bold text-slate-900">₦1,860,000</p>
            </Card>
          </div>

          {/* Transaction History */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-900">Transaction History</h2>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>

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
                        <ArrowDownLeft className={`w-5 h-5 ${
                          txn.type === "credit" ? "text-green-600" : "text-red-600"
                        }`} />
                      ) : (
                        <ArrowUpRight className="w-5 h-5 text-red-600" />
                      )}
                    </div>
                    
                    <div>
                      <p className="font-medium text-slate-900">{txn.description}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <p className="text-sm text-slate-600">
                          {format(new Date(txn.date), "MMM dd, yyyy 'at' HH:mm")}
                        </p>
                        <span className="text-xs text-slate-400">•</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          txn.status === "completed"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
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
                      {txn.type === "credit" ? "+" : "-"}₦{txn.amount.toLocaleString()}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">{txn.reference}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 text-center">
              <Button variant="outline">
                Load More Transactions
              </Button>
            </div>
          </Card>
        </main>

        <Footer />
      </div>
    </>
  );
}