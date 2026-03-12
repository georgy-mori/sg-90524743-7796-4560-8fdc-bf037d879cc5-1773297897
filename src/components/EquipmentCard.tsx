import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/StatusBadge";
import { Star, MapPin, Heart, ShieldCheck, Eye } from "lucide-react";
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
  images?: string[];
  availability: "available" | "rented" | "maintenance";
  isVerified?: boolean;
  isFavorite?: boolean;
  onFavoriteToggle?: () => void;
  onClick?: () => void;
  onImageClick?: () => void;
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
  images,
  availability,
  isVerified = false,
  isFavorite = false,
  onFavoriteToggle,
  onClick,
  onImageClick,
  className,
}: EquipmentCardProps) {
  return (
    <Card 
      className={cn(
        "group overflow-hidden transition-all duration-300 cursor-pointer",
        "hover:shadow-xl hover:-translate-y-1",
        className
      )}
      onClick={onClick}
    >
      {/* Image Container */}
      <div 
        className="relative h-52 overflow-hidden bg-muted"
        onClick={(e) => {
          if (onImageClick) {
            e.stopPropagation();
            onImageClick();
          }
        }}
      >
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        
        {/* Gradient Overlay on Hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* View Full Image Hint */}
        {images && images.length > 0 && (
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
              <span className="text-sm font-medium">Click to view images</span>
            </div>
          </div>
        )}
        
        {/* Top Right Badges */}
        <div className="absolute top-3 right-3 flex flex-col gap-2">
          <StatusBadge status={availability} />
          {isVerified && (
            <Badge className="bg-white/95 text-primary border-0 shadow-lg backdrop-blur-sm">
              <ShieldCheck className="w-3 h-3 mr-1" />
              Verified
            </Badge>
          )}
        </div>

        {/* Favorite Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onFavoriteToggle?.();
          }}
          className={cn(
            "absolute top-3 left-3 w-10 h-10 rounded-full flex items-center justify-center",
            "transition-all duration-300",
            "bg-white/90 backdrop-blur-sm shadow-lg",
            "opacity-0 group-hover:opacity-100",
            "hover:scale-110 hover:bg-white",
            isFavorite && "opacity-100"
          )}
        >
          <Heart
            className={cn(
              "w-5 h-5 transition-all",
              isFavorite ? "fill-red-500 text-red-500" : "text-gray-700"
            )}
          />
        </button>

        {/* Quick View Button - Appears on Hover */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
          <Button 
            size="sm" 
            className="btn-action shadow-lg"
            onClick={(e) => {
              e.stopPropagation();
              onClick?.();
            }}
          >
            <Eye className="w-4 h-4 mr-2" />
            Quick View
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Category */}
        <Badge variant="secondary" className="text-xs">
          {category}
        </Badge>

        {/* Title */}
        <h3 className="font-heading font-semibold text-lg line-clamp-2 group-hover:text-primary transition-colors">
          {title}
        </h3>

        {/* Location & Rating */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1 text-muted-foreground">
            <MapPin className="w-4 h-4" />
            <span>{location}</span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-orange-400 text-orange-400" />
            <span className="font-semibold">{rating}</span>
            <span className="text-muted-foreground">({reviewCount})</span>
          </div>
        </div>

        {/* Price & CTA */}
        <div className="flex items-center justify-between pt-3 border-t">
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-primary">₦{price.toLocaleString()}</span>
              <span className="text-sm text-muted-foreground">/{priceUnit}</span>
            </div>
          </div>
          <Button 
            size="sm" 
            className="btn-action opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            onClick={(e) => {
              e.stopPropagation();
              onClick?.();
            }}
          >
            Book Now
          </Button>
        </div>
      </div>
    </Card>
  );
}