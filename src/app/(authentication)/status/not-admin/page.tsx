"use client";

import { Button } from "@/components/ui/button"
import { AuthCard } from "@/app/(authentication)/(components)/AuthCard";
import { useUserStore } from "@/lib/state";

export default function StatusRejected() {
  const { signOut } = useUserStore();

  return (
    <AuthCard
      title="Not an administrator"
      description="You must be an administrator of your company to access this application."
      footer={
        <Button className="w-full font-bold" onClick={() => signOut()}>
          Logout
        </Button>
      }
    />
  );
}
