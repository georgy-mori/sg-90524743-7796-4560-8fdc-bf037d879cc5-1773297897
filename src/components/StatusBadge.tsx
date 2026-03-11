import { cn } from "@/lib/utils";

type Status = 
  | "active" 
  | "pending" 
  | "completed" 
  | "cancelled" 
  | "disputed" 
  | "approved" 
  | "rejected"
  | "verified"
  | "unverified";

interface StatusBadgeProps {
  status: Status;
  className?: string;
}

const statusConfig: Record<Status, { label: string; className: string }> = {
  active: {
    label: "Active",
    className: "badge-success",
  },
  pending: {
    label: "Pending",
    className: "badge-warning",
  },
  completed: {
    label: "Completed",
    className: "badge-info",
  },
  cancelled: {
    label: "Cancelled",
    className: "badge-error",
  },
  disputed: {
    label: "Disputed",
    className: "badge-error",
  },
  approved: {
    label: "Approved",
    className: "badge-success",
  },
  rejected: {
    label: "Rejected",
    className: "badge-error",
  },
  verified: {
    label: "Verified",
    className: "badge-success",
  },
  unverified: {
    label: "Unverified",
    className: "badge-warning",
  },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <span
      className={cn(
        "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border",
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  );
}