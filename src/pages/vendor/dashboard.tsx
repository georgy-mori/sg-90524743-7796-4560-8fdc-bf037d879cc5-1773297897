import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { StatCard } from "@/components/StatCard";
import { BookingCard } from "@/components/BookingCard";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SEO } from "@/components/SEO";
import Link from "next/link";
import { 
  Package, 
  DollarSign, 
  Calendar, 
  TrendingUp,
  ArrowUpRight,
  Clock,
  CheckCircle,
  XCircle,
  Loader2
} from "lucide-react";
import { authService } from "@/services/authService";
import { listingService } from "@/services/listingService";
import { bookingService } from "@/services/bookingService";
import { walletService } from "@/services/walletService";
import { useToast } from "@/hooks/use-toast";

export default function VendorDashboard() {
  const router = useRouter();
  const { toast } = useToast();
  const [timeRange, setTimeRange] = useState("7d");
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalEarnings: 0,
    activeListings: 0,
    activeBookings: 0,
    completionRate: 0
  });
  const [recentBookings, setRecentBookings] = useState<any[]>([]);

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

      await loadDashboardData();
    } catch (error) {
      console.error("Auth check error:", error);
      router.push("/auth/login");
    }
  };

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // Load wallet balance
      const balance = await walletService.getBalance();
      
      // Load vendor listings
      const listings = await listingService.getVendorListings();
      const activeListings = listings.filter(l => l.availability === "available").length;

      // Load vendor bookings
      const bookings = await bookingService.getVendorBookings();
      const activeBookings = bookings.filter(b => b.status === "active" || b.status === "confirmed").length;
      const completedBookings = bookings.filter(b => b.status === "completed").length;
      const completionRate = bookings.length > 0 ? (completedBookings / bookings.length) * 100 : 0;

      // Get recent bookings (last 5)
      const recent = bookings.slice(0, 5);

      setStats({
        totalEarnings: Number(balance) || 0,
        activeListings,
        activeBookings,
        completionRate
      });

      setRecentBookings(recent);
    } catch (error: any) {
      console.error("Load dashboard error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to load dashboard data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptBooking = async (bookingId: string) => {
    try {
      await bookingService.acceptBooking(bookingId);
      toast({
        title: "Success",
        description: "Booking accepted successfully"
      });
      await loadDashboardData();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to accept booking",
        variant: "destructive"
      });
    }
  };

  const handleRejectBooking = async (bookingId: string) => {
    try {
      await bookingService.rejectBooking(bookingId);
      toast({
        title: "Success",
        description: "Booking rejected and refund processed"
      });
      await loadDashboardData();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to reject booking",
        variant: "destructive"
      });
    }
  };

  const statsData = [
    {
      title: "Total Earnings",
      value: `₦${stats.totalEarnings.toLocaleString()}`,
      change: "+12.5%",
      changeType: "increase" as const,
      icon: DollarSign,
    },
    {
      title: "Active Listings",
      value: stats.activeListings.toString(),
      change: "+3",
      changeType: "increase" as const,
      icon: Package,
    },
    {
      title: "Active Bookings",
      value: stats.activeBookings.toString(),
      change: "-2",
      changeType: "decrease" as const,
      icon: Calendar,
    },
    {
      title: "Completion Rate",
      value: `${stats.completionRate.toFixed(1)}%`,
      change: "+1.2%",
      changeType: "increase" as const,
      icon: TrendingUp,
    },
  ];

  const quickStats = [
    { 
      label: "Pending Approval", 
      value: recentBookings.filter(b => b.status === "pending").length, 
      icon: Clock, 
      color: "text-yellow-600" 
    },
    { 
      label: "Confirmed Today", 
      value: recentBookings.filter(b => b.status === "confirmed").length, 
      icon: CheckCircle, 
      color: "text-green-600" 
    },
    { 
      label: "Cancelled", 
      value: recentBookings.filter(b => b.status === "cancelled").length, 
      icon: XCircle, 
      color: "text-red-600" 
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
      <SEO 
        title="Vendor Dashboard - Equipment Rental Marketplace"
        description="Manage your equipment listings, bookings, and earnings"
      />
      
      <div className="min-h-screen bg-slate-50">
        <Header />

        <main className="container mx-auto px-4 py-8">
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
              
              <Link href="/vendor/listings">
                <Button className="bg-primary hover:bg-primary/90">
                  <Package className="w-4 h-4 mr-2" />
                  Manage Listings
                </Button>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statsData.map((stat) => (
              <StatCard key={stat.title} {...stat} />
            ))}
          </div>

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

            {recentBookings.length > 0 ? (
              <div className="space-y-4">
                {recentBookings.map((booking) => (
                  <BookingCard
                    key={booking.id}
                    bookingId={booking.booking_number}
                    equipmentName={booking.listing?.title || "Unknown Equipment"}
                    equipmentImage={booking.listing?.images?.[0] || "https://images.unsplash.com/photo-1581094271901-8022df4466f9?w=400"}
                    startDate={new Date(booking.start_date)}
                    endDate={new Date(booking.end_date)}
                    totalPrice={Number(booking.total_amount)}
                    status={booking.status}
                    userRole="vendor"
                    renterName={booking.renter?.full_name || "Unknown Renter"}
                    location={booking.listing?.location || "Unknown Location"}
                    onAccept={() => handleAcceptBooking(booking.id)}
                    onReject={() => handleRejectBooking(booking.id)}
                  />
                ))}
              </div>
            ) : (
              <Card className="p-12 text-center">
                <Calendar className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                <p className="text-slate-600 mb-4">No recent bookings</p>
                <Link href="/vendor/listings">
                  <Button>Create Your First Listing</Button>
                </Link>
              </Card>
            )}
          </div>

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