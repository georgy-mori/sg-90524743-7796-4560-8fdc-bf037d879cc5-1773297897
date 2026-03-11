import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { EquipmentCard } from "@/components/EquipmentCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { 
  Package, 
  Search, 
  Filter,
  Plus,
  Grid3x3,
  List
} from "lucide-react";
import { SEO } from "@/components/SEO";

export default function VendorListings() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const listings = [
    {
      id: "1",
      name: "Concrete Mixer - 180L Industrial",
      category: "Construction",
      image: "https://images.unsplash.com/photo-1581094271901-8022df4466f9?w=800",
      price: 15000,
      rating: 4.8,
      reviews: 45,
      location: "Lagos, Nigeria",
      verified: true,
      status: "available" as const,
      bookings: 23,
      earnings: "₦345,000",
    },
    {
      id: "2",
      name: "Scaffolding Complete Set - 50ft",
      category: "Construction",
      image: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=800",
      price: 25000,
      rating: 4.9,
      reviews: 67,
      location: "Lagos, Nigeria",
      verified: true,
      status: "rented" as const,
      bookings: 34,
      earnings: "₦850,000",
    },
    {
      id: "3",
      name: "Power Generator - 10KVA Diesel",
      category: "Power Tools",
      image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=800",
      price: 18000,
      rating: 4.7,
      reviews: 52,
      location: "Lagos, Nigeria",
      verified: true,
      status: "maintenance" as const,
      bookings: 18,
      earnings: "₦324,000",
    },
    {
      id: "4",
      name: "Welding Machine - 200A Arc Welder",
      category: "Power Tools",
      image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800",
      price: 12000,
      rating: 4.6,
      reviews: 38,
      location: "Lagos, Nigeria",
      verified: false,
      status: "available" as const,
      bookings: 15,
      earnings: "₦180,000",
    },
  ];

  const filteredListings = listings.filter((listing) => {
    const matchesSearch = listing.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || listing.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <>
      <SEO 
        title="My Listings - Vendor Dashboard"
        description="Manage your equipment listings"
      />
      
      <div className="min-h-screen bg-slate-50">
        <Header />

        <main className="container mx-auto px-4 py-8">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">My Listings</h1>
              <p className="text-slate-600 mt-1">Manage your equipment inventory</p>
            </div>
            
            <Link href="/vendor/listings/create">
              <Button className="bg-primary hover:bg-primary/90">
                <Plus className="w-4 h-4 mr-2" />
                Add New Listing
              </Button>
            </Link>
          </div>

          {/* Filters and Search */}
          <Card className="p-6 mb-8">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <Input
                    type="text"
                    placeholder="Search your listings..."
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
                <option value="available">Available</option>
                <option value="rented">Rented</option>
                <option value="maintenance">Maintenance</option>
              </select>

              <div className="flex gap-2">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="icon"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid3x3 className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="icon"
                  onClick={() => setViewMode("list")}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>

          {/* Stats Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 mb-1">Total Listings</p>
                  <p className="text-2xl font-bold text-slate-900">{listings.length}</p>
                </div>
                <Package className="w-8 h-8 text-primary" />
              </div>
            </Card>
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 mb-1">Available</p>
                  <p className="text-2xl font-bold text-green-600">
                    {listings.filter(l => l.status === "available").length}
                  </p>
                </div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
            </Card>
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 mb-1">Rented</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {listings.filter(l => l.status === "rented").length}
                  </p>
                </div>
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              </div>
            </Card>
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 mb-1">Maintenance</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {listings.filter(l => l.status === "maintenance").length}
                  </p>
                </div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              </div>
            </Card>
          </div>

          {/* Listings Grid/List */}
          {filteredListings.length === 0 ? (
            <Card className="p-12 text-center">
              <Package className="w-16 h-16 mx-auto mb-4 text-slate-300" />
              <h3 className="text-xl font-bold text-slate-900 mb-2">No listings found</h3>
              <p className="text-slate-600 mb-6">
                {searchQuery ? "Try adjusting your search" : "Create your first listing to get started"}
              </p>
              <Link href="/vendor/listings/create">
                <Button className="bg-primary hover:bg-primary/90">
                  <Plus className="w-4 h-4 mr-2" />
                  Add New Listing
                </Button>
              </Link>
            </Card>
          ) : (
            <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
              {filteredListings.map((listing) => (
                <div key={listing.id} className="relative group">
                  <EquipmentCard 
                    id={listing.id}
                    title={listing.name}
                    category={listing.category}
                    imageUrl={listing.image}
                    price={listing.price}
                    rating={listing.rating}
                    reviewCount={listing.reviews}
                    location={listing.location}
                    availability={listing.status === "available" ? "available" : "unavailable"}
                  />
                  <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Link href={`/vendor/listings/${listing.id}/edit`}>
                      <Button size="sm" variant="secondary">
                        Edit
                      </Button>
                    </Link>
                  </div>
                  
                  {/* Additional Stats Overlay */}
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <Card className="p-3">
                      <p className="text-xs text-slate-600">Total Bookings</p>
                      <p className="text-lg font-bold text-slate-900">{listing.bookings}</p>
                    </Card>
                    <Card className="p-3">
                      <p className="text-xs text-slate-600">Total Earnings</p>
                      <p className="text-lg font-bold text-primary">{listing.earnings}</p>
                    </Card>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>

        <Footer />
      </div>
    </>
  );
}