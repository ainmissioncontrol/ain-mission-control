/**
 * Mobile-responsive sidebar with hamburger menu for mobile
 * and fixed sidebar for desktop
 */

"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SidebarNavItem {
  name: string;
  href: string;
  icon: React.ReactNode;
  current?: boolean;
  badge?: string;
}

interface DashboardSidebarMobileProps {
  navItems: SidebarNavItem[];
  onNavigate?: (href: string) => void;
}

/**
 * Mobile-first responsive sidebar
 * - Mobile (< 768px): Hamburger menu → drawer
 * - Tablet+ (768px+): Fixed sidebar
 */
export function DashboardSidebarMobile({
  navItems,
  onNavigate,
}: DashboardSidebarMobileProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Hamburger Button */}
      <div className="fixed top-4 left-4 z-50 md:hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "p-2 rounded-lg border transition-all",
            isOpen
              ? "border-slate-200 bg-white"
              : "border-slate-200 bg-white hover:bg-slate-50"
          )}
          aria-label="Toggle navigation"
        >
          {isOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Navigation (Mobile Drawer + Desktop Fixed) */}
      <div
        className={cn(
          // Mobile drawer
          "fixed left-0 top-0 h-screen w-64 z-40 bg-white border-r border-slate-200 transition-transform duration-200 md:translate-x-0",
          // Desktop fixed sidebar
          "md:static md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        <nav className="h-full overflow-y-auto pt-20 md:pt-4">
          <div className="space-y-1 px-4 pb-4">
            {navItems.map((item) => (
              <button
                key={item.href}
                onClick={() => {
                  onNavigate?.(item.href);
                  setIsOpen(false); // Close drawer after navigation
                }}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                  "min-h-[44px]", // Touch-friendly height
                  item.current
                    ? "bg-slate-900 text-white"
                    : "text-slate-700 hover:bg-slate-100 active:bg-slate-200"
                )}
              >
                <span className="w-5 h-5 flex-shrink-0">{item.icon}</span>
                <span className="flex-1 text-left">{item.name}</span>
                {item.badge && (
                  <span className="text-xs font-semibold bg-slate-200 text-slate-700 px-2 py-0.5 rounded">
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        </nav>
      </div>

      {/* Desktop Sidebar Adjustment (push content) */}
      <style jsx>{`
        @media (min-width: 768px) {
          :root {
            --sidebar-width: 16rem;
          }
        }
      `}</style>
    </>
  );
}

/**
 * Layout wrapper that adjusts content margin for desktop sidebar
 */
export function DashboardLayoutMobile({
  sidebar,
  children,
}: {
  sidebar: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50">
      {sidebar}
      <main className="md:ml-64 p-4 md:p-6">{children}</main>
    </div>
  );
}
