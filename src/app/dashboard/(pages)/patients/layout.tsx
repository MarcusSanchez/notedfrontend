"use client";

import { ReactNode, useEffect } from "react";
import { useUserStore } from "@/lib/state";
import { useRouter } from "next/navigation";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { user } = useUserStore();
  const router = useRouter();

  useEffect(() => {
    if (!user.isLicensed) router.replace("/dashboard");
  }, [user.isLicensed]);

  return children;
}

