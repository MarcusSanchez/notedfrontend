"use client";

import { ReactNode, useEffect } from "react";
import { useUserStore } from "@/lib/state";
import { useRouter } from "next/navigation";
import { Role, Status } from "@/proto/user_pb";
import { DashboardNavigator } from "@/app/dashboard/(components)/Sidebar";
import { SpinnerCard } from "@/components/utility/SpinnerCard";
import Footer from "@/app/(components)/Footer";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { user } = useUserStore();
  const router = useRouter();

  useEffect(() => {
    if (!user.loggedIn) router.replace("/login");
    else if (!user.mfaVerified) router.replace("/mfa");
    else if (user.status === Status.Pending) router.replace("/status/pending");
    else if (user.status === Status.Rejected) router.replace("/status/rejected");
    else if (user.role === Role.Nurse) router.replace("/status/not-admin");
  }, [user.loggedIn, user.status, user.role]);

  if (!(user.loggedIn && user.role === Role.Admin)) return <SpinnerCard />;
  return (
    <DashboardNavigator>
      {children}
    </DashboardNavigator>
  );
}

