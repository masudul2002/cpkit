"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, CheckCircle, AlertTriangle, XCircle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

export type ToastVariant = "default" | "success" | "warning" | "error" | "info";

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  variant?: ToastVariant;
}

interface ToastContextProps {
  toast: (options: {
    title: string;
    description?: string;
    variant?: ToastVariant;
    duration?: number;
  }) => void;
}

const ToastContext = React.createContext<ToastContextProps | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastMessage[]>([]);

  const toast = React.useCallback(
    ({
      title,
      description,
      variant = "default",
      duration = 4000,
    }: {
      title: string;
      description?: string;
      variant?: ToastVariant;
      duration?: number;
    }) => {
      const id = Math.random().toString(36).substring(2, 9);
      setToasts((prev) => [...prev, { id, title, description, variant }]);

      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
    },
    []
  );

  const removeToast = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      {/* Toast Container Overlay */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 w-full max-w-sm pointer-events-none">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className={cn(
                "flex items-start gap-3 p-4 rounded-xl border bg-card text-foreground shadow-lg pointer-events-auto relative overflow-hidden group",
                {
                  "border-border/60": t.variant === "default",
                  "border-emerald-500/20 bg-emerald-500/5": t.variant === "success",
                  "border-amber-500/20 bg-amber-500/5": t.variant === "warning",
                  "border-rose-500/20 bg-rose-500/5": t.variant === "error",
                  "border-blue-500/20 bg-blue-500/5": t.variant === "info",
                }
              )}
            >
              {/* Icon */}
              <div className="shrink-0 mt-0.5">
                {t.variant === "success" && (
                  <CheckCircle className="h-4.5 w-4.5 text-emerald-500" />
                )}
                {t.variant === "warning" && (
                  <AlertTriangle className="h-4.5 w-4.5 text-amber-500" />
                )}
                {t.variant === "error" && (
                  <XCircle className="h-4.5 w-4.5 text-rose-500" />
                )}
                {t.variant === "info" && (
                  <Info className="h-4.5 w-4.5 text-blue-500" />
                )}
                {t.variant === "default" && (
                  <Info className="h-4.5 w-4.5 text-muted-foreground" />
                )}
              </div>

              {/* Text */}
              <div className="space-y-1 pr-6 flex-1">
                <h5 className="text-xs font-bold leading-none">{t.title}</h5>
                {t.description && (
                  <p className="text-[11px] text-muted-foreground leading-normal">
                    {t.description}
                  </p>
                )}
              </div>

              {/* Close button */}
              <button
                onClick={() => removeToast(t.id)}
                className="absolute right-2 top-2 p-1 rounded-md opacity-0 group-hover:opacity-80 hover:opacity-100 transition-opacity hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
