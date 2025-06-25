"use client";

import React, { ReactNode } from "react";
import DotPattern from "@/components/ui/dot-pattern";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

export function DashboardContainer({ children }: { children: ReactNode }) {
  const { theme } = useTheme();

  return (
    <div className="relative min-h-[90vh]">
      <DotPattern className={cn("absolute w-[110%]", theme === "dark" && "opacity-40")} />
      <div className="relative z-10 p-2 py-6 sm:p-6">
        {children}
      </div>
    </div>
  );
}
