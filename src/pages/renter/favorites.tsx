import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { EquipmentCard } from "@/components/EquipmentCard";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Trash2, Share2, Grid3x3, List } from "lucide-react";
import { SEO } from "@/components/SEO";

export default function RenterFavorites() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const favorites = [
    {
      title: "Concrete Mixer - 180L Industrial",
      category: "Construction",
      imageUrl: "https://images.unsplash.com/photo-1581094271901-8022df4466f9?w=800",
      price: 15000,
      rating: 4.8,
      reviewCount: 45,
      location: "Lagos, Nigeria",
      availability: "available" as const,
      verified: true,
      savedDate: "2025-01-12",
    },
    {
      title: "Power Generator - 10KVA Diesel",
      category: "Power Tools",
      imageUrl: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=800",
      price: 18000,
      rating: 4.7,
      reviewCount: 52,
      location: "Lagos, Nigeria",
      availability: "available" as const,
      verified: true,
      savedDate: "2025-01-10",
    },
    {
      title: "Scaffolding Complete Set - 50ft",
      category: "Construction",
      imageUrl: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=800",
      price: 25000,
      rating: 4.9,
      reviewCount: 67,
      location: "Lagos, Nigeria",
      availability: "rented" as const,
      verified: true,
      savedDate: "2025-01-08",
    },
  ];

  return (
    <>
      <SEO title="My Favorites - Equipment Rental" description="Your saved equipment listings" />
      
      <div className="min-h-screen bg-slate-50">
        <Header />

        <main className="container mx-auto px-4 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">My Favorites</h1>
              <p className="text-slate-600 mt-1">{favorites.length} saved items</p>
            </div>
            
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

          {favorites.length === 0 ? (
            <Card className="p-12 text-center">
              <Heart className="w-16 h-16 mx-auto mb-4 text-slate-300" />
              <h3 className="text-xl font-bold text-slate-900 mb-2">No favorites yet</h3>
              <p className="text-slate-600 mb-6">Start saving equipment you're interested in</p>
              <Button className="bg-primary hover:bg-primary/90">
                Browse Equipment
              </Button>
            </Card>
          ) : (
            <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
              {favorites.map((item, index) => (
                <div key={index} className="relative group">
                  <EquipmentCard {...item} />
                  <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button size="sm" variant="secondary">
                      <Share2 className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="destructive">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="mt-2">
                    <p className="text-xs text-slate-500">Saved on {item.savedDate}</p>
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