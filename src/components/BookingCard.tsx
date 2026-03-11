import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/StatusBadge";
import { Calendar, Clock, MapPin, User } from "lucide-react";
import { format } from "date-fns";

type BookingStatus = "active" | "pending" | "completed" | "cancelled";

interface BookingCardProps {
  bookingId: string;
  equipmentName: string;
  equipmentImage: string;
  startDate: Date;
  endDate: Date;
  totalPrice: number;
  status: BookingStatus;
  vendorName?: string;
  renterName?: string;
  location: string;
  userRole: "vendor" | "renter";
  onViewDetails?: () => void;
  onAccept?: () => void;
  onReject?: () => void;
  onCancel?: () => void;
  className?: string;
}

export function BookingCard({
  bookingId,
  equipmentName,
  equipmentImage,
  startDate,
  endDate,
  totalPrice,
  status,
  vendorName,
  renterName,
  location,
  userRole,
  onViewDetails,
  onAccept,
  onReject,
  onCancel,
  className,
}: BookingCardProps) {
  return (
    <Card className={className}>
      <div className="p-4 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex gap-3 flex-1">
            <img
              src={equipmentImage}
              alt={equipmentName}
              className="w-20 h-20 rounded-lg object-cover"
            />
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-base line-clamp-1">
                {equipmentName}
              </h3>
              <p className="text-sm text-muted-foreground">
                ID: {bookingId}
              </p>
              <div className="mt-1">
                <StatusBadge status={status} />
              </div>
            </div>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span>{format(startDate, "MMM dd, yyyy")}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>{format(endDate, "MMM dd, yyyy")}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="w-4 h-4" />
            <span className="line-clamp-1">{location}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <User className="w-4 h-4" />
            <span className="line-clamp-1">
              {userRole === "vendor" ? renterName : vendorName}
            </span>
          </div>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between pt-3 border-t">
          <div>
            <p className="text-xs text-muted-foreground">Total Amount</p>
            <p className="text-xl font-bold text-primary">
              ₦{totalPrice.toLocaleString()}
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            {status === "pending" && userRole === "vendor" && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onReject}
                >
                  Reject
                </Button>
                <Button
                  size="sm"
                  className="btn-action"
                  onClick={onAccept}
                >
                  Accept
                </Button>
              </>
            )}
            {status === "pending" && userRole === "renter" && (
              <Button
                variant="outline"
                size="sm"
                onClick={onCancel}
              >
                Cancel
              </Button>
            )}
            {status === "active" && (
              <Button
                variant="outline"
                size="sm"
                onClick={onViewDetails}
              >
                View Details
              </Button>
            )}
            {(status === "completed" || status === "cancelled") && (
              <Button
                variant="outline"
                size="sm"
                onClick={onViewDetails}
              >
                View Details
              </Button>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}