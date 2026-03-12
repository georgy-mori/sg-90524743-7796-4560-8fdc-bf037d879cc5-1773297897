import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { BookingCard } from "@/components/BookingCard";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search,
  Calendar,
  Loader2
} from "lucide-react";
import { SEO } from "@/components/SEO";
import { bookingService } from "@/services/bookingService";
import { authService } from "@/services/authService";
import { useToast } from "@/hooks/use-toast";

export default function RenterBookings() {
  const router = useRouter();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState<any[]>([]);

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

      await loadBookings();
    } catch (error) {
      console.error("Auth check error:", error);
      router.push("/auth/login");
    }
  };

  const loadBookings = async () => {
    try {
      setLoading(true);
      const data = await bookingService.getRenterBookings();
      setBookings(data || []);
    } catch (error: any) {
      console.error("Load bookings error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to load bookings",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    if (!confirm("Are you sure you want to cancel this booking?")) return;
    
    try {
      await bookingService.cancelBooking(bookingId);
      toast({
        title: "Success",
        description: "Booking cancelled successfully"
      });
      await loadBookings();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to cancel booking",
        variant: "destructive"
      });
    }
  };

  const filteredBookings = bookings.filter(booking => {
    const matchesTab = activeTab === "all" || booking.status === activeTab;
    const matchesSearch = 
      booking.listing?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.booking_number?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const tabs = [
    { id: "all", label: "All Bookings" },
    { id: "active", label: "Active" },
    { id: "pending", label: "Pending" },
    { id: "completed", label: "Completed" },
    { id: "cancelled", label: "Cancelled" },
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
        title="My Bookings - Renter Dashboard"
        description="Manage your equipment rentals"
      />
      
      <div className="min-h-screen bg-slate-50">
        <Header />

        <main className="container mx-auto px-4 py-8 max-w-5xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900">My Bookings</h1>
            <p className="text-slate-600 mt-1">Track and manage your equipment rentals</p>
          </div>

          <Card className="p-6 mb-8">
            <div className="flex flex-col lg:flex-row gap-4 justify-between items-center mb-6">
              <div className="flex w-full lg:w-auto overflow-x-auto pb-2 lg:pb-0 hide-scrollbar gap-2">
                {tabs.map((tab) => (
                  <Button
                    key={tab.id}
                    variant={activeTab === tab.id ? "default" : "outline"}
                    onClick={() => setActiveTab(tab.id)}
                    className="whitespace-nowrap"
                  >
                    {tab.label}
                  </Button>
                ))}
              </div>

              <div className="relative w-full lg:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                  type="text"
                  placeholder="Search bookings..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-4">
              {filteredBookings.length === 0 ? (
                <div className="text-center py-12">
                  <Calendar className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                  <h3 className="text-lg font-medium text-slate-900 mb-2">No bookings found</h3>
                  <p className="text-slate-600 mb-6">
                    {searchQuery ? "Try adjusting your search filters" : "You haven't made any bookings yet."}
                  </p>
                  <Button onClick={() => router.push("/browse")}>
                    Browse Equipment
                  </Button>
                </div>
              ) : (
                filteredBookings.map((booking) => (
                  <BookingCard
                    key={booking.id}
                    bookingId={booking.booking_number}
                    equipmentName={booking.listing?.title || "Unknown Equipment"}
                    equipmentImage={booking.listing?.images?.[0] || "https://images.unsplash.com/photo-1581094271901-8022df4466f9?w=400"}
                    startDate={new Date(booking.start_date)}
                    endDate={new Date(booking.end_date)}
                    totalPrice={Number(booking.total_amount)}
                    status={booking.status}
                    userRole="renter"
                    vendorName={booking.vendor?.full_name || "Unknown Vendor"}
                    location={booking.listing?.location || "Unknown Location"}
                    onReject={() => handleCancelBooking(booking.id)}
                  />
                ))
              )}
            </div>
          </Card>
        </main>
        <Footer />
      </div>
    </>
  );
}