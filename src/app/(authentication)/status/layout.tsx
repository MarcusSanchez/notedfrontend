"use client";

import { ReactNode } from "react";
import { useUserStore } from "@/lib/state";
import { useRouter } from "next/navigation";
import { SpinnerCard } from "@/components/utility/SpinnerCard";
import { Role } from "@/proto/user_pb";

export default function StatusLayout({ children }: { children: ReactNode }) {
  const { user } = useUserStore();
  const router = useRouter();

  if (!user.loggedIn) {
    router.replace("/login");
    return <SpinnerCard />;
  }
  if (user.loggedIn && user.role === Role.Admin) {
    router.replace("/dashboard");
    return <SpinnerCard />;
  }

  return children;
}
