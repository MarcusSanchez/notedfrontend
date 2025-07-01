"use client";

import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertTriangle, ArrowLeft, RefreshCw } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { getNote } from './actions';
import { fn, statusFrom } from '@/lib/utils';
import { Code } from "@connectrpc/connect";
import { GeneratedContent } from "@/app/dashboard/(pages)/notes/[id]/(components)/GenerateContentTab";
import { NoteTabs } from "@/app/dashboard/(pages)/notes/[id]/(components)/NoteTabs";

export default function SpecificNote() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const noteQ = useQuery({
    queryKey: ["getNote", id],
    queryFn: fn(() => getNote({ noteId: id })),
    retry: (failureCount, error) => {
      const status = statusFrom(error);
      if (status.code === Code.NotFound || status.code === Code.PermissionDenied) {
        router.replace("/404");
        return false;
      }
      return failureCount < 3;
    },
  });
  const note = noteQ.data?.note

  if (noteQ.isPending || (noteQ.isError && noteQ.isFetching)) return <SpecificNoteSkeleton />;
  if (noteQ.isError) return <SpecificNoteError onRetry={noteQ.refetch} onGoBack={router.back} />;
  if (!note) return <SpecificNoteSkeleton />;

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={router.back}
              className="border-gray-300 hover:bg-gray-50"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </div>
        </div>

        <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
          Note Details
        </h1>
      </div>

      <GeneratedContent note={note} />
      <NoteTabs note={note} />
    </div>
  );
}

function SpecificNoteSkeleton() {
  return (
    <div className="space-y-8">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Skeleton className="h-9 w-16" />
          <Skeleton className="h-10 w-64" />
        </div>
      </div>

      {/* Generated Content Skeleton */}
      <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2 md:gap-0">
            <Skeleton className="h-6 w-40" />
            <div className="flex flex-col sm:flex-row gap-2 items-center">
              <Skeleton className="h-10 w-40" />
              <Skeleton className="h-10 w-40" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-4 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tabs Skeleton */}
      <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <Skeleton className="h-12 w-full" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="border rounded-lg p-4">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function SpecificNoteError({
  onRetry,
  onGoBack
}: {
  onRetry: () => void;
  onGoBack: () => void;
}) {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Card className="w-full max-w-md shadow-xl border-0 bg-white/80 backdrop-blur-sm border-red-200">
        <CardHeader className="text-center pb-4">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
          </div>
          <CardTitle className="text-xl font-bold text-red-900 mb-2">
            Failed to Load Note Data
          </CardTitle>
          <p className="text-red-600 text-sm leading-relaxed">
            We encountered an error while trying to fetch the note information.
            This could be due to a network issue or you may not have permissions to view this note.
          </p>
        </CardHeader>
        <CardFooter className="flex flex-col gap-3 pt-0">
          <Button onClick={onRetry} variant="outline" className="w-full border-red-200 text-red-600 hover:bg-red-50">
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
          <Button onClick={onGoBack} variant="outline" className="w-full">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}