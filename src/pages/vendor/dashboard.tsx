import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { StatCard } from "@/components/StatCard";
import { BookingCard } from "@/components/BookingCard";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { 
  Package, 
  DollarSign, 
  Calendar, 
  TrendingUp,
  ArrowUpRight,
  Clock,
  CheckCircle,
  XCircle
} from "lucide-react";
import { SEO } from "@/components/SEO";

export default function VendorDashboard() {
  const [timeRange, setTimeRange] = useState("7d");

  const stats = [
    {
      title: "Total Earnings",
      value: "₦2,450,000",
      change: "+12.5%",
      changeType: "increase" as const,
      icon: DollarSign,
    },
    {
      title: "Active Listings",
      value: "24",
      change: "+3",
      changeType: "increase" as const,
      icon: Package,
    },
    {
      title: "Active Bookings",
      value: "12",
      change: "-2",
      changeType: "decrease" as const,
      icon: Calendar,
    },
    {
      title: "Completion Rate",
      value: "98.5%",
      change: "+1.2%",
      changeType: "increase" as const,
      icon: TrendingUp,
    },
  ];

  const recentBookings = [
    {
      id: "BK001",
      equipment: "Concrete Mixer - 180L",
      image: "https://images.unsplash.com/photo-1581094271901-8022df4466f9?w=400",
      renter: "John Doe",
      startDate: new Date("2025-01-15"),
      endDate: new Date("2025-01-20"),
      amount: 75000,
      status: "active" as const,
      location: "Lagos, Nigeria"
    },
    {
      id: "BK002",
      equipment: "Scaffolding Set - 50ft",
      image: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=400",
      renter: "Jane Smith",
      startDate: new Date("2025-01-18"),
      endDate: new Date("2025-01-25"),
      amount: 120000,
      status: "pending" as const,
      location: "Abuja, Nigeria"
    },
    {
      id: "BK003",
      equipment: "Power Generator - 10KVA",
      image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=400",
      renter: "Mike Johnson",
      startDate: new Date("2025-01-10"),
      endDate: new Date("2025-01-14"),
      amount: 85000,
      status: "completed" as const,
      location: "Port Harcourt, Nigeria"
    },
  ];

  const quickStats = [
    { label: "Pending Approval", value: 3, icon: Clock, color: "text-yellow-600" },
    { label: "Confirmed Today", value: 5, icon: CheckCircle, color: "text-green-600" },
    { label: "Cancelled", value: 1, icon: XCircle, color: "text-red-600" },
  ];

  return (
    <>
      <SEO 
        title="Vendor Dashboard - Equipment Rental Marketplace"
        description="Manage your equipment listings, bookings, and earnings"
      />
      
      <div className="min-h-screen bg-slate-50">
        <Header />

        <main className="container mx-auto px-4 py-8">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Vendor Dashboard</h1>
              <p className="text-slate-600 mt-1">Manage your equipment and bookings</p>
            </div>
            
            <div className="flex gap-3">
              <select 
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="1y">Last year</option>
              </select>
              
              <Link href="/vendor/listings/create">
                <Button className="bg-primary hover:bg-primary/90">
                  <Package className="w-4 h-4 mr-2" />
                  Add Listing
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat) => (
              <StatCard key={stat.title} {...stat} />
            ))}
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {quickStats.map((stat) => (
              <Card key={stat.label} className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600 mb-1">{stat.label}</p>
                    <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-full bg-slate-100 ${stat.color}`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Recent Bookings */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-900">Recent Bookings</h2>
              <Link href="/vendor/bookings">
                <Button variant="outline" className="text-primary">
                  View All
                  <ArrowUpRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>

            <div className="space-y-4">
              {recentBookings.map((booking) => (
                <BookingCard
                  key={booking.id}
                  bookingId={booking.id}
                  equipmentName={booking.equipment}
                  equipmentImage={booking.image}
                  startDate={booking.startDate}
                  endDate={booking.endDate}
                  totalPrice={booking.amount}
                  status={booking.status}
                  userRole="vendor"
                  renterName={booking.renter}
                  location={booking.location}
                  onAccept={() => console.log("Accept:", booking.id)}
                  onReject={() => console.log("Reject:", booking.id)}
                />
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <Card className="p-6">
            <h3 className="text-xl font-bold text-slate-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link href="/vendor/listings">
                <Button variant="outline" className="w-full justify-start">
                  <Package className="w-4 h-4 mr-2" />
                  Manage Listings
                </Button>
              </Link>
              <Link href="/vendor/bookings">
                <Button variant="outline" className="w-full justify-start">
                  <Calendar className="w-4 h-4 mr-2" />
                  View Calendar
                </Button>
              </Link>
              <Link href="/vendor/wallet">
                <Button variant="outline" className="w-full justify-start">
                  <DollarSign className="w-4 h-4 mr-2" />
                  Check Wallet
                </Button>
              </Link>
              <Link href="/vendor/analytics">
                <Button variant="outline" className="w-full justify-start">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  View Analytics
                </Button>
              </Link>
            </div>
          </Card>
        </main>

        <Footer />
      </div>
    </>
  );
}