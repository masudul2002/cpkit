"use client";

import { useLayoutStore } from "@/lib/store";
import { Sidebar } from "@/components/sidebar";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { CommandPalette } from "@/components/command-palette";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { sidebarCollapsed, setSidebarCollapsed } = useLayoutStore();
  const isLandingPage = pathname === "/";

  // Responsive: collapse sidebar automatically on smaller screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setSidebarCollapsed(true);
      } else {
        setSidebarCollapsed(false);
      }
    };

    handleResize(); // run on mount
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [setSidebarCollapsed]);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-200">
      {/* Collapsible Left Sidebar */}
      {!isLandingPage && <Sidebar />}

      {/* Main Content Area */}
      <div
        className={cn(
          "flex-1 flex flex-col transition-all duration-300 ease-in-out",
          isLandingPage ? "pl-0" : (sidebarCollapsed ? "pl-16" : "pl-64")
        )}
      >
        {/* Top Navbar */}
        <Navbar />

        {/* Workspace Container */}
        <main className="flex-1 flex flex-col p-4 md:p-6 lg:p-8 max-w-(--breakpoint-2xl) w-full mx-auto">
          {children}
        </main>

        {/* Footer */}
        <Footer />
      </div>

      {/* Command Palette Overlay */}
      <CommandPalette />
    </div>
  );
}
