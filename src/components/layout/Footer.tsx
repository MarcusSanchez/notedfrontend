"use client";

import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

const excludedRoutes = ["/", "/terms-of-service", "/privacy-policy"];

export default function Footer() {
  const pathname = usePathname();

  return excludedRoutes.includes(pathname) ? null : (
    <>
      <Separator className="absolute left-0 right-0 mt-16" />
      <footer className="flex items-center pt-32 pb-16 text-xs text-gray-500">
        <p>
          &copy; {new Date().getFullYear()} {" "}
          <Link
            href="/"
            className={cn(buttonVariants({ variant: "link" }), "text-xs p-0 text-muted-foreground hover:text-primary")}
          >
            Noted
          </Link> {" "}
          All rights reserved.
        </p>
      </footer>
    </>
  );
}
