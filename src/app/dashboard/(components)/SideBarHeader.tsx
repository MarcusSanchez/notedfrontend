"use client";

import { cn } from "@/lib/utils";
import React from "react";
import { Bitter } from "next/font/google";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import Link from "next/link";

const bitter = Bitter({
  subsets: ['latin'],
  display: 'swap',
});

export function SideBarHeader({ isCollapsed }: { isCollapsed: boolean }) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 [&>span]:line-clamp-1 [&>span]:flex [&>span]:w-full [&>span]:items-center [&>span]:gap-1 [&>span]:truncate [&_svg]:h-4 [&_svg]:w-4 [&_svg]:shrink-0",
        isCollapsed &&
        "flex h-9 w-9 shrink-0 items-center justify-center p-0 [&>span]:w-auto [&>svg]:hidden"
      )}
      aria-label="Select account"
    >
      <div className="flex items-center gap-1">
        <Link href="/">
          {isCollapsed && (
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <Button variant="outline" className={`flex items-center justify-center w-10 h-10 text-2xl rounded-xl ${bitter.className}`}>
                  <span>N</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right" className={`flex items-center gap-4 ${bitter.className}`}>
                Noted
              </TooltipContent>
            </Tooltip>
          )}
          {!isCollapsed && (
            <Button variant="ghost" className={`font-bold italic text-2xl ${bitter.className}`}>
              Noted
            </Button>
          )}
        </Link>
      </div>
    </div>
  )
}
