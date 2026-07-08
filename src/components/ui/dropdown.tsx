"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";

export interface DropdownProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  align?: "left" | "right";
  className?: string;
}

export function Dropdown({
  trigger,
  children,
  align = "right",
  className,
}: DropdownProps) {
  const [open, setOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  React.useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleOutsideClick);
    }
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [open]);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Trigger */}
      <div onClick={() => setOpen(!open)} className="cursor-pointer">
        {trigger}
      </div>

      {/* Menu Overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -4 }}
            transition={{ duration: 0.12, ease: "easeOut" }}
            className={cn(
              "absolute mt-2 min-w-[160px] rounded-lg border border-border/50 bg-card p-1.5 shadow-lg z-50 focus:outline-hidden",
              {
                "left-0 origin-top-left": align === "left",
                "right-0 origin-top-right": align === "right",
              },
              className
            )}
            onClick={() => setOpen(false)}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* Dropdown Menu Item */
export interface DropdownItemProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
}

export function DropdownItem({
  className,
  active = false,
  children,
  ...props
}: DropdownItemProps) {
  return (
    <button
      type="button"
      className={cn(
        "w-full flex items-center px-2.5 py-1.5 text-xs rounded-md transition-colors text-left cursor-pointer",
        active
          ? "bg-primary text-primary-foreground font-semibold"
          : "text-foreground hover:bg-accent hover:text-accent-foreground",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
