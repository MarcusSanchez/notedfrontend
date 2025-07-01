"use client";

import { useNeedsToRefresh } from "@/lib/state";
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Users,
  Check,
  X,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { approveNurse, listPendingNurses, rejectNurse } from "@/app/dashboard/actions";
import { fn } from "@/lib/utils";

interface PendingNurse {
  id: string;
  name: string;
}

interface PendingNurseCardProps {
  nurse: PendingNurse;
  setShowFetching: (show: boolean) => void;
}

const PendingNurseCard = ({ nurse, setShowFetching }: PendingNurseCardProps) => {
  const qc = useQueryClient();

  const approveNurseMutation = useMutation({
    mutationKey: ["approveNurse", nurse!.id],
    mutationFn: fn(() => {
      setShowFetching(false);
      return approveNurse({ nurseId: nurse!.id }, nurse!.name)
    }),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["listPendingNurses"] });
      await qc.invalidateQueries({ queryKey: ["listCompanyStats"] });
    },
  });

  const rejectNurseMutation = useMutation({
    mutationKey: ["rejectNurse", nurse!.id],
    mutationFn: fn(() => {
      setShowFetching(false);
      return rejectNurse({ nurseId: nurse!.id }, nurse!.name);
    }),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["listPendingNurses"] });
    },
  });

  return (
    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:shadow-md transition-all duration-200 bg-white/80 backdrop-blur-sm">
      <span className="font-semibold text-gray-900">{nurse.name}</span>
      <div className="flex space-x-2">
        <Button
          size="sm"
          onClick={() => approveNurseMutation.mutate()}
          disabled={approveNurseMutation.isPending || rejectNurseMutation.isPending}
          className="bg-emerald-600 hover:bg-emerald-700 text-white"
        >
          <Check className="w-4 h-4 mr-1" />
          Accept
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => rejectNurseMutation.mutate()}
          disabled={approveNurseMutation.isPending || rejectNurseMutation.isPending}
          className="border-red-200 text-red-600 hover:bg-red-50"
        >
          <X className="w-4 h-4 mr-1" />
          Reject
        </Button>
      </div>
    </div>
  );
};

export const PendingNurses = () => {
  const { needsToRefresh } = useNeedsToRefresh();
  const [showFetching, setShowFetching] = useState(true);

  const pendingNursesQ = useQuery({
    queryKey: ["listPendingNurses"],
    queryFn: fn(() => listPendingNurses().then(res => {
      setShowFetching(true);
      return res;
    })),
    enabled: !needsToRefresh,
  });
  const pendingNurses = pendingNursesQ.data?.nurses;

  const qc = useQueryClient();

  // fetching && pendingNursesQ.isFetching because when the user refreshes through dash-nav, we want to show the skeleton,
  // but if they're clicking accept/reject, we want the fetching to be as smooth as possible.
  if (pendingNursesQ.isPending || (showFetching && pendingNursesQ.isFetching)) return <PendingNursesSkeleton />;
  if (pendingNursesQ.isError) return <PendingNursesError onRetry={pendingNursesQ.refetch} />;
  if (pendingNurses === undefined) return <PendingNursesSkeleton />;

  return (
    <Card className="h-full shadow-lg border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader className="pb-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold text-gray-900">
                Pending Nurses
              </CardTitle>
              <p className="text-sm text-gray-500">
                {pendingNurses.length} nurse{pendingNurses.length !== 1 ? 's' : ''} awaiting approval
              </p>
            </div>
          </div>
          {pendingNurses.length > 0 && (
            <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
              {pendingNurses.length} Pending
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-6">
        {pendingNurses.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No pending nurses</h3>
            <p className="text-gray-500">
              All nurse applications have been processed. New applications will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {pendingNurses.map((nurse) => (
              <PendingNurseCard
                key={nurse.id}
                nurse={nurse}
                setShowFetching={setShowFetching}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const PendingNurseCardSkeleton = () => (
  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl bg-white/80 backdrop-blur-sm">
    <Skeleton className="h-5 w-32" />
    <div className="flex space-x-2">
      <Skeleton className="h-8 w-20 rounded-md" />
      <Skeleton className="h-8 w-20 rounded-md" />
    </div>
  </div>
);

const PendingNursesSkeleton = () => (
  <Card className="h-full shadow-lg border-0 bg-white/80 backdrop-blur-sm">
    <CardHeader className="pb-4 border-b border-gray-100">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Skeleton className="w-10 h-10 rounded-lg" />
          <div>
            <Skeleton className="h-5 w-32 mb-2" />
            <Skeleton className="h-4 w-40" />
          </div>
        </div>
        <Skeleton className="h-6 w-16 rounded-full" />
      </div>
    </CardHeader>
    <CardContent className="pt-6">
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <PendingNurseCardSkeleton key={index} />
        ))}
      </div>
    </CardContent>
  </Card>
);

const PendingNursesError = ({ onRetry }: { onRetry: () => void }) => (
  <Card className="h-full shadow-lg border-0 bg-white/80 backdrop-blur-sm border-red-200">
    <CardHeader className="text-center pb-4">
      <div className="flex items-center justify-center mb-4">
        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
          <AlertCircle className="w-6 h-6 text-red-600" />
        </div>
      </div>
      <CardTitle className="text-xl text-red-900">Failed to Load Pending Nurses</CardTitle>
      <CardDescription className="text-red-600">
        Unable to fetch pending nurse applications. Please check your connection and try again.
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
