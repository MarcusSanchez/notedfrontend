'use client'

import { AlertCircle, DollarSign, Info, RefreshCw } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import React from 'react'
import { useNeedsToRefresh } from "@/lib/state";
import { useQuery } from "@tanstack/react-query";
import { getEstimatedSubscriptionCost } from "@/app/dashboard/actions";
import { fn } from "@/lib/utils";

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
  if (subscriptionQ.isError) return <EstimatedSubscriptionCostError onRetry={subscriptionQ.refetch} />;
  if (!subscription) return <EstimatedSubscriptionCostSkeleton />;

  const { totalSeats, estimatedCost, seatsToRemove } = subscription;
  const calculatedCost = totalSeats <= baseSeats ? baseCost * 100 : totalSeats * costPerSeat * 100 - seatsToRemove * costPerSeat * 100;
  const extraSeats = Math.max(0, totalSeats - baseSeats);
  const extraSeatsCost = extraSeats * costPerSeat;
  const proratedCost = estimatedCost < calculatedCost
    ? `-$${(calculatedCost - estimatedCost - (seatsToRemove * costPerSeat * 100)).toString().slice(0, -2)}.00`
    : `$${Math.abs(calculatedCost - estimatedCost).toString().slice(0, -2)}.00`

  const costBreakdown = [
    {
      label: 'Starter Plan Base',
      amount: baseCost,
      description: `${baseSeats} seats included`
    }
  ];

  if (extraSeats > 0) {
    costBreakdown.push({
      label: `Additional Seats (${extraSeats})`,
      amount: extraSeatsCost,
      description: `$${costPerSeat}.00 per additional seat`
    });
  }

  return (
    <TooltipProvider>
      <Card className="h-full shadow-lg border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <CardTitle className="text-lg font-semibold text-gray-900">
                  Subscription Cost
                </CardTitle>
                <p className="text-sm text-gray-500">
                  Estimated for next billing cycle
                </p>
              </div>
            </div>
            <div className="bg-blue-100 text-blue-800 rounded-2xl py-1 px-2">
              <p className="font-bold text-xs">Monthly</p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Total Cost Display */}
          <div className="text-center p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
            <div className="flex items-baseline justify-center space-x-2 mb-2">
              <span className="text-4xl font-bold text-gray-900">
                ${(estimatedCost / 100).toFixed(2)}
              </span>
              <span className="text-lg text-gray-600">USD</span>
            </div>
            <p className="text-sm text-gray-600">Next billing amount</p>
          </div>

          {/* Cost Breakdown */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <h4 className="font-medium text-gray-900">Cost Breakdown</h4>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="w-4 h-4 text-gray-400 cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="max-w-[300px]">
                  <p>Starter Plan includes up to {baseSeats} seats. Additional seats are ${costPerSeat}.00 each.</p>
                </TooltipContent>
              </Tooltip>
            </div>

            <div className="space-y-3">
              {costBreakdown.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{item.label}</p>
                    {item.description && (
                      <p className="text-sm text-gray-500">{item.description}</p>
                    )}
                  </div>
                  <span className="font-semibold text-gray-900">
                    ${item.amount.toFixed(2)}
                  </span>
                </div>
              ))}

              {estimatedCost !== calculatedCost && !["-$.00", "$.00"].includes(proratedCost) && (
                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-gray-900">
                      Prorated {estimatedCost < calculatedCost ? "Deduction" : "Addition"}
                    </span>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="w-4 h-4 text-gray-400 cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-[350px]">
                        <p>
                          When accepting new nurses, you don't pay the full ${costPerSeat}, but a prorated amount based on
                          the number of days remaining in the billing period.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <span className="font-semibold text-gray-900">{proratedCost}</span>
                </div>
              )}

              {seatsToRemove > 0 && (
                <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Seats to Remove</p>
                    {totalSeats - seatsToRemove > baseSeats && (
                      <p className="text-sm text-gray-500">{seatsToRemove} × -${costPerSeat}.00</p>
                    )}
                  </div>
                  <span className="font-semibold text-gray-900">
                    -${(seatsToRemove * costPerSeat).toFixed(2)}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Seat Information */}
          <div className="border-t border-gray-200 pt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <span className="font-medium text-gray-900">Total Seats</span>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="w-4 h-4 text-gray-400 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>The current number of admins/nurses that have been Status 'Accepted' this billing period.</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <div className="text-right">
                <span className="text-2xl font-bold text-gray-900">{totalSeats}</span>
                {seatsToRemove > 0 && (
                  <p className="text-xs text-gray-500">
                    ({totalSeats - seatsToRemove} next billing period)
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <p className="font-medium text-blue-900">Base Seats</p>
                <p className="text-2xl font-bold text-blue-600">{baseSeats}</p>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <p className="font-medium text-purple-900">Additional</p>
                <p className="text-2xl font-bold text-purple-600">{extraSeats}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}

function EstimatedSubscriptionCostError({ onRetry }: { onRetry: () => void }) {
  return (
    <Card className="h-full shadow-lg border-0 bg-white/80 backdrop-blur-sm border-red-200">
      <CardHeader className="text-center pb-4">
        <div className="flex items-center justify-center mb-4">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
            <AlertCircle className="w-6 h-6 text-red-600" />
          </div>
        </div>
        <CardTitle className="text-xl text-red-900">Failed to Load Subscription Cost</CardTitle>
        <CardDescription className="text-red-600">
          Unable to fetch estimated subscription cost. Please check your connection and try again.
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
}

const EstimatedSubscriptionCostSkeleton = () => (
  <Card className="h-full shadow-lg border-0 bg-white/80 backdrop-blur-sm">
    <CardHeader className="pb-4">
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

    <CardContent className="space-y-6">
      {/* Total Cost Display */}
      <div className="text-center p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
        <div className="flex items-baseline justify-center space-x-2 mb-2">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-6 w-12" />
        </div>
        <Skeleton className="h-4 w-24 mx-auto mb-3" />
        <div className="flex items-center justify-center space-x-2">
          <Skeleton className="h-4 w-4 rounded-full" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>

      {/* Cost Breakdown */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-4 w-4 rounded-full" />
        </div>
        <div className="space-y-3">
          {Array.from({ length: 2 }).map((_, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <Skeleton className="h-4 w-32 mb-1" />
                <Skeleton className="h-3 w-40" />
              </div>
              <Skeleton className="h-4 w-16" />
            </div>
          ))}
        </div>
      </div>

      {/* Seat Information */}
      <div className="border-t border-gray-200 pt-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-4 rounded-full" />
          </div>
          <Skeleton className="h-8 w-16" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <Skeleton className="h-4 w-16 mx-auto mb-2" />
            <Skeleton className="h-8 w-8 mx-auto" />
          </div>
          <div className="text-center p-3 bg-purple-50 rounded-lg">
            <Skeleton className="h-4 w-16 mx-auto mb-2" />
            <Skeleton className="h-8 w-8 mx-auto" />
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);