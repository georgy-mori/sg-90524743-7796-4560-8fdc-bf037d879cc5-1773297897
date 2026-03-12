import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { EquipmentCard } from "@/components/EquipmentCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { 
  Search, 
  SlidersHorizontal, 
  X,
  Loader2,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { SEO } from "@/components/SEO";
import { listingService } from "@/services/listingService";
import { useToast } from "@/hooks/use-toast";

const ITEMS_PER_PAGE = 12;

export default function Browse() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [listings, setListings] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    location: "",
    minPrice: 0,
    maxPrice: 100000,
    availability: ""
  });

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [listingsData, categoriesData] = await Promise.all([
        listingService.getListings(),
        listingService.getCategories()
      ]);
      setListings(listingsData);
      setCategories(categoriesData);
    } catch (error: any) {
      console.error("Load data error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to load listings",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredListings = listings.filter(listing => {
    const matchesSearch = 
      !filters.search || 
      listing.title?.toLowerCase().includes(filters.search.toLowerCase()) ||
      listing.description?.toLowerCase().includes(filters.search.toLowerCase());
    
    const matchesCategory = 
      !filters.category || 
      listing.category_id === filters.category;
    
    const matchesLocation = 
      !filters.location || 
      listing.location?.toLowerCase().includes(filters.location.toLowerCase());
    
    const price = Number(listing.price_per_day || 0);
    const matchesPrice = 
      price >= filters.minPrice && 
      price <= filters.maxPrice;
    
    const matchesAvailability = 
      !filters.availability || 
      listing.availability === filters.availability;

    return matchesSearch && matchesCategory && matchesLocation && matchesPrice && matchesAvailability;
  });

  const totalPages = Math.ceil(filteredListings.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedListings = filteredListings.slice(startIndex, endIndex);

  const clearFilters = () => {
    setFilters({
      search: "",
      category: "",
      location: "",
      minPrice: 0,
      maxPrice: 100000,
      availability: ""
    });
  };

  const goToPage = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const locations = [
    "Lagos",
    "Abuja",
    "Port Harcourt",
    "Kano",
    "Ibadan",
    "Kaduna"
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
        title="Browse Equipment" 
        description="Find the perfect equipment for your construction projects"
      />
      
      <div className="min-h-screen bg-slate-50">
        <Header />

        <main className="container mx-auto px-4 py-8">
          {/* Search Bar */}
          <Card className="p-6 mb-8">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                  type="text"
                  placeholder="Search equipment..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  className="pl-10"
                />
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className="gap-2"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  Filters
                </Button>
                {(filters.category || filters.location || filters.availability) && (
                  <Button variant="outline" onClick={clearFilters} className="gap-2">
                    <X className="w-4 h-4" />
                    Clear
                  </Button>
                )}
              </div>
            </div>

            {/* Filter Panel */}
            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-200">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Category
                  </label>
                  <select
                    value={filters.category}
                    onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">All Categories</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Location
                  </label>
                  <select
                    value={filters.location}
                    onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">All Locations</option>
                    {locations.map((loc) => (
                      <option key={loc} value={loc}>
                        {loc}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Availability
                  </label>
                  <select
                    value={filters.availability}
                    onChange={(e) => setFilters({ ...filters, availability: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">All Status</option>
                    <option value="active">Available</option>
                    <option value="rented">Rented</option>
                    <option value="maintenance">Maintenance</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Price Range (₦{filters.minPrice.toLocaleString()} - ₦{filters.maxPrice.toLocaleString()})
                  </label>
                  <Slider
                    value={[filters.minPrice, filters.maxPrice]}
                    onValueChange={([min, max]) => setFilters({ ...filters, minPrice: min, maxPrice: max })}
                    min={0}
                    max={100000}
                    step={1000}
                    className="mt-3"
                  />
                </div>
              </div>
            )}
          </Card>

          {/* Results */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-slate-600">
              Showing <span className="font-medium text-slate-900">{startIndex + 1}</span> to{" "}
              <span className="font-medium text-slate-900">{Math.min(endIndex, filteredListings.length)}</span> of{" "}
              <span className="font-medium text-slate-900">{filteredListings.length}</span> results
            </p>
            {totalPages > 1 && (
              <p className="text-slate-600">
                Page <span className="font-medium text-slate-900">{currentPage}</span> of{" "}
                <span className="font-medium text-slate-900">{totalPages}</span>
              </p>
            )}
          </div>

          {/* Equipment Grid */}
          {paginatedListings.length === 0 ? (
            <Card className="p-12 text-center">
              <p className="text-slate-600 mb-4">No equipment found matching your criteria</p>
              <Button onClick={clearFilters} variant="outline">
                Clear Filters
              </Button>
            </Card>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedListings.map((listing) => (
                  <EquipmentCard
                    key={listing.id}
                    title={listing.title}
                    category={listing.category?.name || "Equipment"}
                    imageUrl={listing.images?.[0] || "https://images.unsplash.com/photo-1581094271901-8022df4466f9?w=400"}
                    price={Number(listing.price_per_day)}
                    location={listing.location || "Nigeria"}
                    rating={4.5}
                    reviewCount={12}
                    availability={listing.availability}
                    isVerified={listing.vendor?.is_verified || false}
                  />
                ))}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="mt-12 flex items-center justify-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="gap-2"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </Button>

                  <div className="flex gap-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                      .filter(page => {
                        return (
                          page === 1 ||
                          page === totalPages ||
                          (page >= currentPage - 1 && page <= currentPage + 1)
                        );
                      })
                      .map((page, index, array) => {
                        const showEllipsisBefore = index > 0 && array[index - 1] !== page - 1;
                        return (
                          <>
                            {showEllipsisBefore && (
                              <span key={`ellipsis-${page}`} className="px-3 py-2 text-slate-400">
                                ...
                              </span>
                            )}
                            <Button
                              key={page}
                              variant={currentPage === page ? "default" : "outline"}
                              size="sm"
                              onClick={() => goToPage(page)}
                              className="min-w-[40px]"
                            >
                              {page}
                            </Button>
                          </>
                        );
                      })}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="gap-2"
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </>
          )}
        </main>

        <Footer />
      </div>
    </>
  );
}