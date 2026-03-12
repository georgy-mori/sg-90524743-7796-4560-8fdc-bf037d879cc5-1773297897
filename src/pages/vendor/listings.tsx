import { useState, useEffect } from "react";
import { useRouter } from "next/router";
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
  Plus,
  Grid3x3,
  List,
  Loader2
} from "lucide-react";
import { SEO } from "@/components/SEO";
import { listingService } from "@/services/listingService";
import { authService } from "@/services/authService";
import { useToast } from "@/hooks/use-toast";

export default function VendorListings() {
  const router = useRouter();
  const { toast } = useToast();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [listings, setListings] = useState<any[]>([]);

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

      await loadListings();
    } catch (error) {
      console.error("Auth check error:", error);
      router.push("/auth/login");
    }
  };

  const loadListings = async () => {
    try {
      setLoading(true);
      const data = await listingService.getVendorListings();
      setListings(data || []);
    } catch (error: any) {
      console.error("Load listings error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to load listings",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteListing = async (id: string) => {
    if (!confirm("Are you sure you want to delete this listing?")) return;

    try {
      await listingService.deleteListing(id);
      toast({
        title: "Success",
        description: "Listing deleted successfully"
      });
      await loadListings();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete listing",
        variant: "destructive"
      });
    }
  };

  const handleUpdateAvailability = async (id: string, status: "active" | "rented" | "maintenance") => {
    try {
      await listingService.updateAvailability(id, status);
      toast({
        title: "Success",
        description: "Availability updated successfully"
      });
      await loadListings();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update availability",
        variant: "destructive"
      });
    }
  };

  const filteredListings = listings.filter((listing) => {
    const matchesSearch = listing.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || listing.availability === statusFilter;
    return matchesSearch && matchesStatus;
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
        title="My Listings - Vendor Dashboard"
        description="Manage your equipment listings"
      />
      
      <div className="min-h-screen bg-slate-50">
        <Header />

        <main className="container mx-auto px-4 py-8">
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
                <option value="active">Available</option>
                <option value="rented">Rented</option>
                <option value="maintenance">Maintenance</option>
                <option value="draft">Draft</option>
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
                    {listings.filter(l => l.availability === "active").length}
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
                    {listings.filter(l => l.availability === "rented").length}
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
                    {listings.filter(l => l.availability === "maintenance").length}
                  </p>
                </div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              </div>
            </Card>
          </div>

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
                    title={listing.title}
                    category={listing.category?.name || "Uncategorized"}
                    imageUrl={listing.images?.[0] || "https://images.unsplash.com/photo-1581094271901-8022df4466f9?w=400"}
                    price={Number(listing.price_per_day)}
                    rating={4.5}
                    reviewCount={0}
                    location={listing.location}
                    availability={listing.availability === "active" ? "available" : listing.availability === "rented" ? "rented" : "maintenance"}
                  />
                  <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    <Link href={`/vendor/listings/${listing.id}/edit`}>
                      <Button size="sm" variant="secondary">
                        Edit
                      </Button>
                    </Link>
                    <Button 
                      size="sm" 
                      variant="destructive"
                      onClick={() => handleDeleteListing(listing.id)}
                    >
                      Delete
                    </Button>
                  </div>
                  
                  <div className="mt-4">
                    <select
                      value={listing.availability}
                      onChange={(e) => handleUpdateAvailability(listing.id, e.target.value as any)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="active">Available</option>
                      <option value="rented">Rented</option>
                      <option value="maintenance">Maintenance</option>
                      <option value="draft">Draft</option>
                    </select>
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