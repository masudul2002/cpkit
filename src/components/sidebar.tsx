"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useLayoutStore } from "@/lib/store";
import { sidebarItems } from "@/constants/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Logo } from "@/components/branding/Logo";

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarCollapsed, toggleSidebar } = useLayoutStore();

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-20 flex flex-col border-r border-border/45 bg-card/45 backdrop-blur-md transition-all duration-300 ease-in-out",
        sidebarCollapsed ? "w-16" : "w-64"
      )}
    >
      {/* Sidebar Header / Branding */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-border/45">
        <Link
          href="/"
          className={cn(
            "flex items-center gap-2 font-semibold tracking-wider text-primary transition-all duration-300",
            sidebarCollapsed ? "mx-auto" : "opacity-100 w-auto"
          )}
        >
          <Logo showWordmark={!sidebarCollapsed} />
          {!sidebarCollapsed && (
            <span className="text-[10px] text-muted-foreground border border-muted-foreground/30 px-1 rounded uppercase tracking-widest">
              v1.6.0
            </span>
          )}
        </Link>
        <button
          onClick={toggleSidebar}
          className={cn(
            "p-1.5 rounded-lg border border-border/40 hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer",
            sidebarCollapsed && "mx-auto"
          )}
          aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {sidebarCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </button>
      </div>

      {/* Navigation Items */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {sidebarItems.map((item) => {
          const isActive = pathname === item.href || (item.children && pathname.startsWith(item.href));
          const Icon = item.icon;
          const hasChildren = item.children && item.children.length > 0;
          const isExpanded = !sidebarCollapsed && isActive;

          return (
            <div key={item.href} className="space-y-0.5">
              <Link
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 relative group cursor-pointer",
                  pathname === item.href
                    ? "bg-primary/10 text-primary border-l-2 border-primary"
                    : isActive
                    ? "bg-primary/5 text-primary/80"
                    : "text-foreground/70 hover:text-foreground hover:bg-accent/40"
                )}
              >
                <Icon
                  className={cn(
                    "h-4 w-4 transition-transform duration-200 group-hover:scale-110",
                    isActive ? "text-primary" : "text-muted-foreground"
                  )}
                />
                <span
                  className={cn(
                    "transition-all duration-300",
                    sidebarCollapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100 w-auto"
                  )}
                >
                  {item.title}
                </span>

                {/* Tooltip on collapsed state */}
                {sidebarCollapsed && (
                  <div className="absolute left-full ml-3 px-2 py-1 rounded bg-popover text-popover-foreground border border-border text-xs font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-md">
                    {item.title}
                  </div>
                )}
              </Link>

              {/* Sub-items list */}
              {hasChildren && isExpanded && (
                <div className="pl-4 space-y-0.5 border-l border-border/10 ml-5 mt-1 mb-2">
                  {item.children!.map((sub) => {
                    const isSubActive = pathname === sub.href;
                    const SubIcon = sub.icon;

                    return (
                      <Link
                        key={sub.href}
                        href={sub.href}
                        className={cn(
                          "flex items-center gap-2.5 px-3 py-1.5 rounded-md text-[11px] font-medium transition-all duration-150 cursor-pointer",
                          isSubActive
                            ? "bg-primary/5 text-primary"
                            : "text-muted-foreground hover:text-foreground hover:bg-accent/25"
                        )}
                      >
                        <SubIcon className="h-3 w-3 shrink-0" />
                        <span>{sub.title}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Sidebar Footer */}
      <div className="p-4 border-t border-border/45 flex items-center justify-center">
        {!sidebarCollapsed && (
          <span className="text-[11px] text-muted-foreground text-center tracking-tight">
            © 2026 CPKit open-source
          </span>
        )}
      </div>
    </aside>
  );
}
