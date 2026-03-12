import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookingCard } from "@/components/BookingCard";
import { SEO } from "@/components/SEO";
import Link from "next/link";
import { 
  Calendar, 
  Heart, 
  CreditCard, 
  MessageSquare,
  Search,
  Loader2
} from "lucide-react";
import { authService } from "@/services/authService";
import { bookingService } from "@/services/bookingService";
import { walletService } from "@/services/walletService";
import { useToast } from "@/hooks/use-toast";

export default function RenterDashboard() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("");
  const [activeBookings, setActiveBookings] = useState<any[]>([]);
  const [walletBalance, setWalletBalance] = useState(0);
  const [stats, setStats] = useState({
    activeCount: 0,
    pastCount: 0,
    savedItems: 0,
    unreadMessages: 0
  });

  useEffect(() => {
    checkAuthAndLoadData();
  }, []);

  const checkAuthAndLoadData = async () => {
    try {
      const profile = await authService.getCurrentUser();
      if (!profile) {
        router.push("/auth/login");
        return;
      }

      if (profile.role !== "renter") {
        toast({
          title: "Access Denied",
          description: "This page is only accessible to renters",
          variant: "destructive"
        });
        router.push("/");
        return;
      }

      setUserName(profile.full_name?.split(" ")[0] || "User");
      await loadDashboardData();
    } catch (error) {
      console.error("Auth check error:", error);
      router.push("/auth/login");
    }
  };

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // Load bookings
      const bookings = await bookingService.getRenterBookings();
      const active = bookings.filter(b => b.status === "active" || b.status === "confirmed");
      const past = bookings.filter(b => b.status === "completed");

      setActiveBookings(active.slice(0, 3));

      // Load wallet balance
      const balance = await walletService.getBalance();
      setWalletBalance(Number(balance) || 0);

      setStats({
        activeCount: active.length,
        pastCount: past.length,
        savedItems: 0, // TODO: Implement favorites count
        unreadMessages: 0 // TODO: Implement messages count
      });
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

  const handleCancelBooking = async (bookingId: string) => {
    try {
      await bookingService.cancelBooking(bookingId);
      toast({
        title: "Success",
        description: "Booking cancelled and refund processed"
      });
      await loadDashboardData();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to cancel booking",
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
      <SEO title="Renter Dashboard - Equipment Rental" description="Manage your rentals and bookings" />
      
      <div className="min-h-screen bg-slate-50">
        <Header />

        <main className="container mx-auto px-4 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Welcome back, {userName}!</h1>
              <p className="text-slate-600 mt-1">Ready for your next project?</p>
            </div>
            
            <Link href="/browse">
              <Button className="bg-primary hover:bg-primary/90">
                <Search className="w-4 h-4 mr-2" />
                Find Equipment
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Link href="/renter/bookings">
              <Card className="p-6 hover:shadow-md transition-shadow cursor-pointer">
                <Calendar className="w-8 h-8 text-primary mb-4" />
                <h3 className="font-semibold text-slate-900">My Bookings</h3>
                <p className="text-sm text-slate-600 mt-1">
                  {stats.activeCount} Active, {stats.pastCount} Past
                </p>
              </Card>
            </Link>
            
            <Link href="/renter/favorites">
              <Card className="p-6 hover:shadow-md transition-shadow cursor-pointer">
                <Heart className="w-8 h-8 text-red-500 mb-4" />
                <h3 className="font-semibold text-slate-900">Saved Items</h3>
                <p className="text-sm text-slate-600 mt-1">{stats.savedItems} Equipment saved</p>
              </Card>
            </Link>

            <Link href="/renter/wallet">
              <Card className="p-6 hover:shadow-md transition-shadow cursor-pointer">
                <CreditCard className="w-8 h-8 text-green-500 mb-4" />
                <h3 className="font-semibold text-slate-900">Wallet & Payments</h3>
                <p className="text-sm text-slate-600 mt-1">Balance: ₦{walletBalance.toLocaleString()}</p>
              </Card>
            </Link>

            <Link href="/renter/messages">
              <Card className="p-6 hover:shadow-md transition-shadow cursor-pointer">
                <MessageSquare className="w-8 h-8 text-blue-500 mb-4" />
                <h3 className="font-semibold text-slate-900">Messages</h3>
                <p className="text-sm text-slate-600 mt-1">{stats.unreadMessages} Unread messages</p>
              </Card>
            </Link>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Current Bookings</h2>
            {activeBookings.length > 0 ? (
              <div className="space-y-4">
                {activeBookings.map((booking) => (
                  <BookingCard
                    key={booking.id}
                    bookingId={booking.booking_number}
                    equipmentName={booking.listing?.title || "Unknown Equipment"}
                    equipmentImage={booking.listing?.images?.[0] || "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400"}
                    startDate={new Date(booking.start_date)}
                    endDate={new Date(booking.end_date)}
                    totalPrice={Number(booking.total_amount)}
                    status={booking.status}
                    userRole="renter"
                    vendorName={booking.listing?.vendor?.full_name || "Unknown Vendor"}
                    location={booking.listing?.location || "Unknown Location"}
                    onCancel={() => handleCancelBooking(booking.id)}
                  />
                ))}
              </div>
            ) : (
              <Card className="p-12 text-center">
                <Search className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                <p className="text-slate-600 mb-4">No active bookings</p>
                <Link href="/browse">
                  <Button>Browse Equipment</Button>
                </Link>
              </Card>
            )}
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}