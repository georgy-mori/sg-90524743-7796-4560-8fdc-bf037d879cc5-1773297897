import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookingCard } from "@/components/BookingCard";
import { EquipmentCard } from "@/components/EquipmentCard";
import Link from "next/link";
import { 
  Calendar, 
  Heart, 
  CreditCard, 
  MessageSquare,
  Search
} from "lucide-react";
import { SEO } from "@/components/SEO";

export default function RenterDashboard() {
  const activeBookings = [
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
    }
  ];

  return (
    <>
      <SEO title="Renter Dashboard - Equipment Rental" description="Manage your rentals and bookings" />
      
      <div className="min-h-screen bg-slate-50">
        <Header />

        <main className="container mx-auto px-4 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Welcome back, John!</h1>
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
                <p className="text-sm text-slate-600 mt-1">2 Active, 5 Past</p>
              </Card>
            </Link>
            
            <Link href="/renter/favorites">
              <Card className="p-6 hover:shadow-md transition-shadow cursor-pointer">
                <Heart className="w-8 h-8 text-red-500 mb-4" />
                <h3 className="font-semibold text-slate-900">Saved Items</h3>
                <p className="text-sm text-slate-600 mt-1">12 Equipment saved</p>
              </Card>
            </Link>

            <Link href="/renter/wallet">
              <Card className="p-6 hover:shadow-md transition-shadow cursor-pointer">
                <CreditCard className="w-8 h-8 text-green-500 mb-4" />
                <h3 className="font-semibold text-slate-900">Wallet & Payments</h3>
                <p className="text-sm text-slate-600 mt-1">Balance: ₦150,000</p>
              </Card>
            </Link>

            <Link href="/renter/messages">
              <Card className="p-6 hover:shadow-md transition-shadow cursor-pointer">
                <MessageSquare className="w-8 h-8 text-blue-500 mb-4" />
                <h3 className="font-semibold text-slate-900">Messages</h3>
                <p className="text-sm text-slate-600 mt-1">3 Unread messages</p>
              </Card>
            </Link>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Current Bookings</h2>
            <div className="space-y-4">
              {activeBookings.map((booking) => (
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
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}