import { Card } from "@/components/ui/card";
import { LucideIcon, Drill, Hammer, Truck, Camera, Music, Tent, Wrench, Projector } from "lucide-react";
import Link from "next/link";

interface Category {
  id: string;
  name: string;
  icon: LucideIcon;
  itemCount: number;
  color: string;
}

const categories: Category[] = [
  {
    id: "construction",
    name: "Construction",
    icon: Drill,
    itemCount: 12450,
    color: "bg-orange-100 text-orange-600",
  },
  {
    id: "power-tools",
    name: "Power Tools",
    icon: Hammer,
    itemCount: 8230,
    color: "bg-blue-100 text-blue-600",
  },
  {
    id: "heavy-machinery",
    name: "Heavy Machinery",
    icon: Truck,
    itemCount: 3420,
    color: "bg-green-100 text-green-600",
  },
  {
    id: "photography",
    name: "Photography",
    icon: Camera,
    itemCount: 5670,
    color: "bg-purple-100 text-purple-600",
  },
  {
    id: "audio-visual",
    name: "Audio & Visual",
    icon: Music,
    itemCount: 4890,
    color: "bg-pink-100 text-pink-600",
  },
  {
    id: "events",
    name: "Events & Party",
    icon: Tent,
    itemCount: 6780,
    color: "bg-yellow-100 text-yellow-600",
  },
  {
    id: "automotive",
    name: "Automotive",
    icon: Wrench,
    itemCount: 2340,
    color: "bg-red-100 text-red-600",
  },
  {
    id: "presentation",
    name: "Presentation",
    icon: Projector,
    itemCount: 1890,
    color: "bg-indigo-100 text-indigo-600",
  },
];

export function CategoryGrid() {
  return (
    <section className="py-16 lg:py-24 bg-muted/30">
      <div className="container-wide px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-heading font-bold text-3xl sm:text-4xl mb-4">
            Browse by Category
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Find exactly what you need from our extensive collection of equipment across multiple categories
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Link key={category.id} href={`/categories/${category.id}`}>
                <Card className="p-6 hover:shadow-lg transition-all cursor-pointer group">
                  <div className="flex flex-col items-center text-center space-y-3">
                    <div className={`w-16 h-16 rounded-2xl ${category.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <Icon className="w-8 h-8" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm sm:text-base mb-1 group-hover:text-primary transition-colors">
                        {category.name}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        {category.itemCount.toLocaleString()} items
                      </p>
                    </div>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}