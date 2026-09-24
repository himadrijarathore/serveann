"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";

export default function DashboardIndex() {
  const currentUser = useStore((state) => state.currentUser);
  const router = useRouter();

  useEffect(() => {
    if (!currentUser) return;
    
    switch (currentUser.role) {
      case "donor":
        router.replace("/dashboard/donor");
        break;
      case "shelter":
        router.replace("/dashboard/shelter");
        break;
      case "driver":
        router.replace("/dashboard/driver");
        break;
      default:
        router.replace("/");
    }
  }, [currentUser, router]);

  return (
    <div className="flex items-center justify-center h-[60vh]">
      <div className="flex flex-col items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mb-4"></div>
        <p className="text-charcoal-light">Loading your dashboard...</p>
      </div>
    </div>
  );
}
