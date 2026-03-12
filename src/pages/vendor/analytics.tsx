import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp,
  DollarSign,
  Calendar,
  Package,
  Download,
  ArrowUpRight,
  ArrowDownRight,
  Loader2
} from "lucide-react";
import { SEO } from "@/components/SEO";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { authService } from "@/services/authService";
import { listingService } from "@/services/listingService";
import { bookingService } from "@/services/bookingService";
import { walletService } from "@/services/walletService";
import { useToast } from "@/hooks/use-toast";

export default function VendorAnalytics() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("30d");
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalBookings: 0,
    activeListings: 0,
    avgRating: 0
  });
  const [earningsData, setEarningsData] = useState<any[]>([]);
  const [bookingsData, setBookingsData] = useState<any[]>([]);
  const [categoryData, setCategoryData] = useState<any[]>([]);

  useEffect(() => {
    checkAuthAndLoadData();
  }, [timeRange]);

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

      await loadAnalytics();
    } catch (error) {
      console.error("Auth check error:", error);
      router.push("/auth/login");
    }
  };

  const loadAnalytics = async () => {
    try {
      setLoading(true);

      // Load wallet balance
      const balance = await walletService.getBalance();
      
      // Load vendor listings
      const listings = await listingService.getVendorListings();
      const activeListings = listings.filter(l => l.availability === "active").length;

      // Load vendor bookings
      const bookings = await bookingService.getVendorBookings();
      const completedBookings = bookings.filter(b => b.status === "completed");
      
      // Calculate total revenue from completed bookings
      const totalRevenue = completedBookings.reduce((sum, b) => sum + Number(b.total_amount || 0), 0);

      // Generate earnings data (last 7 months)
      const monthlyEarnings = generateMonthlyData(completedBookings, "earnings");
      const monthlyBookings = generateMonthlyData(bookings, "count");

      // Category distribution
      const categoryMap = new Map<string, number>();
      listings.forEach(listing => {
        const cat = listing.category?.name || "Others";
        categoryMap.set(cat, (categoryMap.get(cat) || 0) + 1);
      });

      const categories = Array.from(categoryMap.entries()).map(([name, value], idx) => ({
        name,
        value,
        color: ["#0F172A", "#F97316", "#3B82F6", "#10B981", "#F59E0B"][idx % 5]
      }));

      setStats({
        totalRevenue,
        totalBookings: bookings.length,
        activeListings,
        avgRating: 4.8 // TODO: Calculate from reviews when implemented
      });

      setEarningsData(monthlyEarnings);
      setBookingsData(monthlyBookings);
      setCategoryData(categories);
    } catch (error: any) {
      console.error("Load analytics error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to load analytics",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const generateMonthlyData = (data: any[], type: "earnings" | "count") => {
    const months = ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan"];
    const monthlyData = months.map(month => ({
      month,
      earnings: 0,
      bookings: 0
    }));

    // In production, calculate actual monthly data from created_at dates
    data.forEach(item => {
      const month = new Date(item.created_at).getMonth();
      const monthIndex = month >= 6 ? month - 6 : month + 6; // Adjust for Jul-Jan range
      if (monthIndex < 7) {
        if (type === "earnings" && item.status === "completed") {
          monthlyData[monthIndex].earnings += Number(item.total_amount || 0);
        } else if (type === "count") {
          monthlyData[monthIndex].bookings += 1;
        }
      }
    });

    return monthlyData;
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
        title="Analytics - Vendor Dashboard"
        description="View your performance analytics"
      />
      
      <div className="min-h-screen bg-slate-50">
        <Header />

        <main className="container mx-auto px-4 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Analytics</h1>
              <p className="text-slate-600 mt-1">Track your business performance</p>
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
              
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </Button>
            </div>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-green-100 rounded-full">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
                <span className="flex items-center text-sm text-green-600">
                  <ArrowUpRight className="w-4 h-4 mr-1" />
                  +18%
                </span>
              </div>
              <p className="text-sm text-slate-600 mb-1">Total Revenue</p>
              <p className="text-3xl font-bold text-slate-900">₦{stats.totalRevenue.toLocaleString()}</p>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-100 rounded-full">
                  <Calendar className="w-6 h-6 text-blue-600" />
                </div>
                <span className="flex items-center text-sm text-green-600">
                  <ArrowUpRight className="w-4 h-4 mr-1" />
                  +12%
                </span>
              </div>
              <p className="text-sm text-slate-600 mb-1">Total Bookings</p>
              <p className="text-3xl font-bold text-slate-900">{stats.totalBookings}</p>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-primary/10 rounded-full">
                  <Package className="w-6 h-6 text-primary" />
                </div>
                <span className="flex items-center text-sm text-red-600">
                  <ArrowDownRight className="w-4 h-4 mr-1" />
                  -3%
                </span>
              </div>
              <p className="text-sm text-slate-600 mb-1">Active Listings</p>
              <p className="text-3xl font-bold text-slate-900">{stats.activeListings}</p>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-yellow-100 rounded-full">
                  <TrendingUp className="w-6 h-6 text-yellow-600" />
                </div>
                <span className="flex items-center text-sm text-green-600">
                  <ArrowUpRight className="w-4 h-4 mr-1" />
                  +5.2%
                </span>
              </div>
              <p className="text-sm text-slate-600 mb-1">Avg. Rating</p>
              <p className="text-3xl font-bold text-slate-900">{stats.avgRating}</p>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card className="p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Earnings Overview</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={earningsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis dataKey="month" stroke="#64748B" />
                  <YAxis stroke="#64748B" />
                  <Tooltip />
                  <Line type="monotone" dataKey="earnings" stroke="#F97316" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Bookings Trend</h3>
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
            <Card className="p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Category Distribution</h3>
              {categoryData.length > 0 ? (
                <>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="grid grid-cols-2 gap-2 mt-4">
                    {categoryData.map((cat) => (
                      <div key={cat.name} className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }}></div>
                        <span className="text-sm text-slate-600">{cat.name}</span>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <p className="text-center text-slate-500 py-12">No data available</p>
              )}
            </Card>

            <Card className="lg:col-span-2 p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Top Performing Equipment</h3>
              <p className="text-center text-slate-500 py-12">
                Create more listings to see performance data
              </p>
            </Card>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}