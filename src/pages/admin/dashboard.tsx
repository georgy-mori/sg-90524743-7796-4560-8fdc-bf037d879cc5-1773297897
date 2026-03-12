import { useState, useEffect } from "react";
import { useRouter } from "next/router";
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
  Clock,
  Loader2
} from "lucide-react";
import { SEO } from "@/components/SEO";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { adminService } from "@/services/adminService";
import { authService } from "@/services/authService";
import { useToast } from "@/hooks/use-toast";

export default function AdminDashboard() {
  const router = useRouter();
  const { toast } = useToast();
  const [timeRange, setTimeRange] = useState("30d");
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalListings: 0,
    totalBookings: 0,
    totalRevenue: 0
  });
  const [pendingCounts, setPendingCounts] = useState({
    vendors: 0,
    kyc: 0,
    payouts: 0,
    disputes: 0
  });

  useEffect(() => {
    checkAuthAndLoadData();
  }, []);

  const checkAuthAndLoadData = async () => {
    try {
      const hasRole = await authService.hasRole("admin");
      if (!hasRole) {
        toast({
          title: "Access Denied",
          description: "You must be an admin to access this page",
          variant: "destructive"
        });
        router.push("/");
        return;
      }

      await loadDashboardData();
    } catch (error) {
      console.error("Auth check error:", error);
      router.push("/auth/login");
    }
  };

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // Load platform statistics
      const platformStats = await adminService.getPlatformStats();
      setStats(platformStats);

      // Load pending items counts
      const [vendors, kyc, payouts, disputes] = await Promise.all([
        adminService.getPendingVendors(),
        adminService.getPendingKYC(),
        adminService.getPendingPayouts(),
        adminService.getAllDisputes("pending")
      ]);

      setPendingCounts({
        vendors: vendors.length,
        kyc: kyc.length,
        payouts: payouts.length,
        disputes: disputes.length
      });
    } catch (error: any) {
      console.error("Load dashboard data error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to load dashboard data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: "Total Users",
      value: stats.totalUsers.toLocaleString(),
      change: "+12.5%",
      changeType: "increase" as const,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Active Listings",
      value: stats.totalListings.toLocaleString(),
      change: "+8.2%",
      changeType: "increase" as const,
      icon: Package,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Total Bookings",
      value: stats.totalBookings.toLocaleString(),
      change: "+15.3%",
      changeType: "increase" as const,
      icon: Calendar,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: "Platform Revenue",
      value: `₦${(stats.totalRevenue / 1000000).toFixed(1)}M`,
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
    { 
      type: "Vendor Approvals", 
      count: pendingCounts.vendors, 
      icon: Clock, 
      color: "text-yellow-600",
      route: "/admin/vendors"
    },
    { 
      type: "KYC Verifications", 
      count: pendingCounts.kyc, 
      icon: AlertCircle, 
      color: "text-orange-600",
      route: "/admin/kyc"
    },
    { 
      type: "Payout Requests", 
      count: pendingCounts.payouts, 
      icon: DollarSign, 
      color: "text-green-600",
      route: "/admin/payouts"
    },
    { 
      type: "Dispute Cases", 
      count: pendingCounts.disputes, 
      icon: AlertCircle, 
      color: "text-red-600",
      route: "/admin/disputes"
    },
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

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
            {statCards.map((stat) => (
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
              <Card 
                key={action.type} 
                className="p-6 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => router.push(action.route)}
              >
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
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => router.push("/admin/users")}
                >
                  <Users className="w-4 h-4 mr-2" />
                  Manage Users
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => router.push("/admin/listings")}
                >
                  <Package className="w-4 h-4 mr-2" />
                  Review Listings
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => router.push("/admin/bookings")}
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  View Bookings
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => router.push("/admin/payouts")}
                >
                  <DollarSign className="w-4 h-4 mr-2" />
                  Approve Payouts
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => router.push("/admin/analytics")}
                >
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