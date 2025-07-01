"use client";

import { useQuery } from "@tanstack/react-query";
import { fn } from "@/lib/utils";
import { getCompanyStats } from "@/app/dashboard/actions";
import { useNeedsToRefresh } from "@/lib/state";
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Clipboard as ClipboardPen,
  Bed,
  Users,
  Shield,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

interface StatCardProps {
  title: string;
  value: number;
  thisMonth: number;
  icon: React.ElementType;
  color: string;
  bgColor: string;
}

const StatCard = ({ title, value, thisMonth, icon: Icon, color, bgColor }: StatCardProps) => {
  const isPositive = thisMonth > 0;

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-white/80 backdrop-blur-sm overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent" />
      <CardContent className="p-6 relative">
        <div className="flex items-center justify-between mb-4">
          <div className={`w-14 h-14 rounded-2xl ${bgColor} flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
            <Icon className={`w-7 h-7 ${color}`} />
          </div>
          <div className={`flex items-center space-x-1 text-sm px-3 py-1 rounded-full ${
            isPositive ? 'text-emerald-700 bg-emerald-100' : 'text-gray-700 bg-gray-100'
          }`}>
            <TrendingUp className="w-4 h-4" />
            <span className="font-semibold">{Math.abs(thisMonth)}</span>
          </div>
        </div>

        <div className="space-y-1">
          <h3 className="text-sm text-gray-600 tracking-wide">{title}</h3>
          <p className="text-3xl font-bold text-gray-900">{value.toLocaleString()}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export const DashStats = () => {
  const { needsToRefresh } = useNeedsToRefresh();

  const statsQ = useQuery({
    queryKey: ["listCompanyStats"],
    queryFn: fn(() => getCompanyStats()),
    enabled: !needsToRefresh,
  });
  const stats = statsQ.data!;

  if (statsQ.isPending || statsQ.isFetching) return <DashStatsSkeleton />;
  if (statsQ.isError) return <DashStatsError onRetry={statsQ.refetch} />;
  if (!stats) return <DashStatsSkeleton />;

  const statCards = [
    {
      title: 'Total Notes',
      value: stats.totalNotes,
      thisMonth: stats.totalNotesThisMonth,
      icon: ClipboardPen,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Total Patients',
      value: stats.totalPatients,
      thisMonth: stats.totalPatientsThisMonth,
      icon: Bed,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-100'
    },
    {
      title: 'Active Nurses',
      value: stats.totalNurses,
      thisMonth: stats.totalNursesThisMonth,
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      title: 'Total Admins',
      value: stats.totalAdmins,
      thisMonth: stats.totalAdminsThisMonth,
      icon: Shield,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
      {statCards.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
};

const StatCardSkeleton = () => (
  <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
    <CardContent className="p-6">
      <div className="flex items-center justify-between mb-4">
        <Skeleton className="w-14 h-14 rounded-2xl" />
        <Skeleton className="w-16 h-6 rounded-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-8 w-16" />
        <Skeleton className="h-3 w-20" />
      </div>
    </CardContent>
  </Card>
);

const DashStatsError = ({ onRetry }: { onRetry: () => void }) => (
  <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm border-red-200">
    <CardHeader className="text-center pb-4">
      <div className="flex items-center justify-center mb-4">
        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
          <AlertCircle className="w-6 h-6 text-red-600" />
        </div>
      </div>
      <CardTitle className="text-xl text-red-900">Failed to Load Statistics</CardTitle>
      <CardDescription className="text-red-600">
        Unable to fetch dashboard statistics. Please check your connection and try again.
      </CardDescription>
    </CardHeader>
    <CardContent className="text-center">
      <Button onClick={onRetry} variant="outline" className="border-red-200 text-red-600 hover:bg-red-50">
        <RefreshCw className="w-4 h-4 mr-2" />
        Retry
      </Button>
    </CardContent>
  </Card>
);

const DashStatsSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
    {Array.from({ length: 4 }).map((_, index) => (
      <StatCardSkeleton key={index} />
    ))}
  </div>
);