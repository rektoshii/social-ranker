"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const currentUser = getCurrentUser();

    if (!currentUser && pathname !== "/login") {
      router.push("/login");
    } else if (currentUser && pathname === "/login") {
      router.push("/");
    }

    setIsChecking(false);
  }, [pathname, router]);

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return <>{children}</>;
}