"use client";

import Link from "next/link";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { Bitter } from "next/font/google";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { match } from "ts-pattern";
import { useUserStore } from "@/lib/state";
import { Role } from "@/proto/user_pb";
import { ArrowLeft, ArrowRight, LucideIcon, RotateCw } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

const bitter = Bitter({
  subsets: ['latin'],
  display: 'swap',
});

const excludedRoutes = ["/", "/terms-of-service", "/privacy-policy", "/request-account-deletion"];

export default function Navbar({ hasSession }: { hasSession: boolean }) {
  const { user } = useUserStore();
  const qc = useQueryClient();

  const { back, forward, canGoBack, canGoForward } = useDashboardRouter();
  const pathname = usePathname();

  const [canRefresh, setCanRefresh] = useState(false);

  const links = match({ loggedIn: user.loggedIn })
    .with({ loggedIn: false }, () => [
      { href: "/register", label: "Register", selected: pathname == "/register" },
      { href: "/login", label: "Login", selected: pathname === "/login" },
    ])
    .otherwise(() => []);

  const refresh = () => {
    setCanRefresh(true);
    setTimeout(() => setCanRefresh(false), 2500);
    qc.invalidateQueries();
  };

  return excludedRoutes.includes(pathname) ? null : (
    <header
      className={`sticky top-0 z-50 w-full border-border/40 bg-background/95 backdrop-blur
        supports-[backdrop-filter]:bg-background/60 ${bitter.className}`}
    >
      <div className="flex h-14 items-center">
        <div className="mr-6 flex items-center space-x-2">
          {user.role !== Role.Admin
            ? (
              <Link href="/" className="mr-4">
                <span className="text-lg font-bold">Noted</span>
              </Link>
            )
            : (
              <TooltipProvider delayDuration={0}>
                <div className="flex gap-2">
                  <NavButton name="Back" Icon={ArrowLeft} onClick={back} disabled={!canGoBack} />
                  <NavButton name="Forward" Icon={ArrowRight} onClick={forward} disabled={!canGoForward} />
                  {pathname == "/dashboard" &&
                    <NavButton name="Refresh" Icon={RotateCw} onClick={refresh} disabled={canRefresh} />
                  }
                </div>
              </TooltipProvider>
            )
          }
          {
            !hasSession && (
              <nav className="flex items-center gap-6 text-sm">
                {links.map(({ href, label, selected }) => (
                  <Link key={`${href}${label}`} href={href}>
                    <Button variant="link" className={cn(
                      selected && " text-foreground/80",
                      !selected && "text-foreground/60 hover:text-foreground/80 ",
                      "transition-colors px-0"
                    )
                    }>
                      {label}
                    </Button>
                  </Link>
                ))}
              </nav>
            )
          }
        </div>
        <div className="flex items-center justify-end w-full">
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}

type NavButtonProps = {
  name: string;
  Icon: LucideIcon;
  onClick: () => void;
  disabled?: boolean;
};

const NavButton = ({ name, Icon, onClick, disabled }: NavButtonProps) => (
  <Tooltip delayDuration={700}>
    <TooltipTrigger asChild>
      <Button
        size="icon"
        variant="outline"
        className="flex font-bold items-center p-1 hover:cursor-pointer"
        onClick={onClick}
        disabled={disabled}
      >
        <Icon className="h-[1.2rem] w-[1.2rem]" />
      </Button>
    </TooltipTrigger>
    <TooltipContent side="bottom" className="flex items-center gap-4">
      {name}
    </TooltipContent>
  </Tooltip>
);

// custom useRouter for managing internal app forwards and backs:
// - only pushes/replaces state if the pathname is for this app and starts with "/dashboard"
export function useDashboardRouter() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [history, setHistory] = useState<string[]>([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const search = searchParams.toString();
    const url = search ? `${pathname}?${search}` : pathname;

    // If there's no history, just add the first entry
    if (history.length === 0 && pathname.startsWith("/dashboard")) {
      setHistory([url]);
      setIndex(0);
      return;
    }

    // If the path changed, push a new entry
    const lastUrl = history[index];
    const [lastPath] = lastUrl ? lastUrl.split("?") : [null];

    if (pathname !== lastPath) {
      if (pathname.startsWith("/dashboard")) {
        const newHistory = history.slice(0, index + 1);
        setHistory([...newHistory, url]);
        setIndex(newHistory.length);
      } else {
        setHistory([]);
        setIndex(0);
      }
      return;
    }

    // If only search params changed, replace the last entry
    if (url !== lastUrl) {
      const newHistory = [...history];
      newHistory[index] = url;
      setHistory(newHistory);
    }
  }, [pathname, searchParams]);

  const canGoBack = index > 0;
  const canGoForward = index < history.length - 1;

  const back = () => {
    if (!canGoBack) return;
    router.push(history[index - 1]);
    setIndex(i => i - 1);
  };

  const forward = () => {
    if (!canGoForward) return;
    router.push(history[index + 1]);
    setIndex(i => i + 1);
  };

  const reset = () => {
    setHistory([]);
    setIndex(0);
  };

  return { canGoBack, canGoForward, back, forward, reset };
}
