import { cn } from "@/lib/utils";

type Status = 
  | "active" 
  | "pending" 
  | "completed" 
  | "cancelled"
  | "available"
  | "rented"
  | "maintenance";

interface StatusBadgeProps {
  status: Status;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const getStatusConfig = (status: Status) => {
    switch (status) {
      case "active":
      case "available":
        return {
          label: status.charAt(0).toUpperCase() + status.slice(1),
          className: "bg-green-100 text-green-700",
        };
      case "pending":
      case "rented":
        return {
          label: status.charAt(0).toUpperCase() + status.slice(1),
          className: "bg-yellow-100 text-yellow-700",
        };
      case "maintenance":
        return {
          label: "In Maintenance",
          className: "bg-orange-100 text-orange-700",
        };
      case "cancelled":
        return {
          label: "Cancelled",
          className: "bg-red-100 text-red-700",
        };
      case "completed":
        return {
          label: "Completed",
          className: "bg-blue-100 text-blue-700",
        };
      default:
        return {
          label: status,
          className: "bg-gray-100 text-gray-700",
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  );
}