import * as React from "react";
import { cn } from "@/lib/utils";

/* PageContainer: Standard wrapper for views */
export interface PageContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "default" | "narrow" | "wide" | "full";
}

export function PageContainer({
  className,
  size = "default",
  ...props
}: PageContainerProps) {
  return (
    <div
      className={cn(
        "w-full mx-auto space-y-8 animate-fade-in",
        {
          "max-w-5xl": size === "narrow",
          "max-w-7xl": size === "default",
          "max-w-8xl": size === "wide",
          "max-w-none": size === "full",
        },
        className
      )}
      {...props}
    />
  );
}

/* PageHeader: Title, description, action area */
export interface PageHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}

export function PageHeader({
  title,
  description,
  actions,
  className,
  children,
  ...props
}: PageHeaderProps & { children?: React.ReactNode }) {
  return (
    <div
      className={cn(
        "flex flex-col md:flex-row md:items-start md:justify-between gap-4 pb-6 border-b border-border/40 w-full",
        className
      )}
      {...props}
    >
      <div className="space-y-1">
        <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-foreground">
          {title}
        </h2>
        {description && (
          <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">
            {description}
          </p>
        )}
      </div>
      {actions && (
        <div className="flex items-center gap-2 shrink-0">
          {actions}
        </div>
      )}
      {children}
    </div>
  );
}

/* SectionContainer: Section wrappers with title spacing */
export interface SectionContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
}

export function SectionContainer({
  title,
  description,
  className,
  children,
  ...props
}: SectionContainerProps) {
  return (
    <section className={cn("space-y-4", className)} {...props}>
      {(title || description) && (
        <div className="space-y-1">
          {title && <h3 className="text-lg font-bold text-foreground">{title}</h3>}
          {description && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
        </div>
      )}
      <div>{children}</div>
    </section>
  );
}

/* ToolContainer: Multi-panel workspaces for side-by-side layouts */
export function ToolContainer({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 lg:grid-cols-12 gap-6 items-start",
        className
      )}
      {...props}
    />
  );
}

/* ToolPanel: Column panel inside a workspace */
export interface ToolPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  span?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
}

export function ToolPanel({
  className,
  span = 6,
  ...props
}: ToolPanelProps) {
  return (
    <div
      className={cn(
        {
          "lg:col-span-1": span === 1,
          "lg:col-span-2": span === 2,
          "lg:col-span-3": span === 3,
          "lg:col-span-4": span === 4,
          "lg:col-span-5": span === 5,
          "lg:col-span-6": span === 6,
          "lg:col-span-7": span === 7,
          "lg:col-span-8": span === 8,
          "lg:col-span-9": span === 9,
          "lg:col-span-10": span === 10,
          "lg:col-span-11": span === 11,
          "lg:col-span-12": span === 12,
        },
        className
      )}
      {...props}
    />
  );
}
