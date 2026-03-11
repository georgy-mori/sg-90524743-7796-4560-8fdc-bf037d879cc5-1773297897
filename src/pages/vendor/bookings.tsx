import { useState } from "react";
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
  Filter,
  Download
} from "lucide-react";
import { SEO } from "@/components/SEO";

export default function VendorBookings() {
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  const bookings = [
    {
      id: "BK001",
      equipment: "Concrete Mixer - 180L",
      image: "https://images.unsplash.com/photo-1581094271901-8022df4466f9?w=400",
      renter: "John Doe",
      startDate: "2025-01-15",
      endDate: "2025-01-20",
      amount: 75000,
      status: "active" as const,
    },
    {
      id: "BK002",
      equipment: "Scaffolding Set - 50ft",
      image: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=400",
      renter: "Jane Smith",
      startDate: "2025-01-18",
      endDate: "2025-01-25",
      amount: 120000,
      status: "pending" as const,
    },
    {
      id: "BK003",
      equipment: "Power Generator - 10KVA",
      image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=400",
      renter: "Mike Johnson",
      startDate: "2025-01-10",
      endDate: "2025-01-14",
      amount: 85000,
      status: "completed" as const,
    },
    {
      id: "BK004",
      equipment: "Welding Machine - 200A",
      image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400",
      renter: "Sarah Williams",
      startDate: "2025-01-22",
      endDate: "2025-01-28",
      amount: 60000,
      status: "confirmed" as const,
    },
  ];

  const filteredBookings = bookings.filter(booking => 
    statusFilter === "all" || booking.status === statusFilter
  );

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
              {filteredBookings.map((booking) => (
                <BookingCard
                  key={booking.id}
                  {...booking}
                  onAccept={() => console.log("Accept:", booking.id)}
                  onReject={() => console.log("Reject:", booking.id)}
                  onContact={() => console.log("Contact:", booking.renter)}
                />
              ))}
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
                      <p className="font-medium text-slate-900">{booking.equipment}</p>
                      <p className="text-sm text-slate-600 mt-1">{booking.renter}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-sm font-medium text-primary">
                          ₦{booking.amount.toLocaleString()}
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