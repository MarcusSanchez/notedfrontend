"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bed, ClipboardPen, LucideIcon, Shield, Stethoscope } from "lucide-react";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { fn } from "@/lib/utils";
import { getCompanyStats } from "@/app/dashboard/actions";
import { Skeleton } from "@/components/ui/skeleton";
import { GetCompanyStatsResponse } from "@/proto/company_pb";
import { Button } from "@/components/ui/button";
import React from "react";
import { Separator } from "@/components/ui/separator";
import { useNeedsToRefresh } from "@/lib/state";

export function DashStats() {
  const { needsToRefresh } = useNeedsToRefresh();

  const statsQ = useQuery({
    queryKey: ["listCompanyStats"],
    queryFn: fn(() => getCompanyStats()),
    enabled: !needsToRefresh,
  });
  const stats = statsQ.data;

  if (statsQ.isPending || statsQ.isFetching) return <DashStatsSkeleton />;
  if (statsQ.isError) return <DashStatsError query={statsQ} />;
  if (!stats) return <DashStatsSkeleton />;

  return (
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard title="Total Notes" value={stats.totalNotes} thisMonth={stats.totalNotesThisMonth} Icon={ClipboardPen} />
      <StatCard title="Total Patients" value={stats.totalPatients} thisMonth={stats.totalPatientsThisMonth} Icon={Bed} />
      <StatCard title="Total Active Nurses" value={stats.totalNurses} thisMonth={stats.totalNursesThisMonth} Icon={Stethoscope} />
      <StatCard title="Total Admins" value={stats.totalAdmins} thisMonth={stats.totalAdminsThisMonth} Icon={Shield} />
    </div>
  );
}

type StatCardProps = {
  title: string;
  value: number;
  thisMonth: number;
  Icon: LucideIcon;
};

export function StatCard({ title, value, thisMonth, Icon }: StatCardProps) {
  return (
    <Card className="flex flex-col p-6 space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm font-bold">{title}</span>
        <Icon className="h-[1.2rem] w-[1.2rem] text-muted-foreground" />
      </div>
      <Separator />

      <div className="flex flex-col">
        <span className="text-2xl font-bold">{value}</span>
        <span className="text-xs text-muted-foreground">+{thisMonth} this month</span>
      </div>
    </Card>
  );
}

type DashStatsErrorProps = {
  query: UseQueryResult<GetCompanyStatsResponse, Error>;
};

function DashStatsError({ query }: DashStatsErrorProps) {
  return (
    <Card className="flex flex-col space-y-2 mt-6 lg:mx-5">
      <CardHeader>
        <CardTitle className="text-2xl">Error Getting Your Company&#39;s Stats</CardTitle>
        <CardDescription>Failed to get your company&#39;s stats. Please check your connection and try again.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button onClick={() => query.refetch()} className="w-full">Retry</Button>
      </CardContent>
    </Card>
  );
}

const DashStatsSkeleton = () => (
  <div className="grid gap-6 mt-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
    {Array.from({ length: 4 }).map((_, i) => (
      <Card key={i} className="flex flex-col p-6 space-y-2">
        <div className="flex justify-between items-center">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-[1.2rem] w-[1.2rem] rounded-3xl" />
        </div>
        <Separator />

        <div className="flex flex-col gap-1">
          <Skeleton className="h-7 w-12" />
          <Skeleton className="h-4 w-24" />
        </div>
      </Card>
    ))}
  </div>
);

