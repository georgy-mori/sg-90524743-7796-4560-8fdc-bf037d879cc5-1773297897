import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/StatusBadge";
import { Star, MapPin, Calendar, Heart } from "lucide-react";
import { cn } from "@/lib/utils";

interface EquipmentCardProps {
  title: string;
  category: string;
  price: number;
  priceUnit?: string;
  location: string;
  rating: number;
  reviewCount: number;
  imageUrl: string;
  availability: "available" | "rented" | "maintenance";
  isVerified?: boolean;
  isFavorite?: boolean;
  onFavoriteToggle?: () => void;
  onClick?: () => void;
  className?: string;
}

export function EquipmentCard({
  title,
  category,
  price,
  priceUnit = "day",
  location,
  rating,
  reviewCount,
  imageUrl,
  availability,
  isVerified = false,
  isFavorite = false,
  onFavoriteToggle,
  onClick,
  className,
}: EquipmentCardProps) {
  return (
    <Card
      className={cn(
        "equipment-card overflow-hidden cursor-pointer group",
        className
      )}
      onClick={onClick}
    >
      {/* Image Section */}
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Favorite Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onFavoriteToggle?.();
          }}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white transition-colors"
        >
          <Heart
            className={cn(
              "w-5 h-5",
              isFavorite ? "fill-red-500 text-red-500" : "text-muted-foreground"
            )}
          />
        </button>

        {/* Availability Badge */}
        <div className="absolute top-3 left-3">
          {availability === "available" && (
            <Badge className="bg-green-500 text-white border-0">
              Available
            </Badge>
          )}
          {availability === "rented" && (
            <Badge className="bg-yellow-500 text-white border-0">
              Rented
            </Badge>
          )}
          {availability === "maintenance" && (
            <Badge className="bg-red-500 text-white border-0">
              Maintenance
            </Badge>
          )}
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4 space-y-3">
        {/* Category & Verified Badge */}
        <div className="flex items-center justify-between">
          <Badge variant="outline" className="text-xs">
            {category}
          </Badge>
          {isVerified && (
            <span className="trust-badge text-xs">
              ✓ Verified
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="font-heading font-semibold text-lg line-clamp-2 text-foreground group-hover:text-primary transition-colors">
          {title}
        </h3>

        {/* Location */}
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <MapPin className="w-4 h-4" />
          <span className="line-clamp-1">{location}</span>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 rating-star fill-current" />
            <span className="font-semibold text-sm">{rating.toFixed(1)}</span>
          </div>
          <span className="text-sm text-muted-foreground">
            ({reviewCount} reviews)
          </span>
        </div>

        {/* Price & CTA */}
        <div className="flex items-center justify-between pt-2 border-t">
          <div>
            <div className="price-display">₦{price.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground">per {priceUnit}</div>
          </div>
          <Button className="btn-action">
            Book Now
          </Button>
        </div>
      </div>
    </Card>
  );
}