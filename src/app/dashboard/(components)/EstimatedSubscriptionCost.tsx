'use client'

import { Info } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger, } from "@/components/ui/tooltip"
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { GetEstimatedSubscriptionCostResponse } from "@/proto/company_pb";
import React from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { fn } from "@/lib/utils";
import { getEstimatedSubscriptionCost } from "@/app/dashboard/actions";
import { useNeedsToRefresh } from "@/lib/state";

const baseSeats = 12;
const costPerSeat = 25;
const baseCost = baseSeats * costPerSeat;

export function EstimatedSubscriptionCost() {
  const { needsToRefresh } = useNeedsToRefresh();

  const subscriptionQ = useQuery({
    queryKey: ["getEstimatedSubscriptionCost"],
    queryFn: fn(() => getEstimatedSubscriptionCost()),
    enabled: !needsToRefresh,
  });
  const subscription = subscriptionQ.data;

  if (subscriptionQ.isPending || subscriptionQ.isFetching) return <EstimatedSubscriptionCostSkeleton />;
  if (subscriptionQ.isError) return <EstimatedSubscriptionCostError query={subscriptionQ} />;
  if (!subscription) return <EstimatedSubscriptionCostSkeleton />;

  const { totalSeats, estimatedCost, seatsToRemove } = subscription;
  const calculatedCost = totalSeats <= baseSeats ? baseCost * 100 : totalSeats * costPerSeat * 100 - seatsToRemove * costPerSeat * 100;
  const extraSeats = Math.max(0, totalSeats - baseSeats);
  const extraSeatsCost = extraSeats * costPerSeat;
  const proratedCost = estimatedCost < calculatedCost
    ? `-$${(calculatedCost - estimatedCost - (seatsToRemove * costPerSeat * 100)).toString().slice(0, -2)}.00`
    : `$${Math.abs(calculatedCost - estimatedCost).toString().slice(0, -2)}.00`

  return (
    <TooltipProvider>
      <Card className="flex flex-col p-6 space-y-4 min-h-full">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold">Estimated Subscription Cost</span>
          <Tooltip>
            <TooltipTrigger>
              <Info className="h-4 w-4 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent className="max-w-[300px]">
              <p>Starter Plan base price (${baseCost}.00) covers up to {baseSeats} seats. Additional seats are ${costPerSeat}.00 each.</p>
            </TooltipContent>
          </Tooltip>
        </div>

        <Separator />

        <div className="space-y-4">
          <div className="flex flex-col">
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold">
                ${estimatedCost.toString().slice(0, -2)}.00
              </span>
              <span className="text-sm text-muted-foreground">
                upcoming invoice
              </span>
            </div>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between items-center">
              <span>Starter Plan Seats ({baseSeats} x ${costPerSeat}.00)</span>
              <span className="font-medium">${baseCost}.00</span>
            </div>

            {extraSeats > 0 && (
              <div className="flex justify-between items-center">
                <span>Additional Seats ({extraSeats} × ${costPerSeat}.00)</span>
                <span className="font-medium">${extraSeatsCost}.00</span>
              </div>
            )}

            {estimatedCost !== calculatedCost && !["-$.00", "$.00"].includes(proratedCost) &&
              <div className="flex justify-between items-center">
                <div className="flex gap-1 items-center">
                  <span>Prorated {estimatedCost < calculatedCost ? "Deduction" : "Addition"}</span>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-[350px]">
                      <p>
                        When accepting new nurses, you don&#39;t pay the full ${costPerSeat}, but a prorated amount based on
                        the numbers of days remaining in the billing period. This prorated amount is added to the next
                        billing period.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </div>

                <span className="font-medium">{
                  proratedCost
                }</span>
              </div>
            }

            {seatsToRemove > 0 && (
              <div className="flex justify-between items-center pt-4">
                <span>
                  Seats to Remove {totalSeats - seatsToRemove > baseSeats && `(${seatsToRemove} × -$${costPerSeat}.00)`}
                </span>
                <span className="font-medium">-${seatsToRemove * costPerSeat}.00</span>
              </div>
            )}
          </div>

          <div className="pt-4 flex items-center justify-between border-t">
            <div className="flex items-center gap-2">
              <span className="font-medium">Total Seats</span>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>The current number of admins/nurses that have been Status &#39;Accepted&#39; this billing period.</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <div>
            <span className="text-2xl font-bold">
              {totalSeats}
            </span>
              {seatsToRemove > 0 && (
                <span className="pl-2 text-xs text-muted-foreground">
                  ({totalSeats - seatsToRemove} next billing period)
                </span>
              )}
            </div>
          </div>
        </div>
      </Card>
    </TooltipProvider>
  );
}

type EstimatedSubscriptionCostErrorProps = {
  query: UseQueryResult<GetEstimatedSubscriptionCostResponse, Error>;
};

function EstimatedSubscriptionCostError({ query }: EstimatedSubscriptionCostErrorProps) {
  return (
    <Card className="flex flex-col space-y-2 lg:m-5 min-h-full">
      <CardHeader>
        <CardTitle className="text-2xl">Error Getting Your Company&#39;s Estimated Subscription Cost</CardTitle>
        <CardDescription>
          Failed to get your company&#39;s estimated subscription cost. Please check your connection and try again.
        </CardDescription>
      </CardHeader>
      <CardContent className="h-full flex items-end">
        <Button onClick={() => query.refetch()} className="w-full">Retry</Button>
      </CardContent>
    </Card>
  );
}

const EstimatedSubscriptionCostSkeleton = () => (
  <Card className="flex flex-col p-6 space-y-4">
    {/* Header */}
    <div className="flex items-center justify-between">
      <Skeleton className="h-4 w-48" />
      <Skeleton className="h-4 w-4 rounded-full" />
    </div>

    <Separator />

    <div className="space-y-4">
      <div className="flex flex-col">
        <div className="flex items-baseline gap-2">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-4 w-20" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-16" />
        </div>
        <div className="flex justify-between items-center">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-4 w-16" />
        </div>
      </div>
      <div className="pt-4 flex items-center justify-between border-t">
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-4 rounded-full" />
        </div>
        <Skeleton className="h-8 w-16" />
      </div>
    </div>
  </Card>
);

