import * as React from "react";
import { cn } from "@/lib/utils";
import { orderStatusConfig, type OrderStatus } from "@/lib/dummy-data";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "outline" | "amber" | "green" | "red" | "blue" | "gray";
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = "default", ...props }, ref) => {
    const variants = {
      default:
        "bg-[hsl(224,12%,12%)] text-white",
      outline:
        "border border-[hsl(220,13%,91%)] text-[hsl(224,12%,12%)] bg-white",
      amber:
        "bg-[hsl(38,92%,50%)/0.12] text-[hsl(38,60%,30%)] border border-[hsl(38,92%,50%)/0.3]",
      green:
        "bg-[hsl(142,70%,45%)/0.1] text-[hsl(142,60%,28%)] border border-[hsl(142,70%,45%)/0.25]",
      red:
        "bg-[hsl(0,84%,60%)/0.1] text-[hsl(0,60%,35%)] border border-[hsl(0,84%,60%)/0.25]",
      blue:
        "bg-[hsl(210,100%,50%)/0.1] text-[hsl(210,100%,35%)] border border-[hsl(210,100%,50%)/0.25]",
      gray:
        "bg-[hsl(220,14%,96%)] text-[hsl(220,10%,46%)] border border-[hsl(220,13%,91%)]",
    };

    return (
      <span
        ref={ref}
        className={cn(
          "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
          variants[variant],
          className
        )}
        {...props}
      />
    );
  }
);
Badge.displayName = "Badge";

// OrderStatusBadge — Badge khusus status pesanan
interface OrderStatusBadgeProps {
  status: OrderStatus;
  className?: string;
}

const statusVariantMap: Record<OrderStatus, BadgeProps["variant"]> = {
  draft: "gray",
  pending: "amber",
  confirmed: "blue",
  in_progress: "blue",
  ready: "green",
  completed: "green",
  cancelled: "gray",
};

const OrderStatusBadge = ({ status, className }: OrderStatusBadgeProps) => {
  const config = orderStatusConfig[status];
  const variant = statusVariantMap[status] ?? "gray";
  return (
    <Badge variant={variant} className={className}>
      {config.label}
    </Badge>
  );
};

// StockBadge — Badge indikator stok
interface StockBadgeProps {
  stock: number;
  lowStockThreshold?: number;
  className?: string;
}

const StockBadge = ({ stock, lowStockThreshold = 5, className }: StockBadgeProps) => {
  if (stock === 0) {
    return (
      <Badge variant="red" className={className}>
        Stok Habis
      </Badge>
    );
  }
  if (stock <= lowStockThreshold) {
    return (
      <Badge variant="amber" className={className}>
        Stok Menipis
      </Badge>
    );
  }
  return (
    <Badge variant="green" className={className}>
      Tersedia
    </Badge>
  );
};

export { Badge, OrderStatusBadge, StockBadge };
