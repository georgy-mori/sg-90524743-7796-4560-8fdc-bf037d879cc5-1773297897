import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  Package, 
  Calendar, 
  DollarSign,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock
} from "lucide-react";
import { SEO } from "@/components/SEO";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function AdminDashboard() {
  const [timeRange, setTimeRange] = useState("30d");

  const stats = [
    {
      title: "Total Users",
      value: "12,458",
      change: "+12.5%",
      changeType: "increase" as const,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Active Listings",
      value: "3,842",
      change: "+8.2%",
      changeType: "increase" as const,
      icon: Package,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Total Bookings",
      value: "8,245",
      change: "+15.3%",
      changeType: "increase" as const,
      icon: Calendar,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: "Platform Revenue",
      value: "₦245M",
      change: "+22.1%",
      changeType: "increase" as const,
      icon: DollarSign,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
  ];

  const revenueData = [
    { month: "Jul", revenue: 18000000 },
    { month: "Aug", revenue: 22000000 },
    { month: "Sep", revenue: 19000000 },
    { month: "Oct", revenue: 28000000 },
    { month: "Nov", revenue: 31000000 },
    { month: "Dec", revenue: 35000000 },
    { month: "Jan", revenue: 42000000 },
  ];

  const bookingsData = [
    { month: "Jul", bookings: 850 },
    { month: "Aug", bookings: 920 },
    { month: "Sep", bookings: 880 },
    { month: "Oct", bookings: 1050 },
    { month: "Nov", bookings: 1180 },
    { month: "Dec", bookings: 1320 },
    { month: "Jan", bookings: 1450 },
  ];

  const pendingActions = [
    { type: "Vendor Approvals", count: 12, icon: Clock, color: "text-yellow-600" },
    { type: "KYC Verifications", count: 8, icon: AlertCircle, color: "text-orange-600" },
    { type: "Payout Requests", count: 15, icon: DollarSign, color: "text-green-600" },
    { type: "Dispute Cases", count: 5, icon: AlertCircle, color: "text-red-600" },
  ];

  const recentActivity = [
    {
      id: 1,
      type: "New Vendor",
      description: "TechPro Rentals registered as vendor",
      time: "5 mins ago",
      icon: Users,
      color: "text-blue-600",
    },
    {
      id: 2,
      type: "New Booking",
      description: "₦125,000 booking completed",
      time: "12 mins ago",
      icon: CheckCircle,
      color: "text-green-600",
    },
    {
      id: 3,
      type: "Payout Request",
      description: "BuildPro requested ₦850,000 payout",
      time: "1 hour ago",
      icon: DollarSign,
      color: "text-primary",
    },
    {
      id: 4,
      type: "New Listing",
      description: "Heavy Excavator added to platform",
      time: "2 hours ago",
      icon: Package,
      color: "text-purple-600",
    },
  ];

  return (
    <>
      <SEO title="Admin Dashboard - Equipment Rental" description="System overview and management" />
      
      <div className="min-h-screen bg-slate-50">
        <Header />

        <main className="container mx-auto px-4 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>
              <p className="text-slate-600 mt-1">System overview and management</p>
            </div>
            
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
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat) => (
              <Card key={stat.title} className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-full ${stat.bgColor}`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <span className={`text-sm font-medium ${
                    stat.changeType === "increase" ? "text-green-600" : "text-red-600"
                  }`}>
                    {stat.change}
                  </span>
                </div>
                <p className="text-sm text-slate-600 mb-1">{stat.title}</p>
                <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
            {pendingActions.map((action) => (
              <Card key={action.type} className="p-6 hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600 mb-1">{action.type}</p>
                    <p className="text-2xl font-bold text-slate-900">{action.count}</p>
                  </div>
                  <div className={`p-3 rounded-full bg-slate-100 ${action.color}`}>
                    <action.icon className="w-6 h-6" />
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card className="p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Platform Revenue</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis dataKey="month" stroke="#64748B" />
                  <YAxis stroke="#64748B" />
                  <Tooltip />
                  <Line type="monotone" dataKey="revenue" stroke="#F97316" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Booking Trends</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={bookingsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis dataKey="month" stroke="#64748B" />
                  <YAxis stroke="#64748B" />
                  <Tooltip />
                  <Bar dataKey="bookings" fill="#0F172A" />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2 p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Recent Activity</h3>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-4 p-4 bg-slate-50 rounded-lg">
                    <div className={`p-2 rounded-full bg-white ${activity.color}`}>
                      <activity.icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-slate-900">{activity.type}</p>
                      <p className="text-sm text-slate-600">{activity.description}</p>
                      <p className="text-xs text-slate-500 mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <Users className="w-4 h-4 mr-2" />
                  Manage Users
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Package className="w-4 h-4 mr-2" />
                  Review Listings
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Calendar className="w-4 h-4 mr-2" />
                  View Bookings
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <DollarSign className="w-4 h-4 mr-2" />
                  Approve Payouts
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  View Reports
                </Button>
              </div>
            </Card>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}