import * as React from "react";
import { cn } from "@/lib/utils";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  glass?: boolean;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, glass = false, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-xl border border-border/45 bg-card text-card-foreground shadow-xs transition-all duration-200",
          glass && "glass-panel bg-card/40 backdrop-blur-md",
          className
        )}
        {...props}
      />
    );
  }
);
Card.displayName = "Card";

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-lg font-bold leading-none tracking-tight text-foreground",
      className
    )}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-xs text-muted-foreground leading-relaxed", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
));
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0 border-t border-border/10 mt-6", className)}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

/* Stat Card Helper Component */
export interface StatCardProps extends CardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  trend?: {
    value: string;
    positive?: boolean;
  };
}

const StatCard = React.forwardRef<HTMLDivElement, StatCardProps>(
  ({ title, value, description, icon, trend, className, ...props }, ref) => {
    return (
      <Card ref={ref} className={cn("p-6 space-y-4", className)} {...props}>
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            {title}
          </span>
          {icon && <div className="text-muted-foreground">{icon}</div>}
        </div>
        <div className="space-y-1">
          <div className="text-2xl font-extrabold tracking-tight">{value}</div>
          {(description || trend) && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              {trend && (
                <span
                  className={cn(
                    "font-medium",
                    trend.positive ? "text-emerald-500" : "text-rose-500"
                  )}
                >
                  {trend.value}
                </span>
              )}
              {description && <span>{description}</span>}
            </div>
          )}
        </div>
      </Card>
    );
  }
);
StatCard.displayName = "StatCard";

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, StatCard };
