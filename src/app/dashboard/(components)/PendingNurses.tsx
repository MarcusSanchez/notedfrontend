"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useMutation, useQuery, useQueryClient, UseQueryResult } from "@tanstack/react-query";
import { fn } from "@/lib/utils";
import { approveNurse, listPendingNurses, rejectNurse } from "@/app/dashboard/actions";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { User } from "@/proto/user_pb";
import { useState } from "react";
import { useNeedsToRefresh } from "@/lib/state";

export function PendingNurses() {
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

  // fetching && pendingNursesQ.isFetching because when the user refreshes through dash-nav, we want to show the skeleton,
  // but if they're clicking accept/reject, we want the fetching to be as smooth as possible.
  if (pendingNursesQ.isPending || (showFetching && pendingNursesQ.isFetching)) return <PendingNursesSkeleton />;
  if (pendingNursesQ.isError) return <PendingNursesError query={pendingNursesQ} />;
  if (pendingNurses === undefined) return <PendingNursesSkeleton />;

  return (
    <Card className="flex flex-col p-6 space-y-2 min-h-full">
      <span className="text-sm font-bold">Pending Nurses</span>

      <ScrollArea className="h-80 rounded-xl border border-muted-foreground">
        <div className="flex flex-col gap-2 p-4 h-full">
          {pendingNurses.length === 0 && (
            <div className="h-full flex justify-center items-center">
              <span className="text-sm text-muted-foreground">No pending nurses</span>
            </div>
          )}
          {pendingNurses.map((nurse, i) => (
            <div key={nurse.id}>
              <div className="flex justify-between items-center gap-1 w-full">
                <span className="text-sm sm:text-lg font-bold">{nurse.name}</span>
                <PendingNurseButtons nurse={nurse} setShowFetching={setShowFetching} />
              </div>
              {pendingNurses.length !== i + 1 && <Separator />}
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
}

type PendingNurseButtonsProps = { nurse: User, setShowFetching: (fetching: boolean) => void };

function PendingNurseButtons({ nurse, setShowFetching }: PendingNurseButtonsProps) {
  const qc = useQueryClient();

  const approveNurseMutation = useMutation({
    mutationKey: ["approveNurse", nurse.id],
    mutationFn: fn(() => {
      setShowFetching(false);
      return approveNurse({ nurseId: nurse.id }, nurse.name)
    }),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["listPendingNurses"] });
      await qc.invalidateQueries({ queryKey: ["listCompanyStats"] });
    },
  });

  const rejectNurseMutation = useMutation({
    mutationKey: ["rejectNurse", nurse.id],
    mutationFn: fn(() => {
      setShowFetching(false);
      return rejectNurse({ nurseId: nurse.id }, nurse.name);
    }),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["listPendingNurses"] });
    },
  });

  return (
    <div className="flex gap-2 mb-2">
      <Button
        size="sm" className="font-bold"
        onClick={() => approveNurseMutation.mutate()}
        disabled={approveNurseMutation.isPending || rejectNurseMutation.isPending}
      >
        Accept
      </Button>
      <Button
        size="sm" className="font-bold" variant="outline"
        onClick={() => rejectNurseMutation.mutate()}
        disabled={rejectNurseMutation.isPending || approveNurseMutation.isPending}
      >
        Reject
      </Button>
    </div>
  );
}

type PendingNursesErrorProps = { query: UseQueryResult<unknown, Error> };

function PendingNursesError({ query }: PendingNursesErrorProps) {
  return (
    <Card className="flex flex-col space-y-2 lg:m-5 min-h-full">
      <CardHeader>
        <CardTitle className="text-2xl">Error Getting Your Company&#39;s Pending Nurses.</CardTitle>
        <CardDescription>Failed to get your company&#39;s pending nurses. Please check your connection and try again.
        </CardDescription>
      </CardHeader>
      <CardContent className="h-full flex items-end">
        <Button onClick={() => query.refetch()} className="w-full">Retry</Button>
      </CardContent>
    </Card>
  );
}

export const PendingNursesSkeleton = () => (
  <Card className="flex flex-col p-6 space-y-2">
    <Skeleton className="w-28 h-4" />

    <ScrollArea className="h-80 rounded-xl border border-muted-foreground">
      <div className="flex flex-col gap-2 p-4 h-full">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i}>
            <div className="flex justify-between items-center gap-1 w-full">
              <Skeleton className="w-32 h-6" />
              <div className="flex gap-2 mb-2">
                <Skeleton className="w-14 h-9" />
                <Skeleton className="w-14 h-9" />
              </div>
            </div>
            {(i + 1) !== 6 && <Separator />}
          </div>
        ))}
      </div>
    </ScrollArea>
  </Card>
);

