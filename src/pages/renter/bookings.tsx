import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { BookingCard } from "@/components/BookingCard";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";

export default function RenterBookings() {
  const [filter, setFilter] = useState("all");

  const bookings = [
    {
      id: "BK105",
      equipment: "Heavy Duty Jackhammer",
      image: "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400",
      vendor: "BuildPro Rentals",
      startDate: new Date("2025-02-10"),
      endDate: new Date("2025-02-14"),
      amount: 45000,
      status: "active" as const,
      location: "Lagos, Nigeria"
    },
    {
      id: "BK102",
      equipment: "Laser Level Kit",
      image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=400",
      vendor: "Precision Tools",
      startDate: new Date("2025-01-05"),
      endDate: new Date("2025-01-08"),
      amount: 15000,
      status: "completed" as const,
      location: "Abuja, Nigeria"
    }
  ];

  return (
    <>
      <SEO title="My Bookings - Equipment Rental" />
      <div className="min-h-screen bg-slate-50">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900">My Bookings</h1>
          </div>
          
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            {['all', 'active', 'pending', 'completed', 'cancelled'].map(f => (
              <Button 
                key={f}
                variant={filter === f ? 'default' : 'outline'}
                onClick={() => setFilter(f)}
                className="capitalize"
              >
                {f}
              </Button>
            ))}
          </div>

          <div className="space-y-4">
            {bookings.filter(b => filter === 'all' || b.status === filter).map(booking => (
              <BookingCard
                key={booking.id}
                bookingId={booking.id}
                equipmentName={booking.equipment}
                equipmentImage={booking.image}
                startDate={booking.startDate}
                endDate={booking.endDate}
                totalPrice={booking.amount}
                status={booking.status}
                userRole="renter"
                vendorName={booking.vendor}
                location={booking.location}
              />
            ))}
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
}