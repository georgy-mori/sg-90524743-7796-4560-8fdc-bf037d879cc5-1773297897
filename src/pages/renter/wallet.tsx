import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Wallet, Plus, ArrowUpRight, ArrowDownLeft, Download } from "lucide-react";
import { SEO } from "@/components/SEO";
import { format } from "date-fns";

export default function RenterWallet() {
  const [showTopUpModal, setShowTopUpModal] = useState(false);
  const walletBalance = 150000;

  const transactions = [
    {
      id: "TXN101",
      type: "debit" as const,
      description: "Booking payment - Heavy Duty Jackhammer",
      amount: 45000,
      date: "2025-02-10T10:30:00",
      status: "completed",
      reference: "BK105",
    },
    {
      id: "TXN102",
      type: "credit" as const,
      description: "Wallet top-up via Paystack",
      amount: 100000,
      date: "2025-02-08T14:20:00",
      status: "completed",
      reference: "TOP001",
    },
    {
      id: "TXN103",
      type: "credit" as const,
      description: "Refund - Cancelled booking",
      amount: 25000,
      date: "2025-02-05T09:15:00",
      status: "completed",
      reference: "REF001",
    },
  ];

  return (
    <>
      <SEO title="Wallet - Renter Dashboard" description="Manage your wallet and payments" />
      
      <div className="min-h-screen bg-slate-50">
        <Header />

        <main className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900">My Wallet</h1>
            <p className="text-slate-600 mt-1">Manage your payments and transactions</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <Card className="lg:col-span-2 p-6 bg-gradient-to-br from-primary to-primary/80 text-white">
              <div className="flex items-center justify-between mb-4">
                <Wallet className="w-8 h-8" />
                <Button 
                  size="sm" 
                  variant="secondary"
                  onClick={() => setShowTopUpModal(true)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Top Up
                </Button>
              </div>
              <p className="text-sm opacity-90 mb-2">Available Balance</p>
              <p className="text-4xl font-bold">₦{walletBalance.toLocaleString()}</p>
              <p className="text-xs opacity-75 mt-2">Updated just now</p>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold text-slate-900 mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <Plus className="w-4 h-4 mr-2" />
                  Top Up Wallet
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Download className="w-4 h-4 mr-2" />
                  Download Statement
                </Button>
              </div>
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

            <div className="space-y-4">
              {transactions.map((txn) => (
                <div 
                  key={txn.id}
                  className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-full ${
                      txn.type === "credit" ? "bg-green-100" : "bg-red-100"
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
                          {format(new Date(txn.date), "MMM dd, yyyy 'at' HH:mm")}
                        </p>
                        <span className="text-xs text-slate-400">•</span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700">
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
          </Card>
        </main>

        <Footer />
      </div>
    </>
  );
}