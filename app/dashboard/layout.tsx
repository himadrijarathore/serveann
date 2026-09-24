"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useStore } from "@/lib/store";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const currentUser = useStore((state) => state.currentUser);
  const logout = useStore((state) => state.logout);
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!currentUser) {
      router.push("/login");
    }
  }, [currentUser, router]);

  if (!mounted || !currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  const getLinks = () => {
    switch (currentUser.role) {
      case "donor":
        return [
          { href: "/dashboard/donor", label: "Dashboard", icon: "📊" },
          { href: "/dashboard/donor/new", label: "New Donation", icon: "📸" },
          { href: "/dashboard/donor", label: "My Donations", icon: "📋" },
        ];
      case "shelter":
        return [
          { href: "/dashboard/shelter", label: "Dashboard", icon: "📊" },
          { href: "/dashboard/shelter", label: "Incoming", icon: "🚚" },
          { href: "/dashboard/shelter", label: "Capacity", icon: "🏠" },
        ];
      case "driver":
        return [
          { href: "/dashboard/driver", label: "Dashboard", icon: "📊" },
          { href: "/dashboard/driver", label: "Available Routes", icon: "🗺️" },
          { href: "/dashboard/driver", label: "My Deliveries", icon: "📦" },
        ];
      default:
        return [];
    }
  };

  const links = getLinks();
  const roleColor = currentUser.role === "donor" ? "primary" : currentUser.role === "shelter" ? "secondary" : "accent";

  return (
    <div className="min-h-screen bg-cream flex flex-col md:flex-row">
      {/* Sidebar - Desktop */}
      <aside className={`hidden md:flex flex-col w-64 bg-white border-r border-cream-dark shadow-sm z-10`}>
        <div className="p-6 border-b border-cream-dark">
          <Link href="/" className="inline-block">
            <div className={`text-2xl font-bold text-${roleColor} flex items-center gap-2`}>
              <span>🍲</span> ServeAnn
            </div>
          </Link>
        </div>
        
        <div className="p-4 flex-1">
          <div className="mb-6 px-2">
            <p className="text-xs text-charcoal-light uppercase font-bold tracking-wider mb-1">Signed in as</p>
            <p className="font-semibold text-charcoal truncate">{currentUser.name}</p>
            <p className={`text-xs text-${roleColor} font-medium`}>{currentUser.role}</p>
          </div>
          
          <nav className="space-y-1">
            {links.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link key={link.href} href={link.href}>
                  <div className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive ? `bg-${roleColor}-light/10 text-${roleColor} font-semibold` : 'text-charcoal-light hover:bg-cream hover:text-charcoal'}`}>
                    <span className="text-lg">{link.icon}</span>
                    <span>{link.label}</span>
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>
        
        <div className="p-4 border-t border-cream-dark">
          <button 
            onClick={() => { logout(); router.push("/"); }}
            className="flex items-center gap-3 px-4 py-3 w-full text-left rounded-lg text-charcoal-light hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            <span>🚪</span>
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Mobile Header & Bottom Nav */}
      <div className="md:hidden bg-white border-b border-cream-dark p-4 flex justify-between items-center sticky top-0 z-20">
        <Link href="/" className="inline-block">
          <div className={`text-xl font-bold text-${roleColor} flex items-center gap-2`}>
            <span>🍲</span> ServeAnn
          </div>
        </Link>
        <button onClick={() => { logout(); router.push("/"); }} className="text-sm font-medium text-charcoal-light">
          Sign Out
        </button>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-auto pb-20 md:pb-0 relative">
        <div className="p-6 md:p-8 max-w-6xl mx-auto">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-cream-dark flex justify-around p-2 z-20 pb-safe">
        {links.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link key={link.href} href={link.href} className="flex-1">
              <div className={`flex flex-col items-center py-2 ${isActive ? `text-${roleColor}` : 'text-charcoal-light'}`}>
                <span className="text-xl mb-1">{link.icon}</span>
                <span className="text-[10px] font-medium">{link.label}</span>
              </div>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
