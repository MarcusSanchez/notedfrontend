"use client";

import { Button } from "@/components/ui/button"
import { AuthCard } from "@/app/(authentication)/(components)/AuthCard";
import { useUserStore } from "@/lib/state";

export default function StatusRejected() {
  const { signOut } = useUserStore();

  return (
    <AuthCard
      title="Account rejected"
      description="Your account has been rejected by an administrator. Please contact your company's administrator if you believe this was a mistake."
      footer={
        <Button className="w-full font-bold" onClick={() => signOut()}>
          Logout
        </Button>
      }
    />
  );
}
