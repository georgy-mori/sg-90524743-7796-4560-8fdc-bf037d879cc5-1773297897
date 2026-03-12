import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { BookingCard } from "@/components/BookingCard";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { 
  Calendar as CalendarIcon,
  Search,
  Download,
  Loader2
} from "lucide-react";
import { SEO } from "@/components/SEO";
import { StatusBadge } from "@/components/StatusBadge";
import { bookingService } from "@/services/bookingService";
import { authService } from "@/services/authService";
import { useToast } from "@/hooks/use-toast";

export default function VendorBookings() {
  const router = useRouter();
  const { toast } = useToast();
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list");
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState<any[]>([]);

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

      await loadBookings();
    } catch (error) {
      console.error("Auth check error:", error);
      router.push("/auth/login");
    }
  };

  const loadBookings = async () => {
    try {
      setLoading(true);
      const data = await bookingService.getVendorBookings();
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

  const handleAcceptBooking = async (bookingId: string) => {
    try {
      await bookingService.acceptBooking(bookingId);
      toast({
        title: "Success",
        description: "Booking accepted successfully"
      });
      await loadBookings();
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
      await loadBookings();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to reject booking",
        variant: "destructive"
      });
    }
  };

  const filteredBookings = bookings.filter(booking => {
    const matchesStatus = statusFilter === "all" || booking.status === statusFilter;
    const matchesSearch = 
      booking.listing?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.renter?.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.booking_number?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

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
        title="Bookings - Vendor Dashboard"
        description="Manage your equipment bookings"
      />
      
      <div className="min-h-screen bg-slate-50">
        <Header />

        <main className="container mx-auto px-4 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Bookings</h1>
              <p className="text-slate-600 mt-1">Manage your equipment bookings</p>
            </div>
            
            <div className="flex gap-3">
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                onClick={() => setViewMode("list")}
              >
                List View
              </Button>
              <Button
                variant={viewMode === "calendar" ? "default" : "outline"}
                onClick={() => setViewMode("calendar")}
              >
                <CalendarIcon className="w-4 h-4 mr-2" />
                Calendar
              </Button>
            </div>
          </div>

          <Card className="p-6 mb-8">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
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
              
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>

              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </Card>

          {viewMode === "list" ? (
            <div className="space-y-4">
              {filteredBookings.length === 0 ? (
                <Card className="p-12 text-center">
                  <CalendarIcon className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                  <p className="text-slate-600 mb-4">
                    {searchQuery ? "No bookings found matching your search" : "No bookings yet"}
                  </p>
                </Card>
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
                    userRole="vendor"
                    renterName={booking.renter?.full_name || "Unknown Renter"}
                    location={booking.listing?.location || "Unknown Location"}
                    onAccept={() => handleAcceptBooking(booking.id)}
                    onReject={() => handleRejectBooking(booking.id)}
                  />
                ))
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2 p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Booking Calendar</h3>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border"
                />
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-4">
                  {selectedDate ? `Bookings for ${selectedDate.toLocaleDateString()}` : "Select a date"}
                </h3>
                <div className="space-y-4">
                  {filteredBookings.slice(0, 3).map((booking) => (
                    <div key={booking.id} className="p-4 bg-slate-50 rounded-lg">
                      <p className="font-medium text-slate-900">{booking.listing?.title || "Unknown"}</p>
                      <p className="text-sm text-slate-600 mt-1">{booking.renter?.full_name || "Unknown"}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-sm font-medium text-primary">
                          ₦{Number(booking.total_amount).toLocaleString()}
                        </span>
                        <StatusBadge status={booking.status} />
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}
        </main>

        <Footer />
      </div>
    </>
  );
}