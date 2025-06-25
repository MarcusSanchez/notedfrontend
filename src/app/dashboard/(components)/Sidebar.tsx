"use client";

import { TooltipProvider } from "@/components/ui/tooltip";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { cn } from "@/lib/utils";
import React, { ReactNode, useState } from "react";
import { Separator } from "@/components/ui/separator";
import { Nav, NavProps } from "@/app/dashboard/(components)/Nav";
import { Bed, ClipboardPen, Home, Settings, Stethoscope } from "lucide-react";
import { usePathname } from "next/navigation";
import { SideBarHeader } from "@/app/dashboard/(components)/SideBarHeader";
import { useBreakpoints } from "@/hooks/use-breakpoints";
import ShineBorder from "@/components/ui/shine-border";
import { useUserStore } from "@/lib/state";

export function DashboardNavigator({ children }: { children: ReactNode }) {
  const { user } = useUserStore();
  const [isCollapsed, setIsCollapsed] = useState(false)
  const pathname = usePathname();
  const { isLG } = useBreakpoints();

  const isSelected = (href: string): "default" | "ghost" => pathname.includes(href) ? "default" : "ghost";

  const links: NavProps["links"] = [
    {
      title: "Home",
      icon: Home,
      variant: pathname === "/dashboard" ? "default" : "ghost",
      href: "/dashboard",
    },
  ];

  if (user.isLicensed) links.push(
    {
      title: "Notes",
      icon: ClipboardPen,
      variant: isSelected("/dashboard/notes"),
      href: "/dashboard/notes",
    },
    {
      title: "Nurses",
      icon: Stethoscope,
      variant: isSelected("/dashboard/nurses"),
      href: "/dashboard/nurses",
    },
    {
      title: "Patients",
      icon: Bed,
      variant: isSelected("/dashboard/patients"),
      href: "/dashboard/patients",
    },
  );

  links.push(
    {
      title: "Settings",
      icon: Settings,
      variant: isSelected("/dashboard/settings"),
      href: "/dashboard/settings",
    },
  );

  return (
    <section className="block">
      <ShineBorder color={["silver"]} className="p-[-1rem] w-full">
        <div className="overflow-hidden rounded-lg border border-muted-foreground bg-background shadow w-full h-full">
          <TooltipProvider delayDuration={0}>
            <ResizablePanelGroup
              direction="horizontal"
              className="items-stretch min-h-[88vh]"
            >
              <ResizablePanel
                collapsible={true}
                minSize={isLG ? 12 : 0}
                maxSize={isLG ? 16 : 0}
                defaultSize={14}
                onCollapse={() => setIsCollapsed(true)}
                onResize={() => setIsCollapsed(false)}
                className={cn(isCollapsed && "min-w-[50px] transition-all duration-300 ease-in-out")}
              >
                <div className={cn("flex h-[52px] items-center justify-center", isCollapsed ? "h-[52px]" : "px-2")}>
                  <SideBarHeader isCollapsed={isCollapsed} />
                </div>
                <Separator />
                <Nav
                  isCollapsed={isCollapsed}
                  links={links}
                />
              </ResizablePanel>
              <ResizableHandle disabled={!isLG} withHandle={isLG} className="bg-muted-foreground" />
              <ResizablePanel>
                <div className="p-2 py-4 xs:p-4">
                  {children}
                </div>
              </ResizablePanel>
            </ResizablePanelGroup>
          </TooltipProvider>
        </div>
      </ShineBorder>
    </section>
  );
}
