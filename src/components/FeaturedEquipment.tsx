import { EquipmentCard } from "@/components/EquipmentCard";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

const featuredItems = [
  {
    id: "1",
    title: "Professional Camera Canon EOS R5",
    category: "Photography",
    price: 15000,
    priceUnit: "day",
    location: "Lagos, Nigeria",
    rating: 4.9,
    reviewCount: 127,
    imageUrl: "https://images.unsplash.com/photo-1606980707095-3d61b7ebcdea?w=800&h=600&fit=crop",
    availability: "available" as const,
    isVerified: true,
    isFavorite: false,
  },
  {
    id: "2",
    title: "Excavator CAT 320D - Heavy Duty",
    category: "Heavy Machinery",
    price: 85000,
    priceUnit: "day",
    location: "Abuja, Nigeria",
    rating: 4.8,
    reviewCount: 89,
    imageUrl: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=800&h=600&fit=crop",
    availability: "available" as const,
    isVerified: true,
    isFavorite: false,
  },
  {
    id: "3",
    title: "Professional Sound System Package",
    category: "Audio & Visual",
    price: 35000,
    priceUnit: "day",
    location: "Port Harcourt, Nigeria",
    rating: 4.7,
    reviewCount: 156,
    imageUrl: "https://images.unsplash.com/photo-1598653222000-6b7b7a552625?w=800&h=600&fit=crop",
    availability: "available" as const,
    isVerified: true,
    isFavorite: false,
  },
  {
    id: "4",
    title: "Industrial Generator 50KVA",
    category: "Power Equipment",
    price: 45000,
    priceUnit: "day",
    location: "Lagos, Nigeria",
    rating: 4.9,
    reviewCount: 203,
    imageUrl: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=800&h=600&fit=crop",
    availability: "rented" as const,
    isVerified: true,
    isFavorite: true,
  },
];

export function FeaturedEquipment() {
  return (
    <section className="py-16 lg:py-24">
      <div className="container-wide px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="font-heading font-bold text-3xl sm:text-4xl mb-4">
              Featured Equipment
            </h2>
            <p className="text-muted-foreground text-lg">
              Top-rated equipment from verified vendors
            </p>
          </div>
          <Button variant="ghost" asChild className="hidden sm:inline-flex">
            <Link href="/browse">
              View All
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredItems.map((item) => (
            <EquipmentCard
              key={item.id}
              title={item.title}
              category={item.category}
              price={item.price}
              priceUnit={item.priceUnit}
              location={item.location}
              rating={item.rating}
              reviewCount={item.reviewCount}
              imageUrl={item.imageUrl}
              availability={item.availability}
              isVerified={item.isVerified}
              isFavorite={item.isFavorite}
              onFavoriteToggle={() => console.log("Toggle favorite:", item.id)}
              onClick={() => console.log("View equipment:", item.id)}
            />
          ))}
        </div>

        <div className="text-center mt-8 sm:hidden">
          <Button variant="outline" asChild>
            <Link href="/browse">
              View All Equipment
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}