import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { EquipmentCard } from "@/components/EquipmentCard";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Card } from "@/components/ui/card";
import { Search, SlidersHorizontal, X } from "lucide-react";

const mockEquipment = [
  {
    id: "1",
    title: "Professional Camera Canon EOS R5",
    category: "Photography",
    price: 15000,
    location: "Lagos, Nigeria",
    rating: 4.9,
    reviewCount: 127,
    imageUrl: "https://images.unsplash.com/photo-1606980707095-3d61b7ebcdea?w=800&h=600&fit=crop",
    availability: "available" as const,
    isVerified: true,
  },
  {
    id: "2",
    title: "Excavator CAT 320D",
    category: "Heavy Machinery",
    price: 85000,
    location: "Abuja, Nigeria",
    rating: 4.8,
    reviewCount: 89,
    imageUrl: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=800&h=600&fit=crop",
    availability: "available" as const,
    isVerified: true,
  },
  {
    id: "3",
    title: "Professional Sound System",
    category: "Audio & Visual",
    price: 35000,
    location: "Port Harcourt, Nigeria",
    rating: 4.7,
    reviewCount: 156,
    imageUrl: "https://images.unsplash.com/photo-1598653222000-6b7b7a552625?w=800&h=600&fit=crop",
    availability: "available" as const,
    isVerified: true,
  },
  {
    id: "4",
    title: "Industrial Generator 50KVA",
    category: "Power Equipment",
    price: 45000,
    location: "Lagos, Nigeria",
    rating: 4.9,
    reviewCount: 203,
    imageUrl: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=800&h=600&fit=crop",
    availability: "rented" as const,
    isVerified: true,
  },
  {
    id: "5",
    title: "Concrete Mixer - 350L",
    category: "Construction",
    price: 12000,
    location: "Ibadan, Nigeria",
    rating: 4.6,
    reviewCount: 78,
    imageUrl: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=800&h=600&fit=crop",
    availability: "available" as const,
    isVerified: true,
  },
  {
    id: "6",
    title: "Professional Drone DJI Mavic 3",
    category: "Photography",
    price: 25000,
    location: "Lagos, Nigeria",
    rating: 4.9,
    reviewCount: 142,
    imageUrl: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=800&h=600&fit=crop",
    availability: "available" as const,
    isVerified: true,
  },
];

export default function BrowsePage() {
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 100000]);

  return (
    <>
      <SEO
        title="Browse Equipment - EquipRent"
        description="Browse thousands of professional equipment available for rent across Nigeria. Find construction tools, photography gear, event equipment and more."
      />
      <div className="min-h-screen flex flex-col">
        <Header />
        
        <main className="flex-1">
          {/* Page Header */}
          <section className="bg-muted/30 py-12">
            <div className="container-wide px-4 sm:px-6 lg:px-8">
              <h1 className="font-heading font-bold text-3xl sm:text-4xl mb-4">
                Browse Equipment
              </h1>
              <p className="text-muted-foreground text-lg max-w-2xl">
                Find the perfect equipment for your project from our extensive collection
              </p>
            </div>
          </section>

          {/* Search & Filters */}
          <section className="border-b bg-background sticky top-16 z-40">
            <div className="container-wide px-4 sm:px-6 lg:px-8 py-4">
              <div className="flex gap-3">
                <div className="flex-1 flex gap-2 items-center px-4 bg-muted rounded-lg">
                  <Search className="w-5 h-5 text-muted-foreground" />
                  <Input
                    placeholder="Search equipment..."
                    className="border-0 bg-transparent focus-visible:ring-0 px-0"
                  />
                </div>
                <Button
                  variant="outline"
                  className="gap-2"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  Filters
                </Button>
              </div>
            </div>
          </section>

          <div className="container-wide px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex gap-8">
              {/* Sidebar Filters */}
              <aside className={`w-64 flex-shrink-0 ${showFilters ? 'block' : 'hidden'} lg:block`}>
                <Card className="p-6 space-y-6 sticky top-32">
                  <div className="flex items-center justify-between">
                    <h3 className="font-heading font-semibold">Filters</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="lg:hidden"
                      onClick={() => setShowFilters(false)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Category</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="All Categories" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Categories</SelectItem>
                          <SelectItem value="construction">Construction</SelectItem>
                          <SelectItem value="photography">Photography</SelectItem>
                          <SelectItem value="audio-visual">Audio & Visual</SelectItem>
                          <SelectItem value="heavy-machinery">Heavy Machinery</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Location</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="All Locations" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Locations</SelectItem>
                          <SelectItem value="lagos">Lagos</SelectItem>
                          <SelectItem value="abuja">Abuja</SelectItem>
                          <SelectItem value="port-harcourt">Port Harcourt</SelectItem>
                          <SelectItem value="ibadan">Ibadan</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-4 block">
                        Price Range (₦{priceRange[0].toLocaleString()} - ₦{priceRange[1].toLocaleString()})
                      </label>
                      <Slider
                        value={priceRange}
                        onValueChange={setPriceRange}
                        max={100000}
                        step={1000}
                        className="mb-2"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Availability</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="All" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All</SelectItem>
                          <SelectItem value="available">Available Only</SelectItem>
                          <SelectItem value="rented">Currently Rented</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Button variant="outline" className="w-full">
                      Clear Filters
                    </Button>
                  </div>
                </Card>
              </aside>

              {/* Equipment Grid */}
              <div className="flex-1">
                <div className="flex items-center justify-between mb-6">
                  <p className="text-sm text-muted-foreground">
                    Showing {mockEquipment.length} results
                  </p>
                  <Select defaultValue="relevance">
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="relevance">Most Relevant</SelectItem>
                      <SelectItem value="price-low">Price: Low to High</SelectItem>
                      <SelectItem value="price-high">Price: High to Low</SelectItem>
                      <SelectItem value="rating">Highest Rated</SelectItem>
                      <SelectItem value="newest">Newest First</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {mockEquipment.map((item) => (
                    <EquipmentCard
                      key={item.id}
                      title={item.title}
                      category={item.category}
                      price={item.price}
                      location={item.location}
                      rating={item.rating}
                      reviewCount={item.reviewCount}
                      imageUrl={item.imageUrl}
                      availability={item.availability}
                      isVerified={item.isVerified}
                    />
                  ))}
                </div>

                {/* Pagination */}
                <div className="flex justify-center gap-2 mt-12">
                  <Button variant="outline">Previous</Button>
                  <Button variant="outline" className="bg-primary text-primary-foreground">1</Button>
                  <Button variant="outline">2</Button>
                  <Button variant="outline">3</Button>
                  <Button variant="outline">Next</Button>
                </div>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}