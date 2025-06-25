"use client";

import { Button } from "@/components/ui/button"
import { AuthCard } from "@/app/(authentication)/(components)/AuthCard";
import { useUserStore } from "@/lib/state";

export default function StatusPending() {
  const { signOut } = useUserStore();

  return (
    <AuthCard
      title="Pending approval"
      description="Your account is pending approval from an administrator. Please contact you company's administrator for more information."
      footer={
        <Button className="w-full font-bold" onClick={() => signOut()}>
          Logout
        </Button>
      }
    />
  );
}
