"use client";

import React from 'react';
import { PatientInformation } from './(components)/PatientInformation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertTriangle, ArrowLeft, RefreshCw, Table } from 'lucide-react';
import { Code } from "@connectrpc/connect";
import { PatientTabs } from "@/app/dashboard/(pages)/patients/[id]/(components)/PatientTabs";
import { PatientAssignedNurses } from "@/app/dashboard/(pages)/patients/[id]/(components)/PatientAssignedNurses";
import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { fn, statusFrom } from '@/lib/utils';
import { getPatient } from './actions';

export default function SpecificPatient() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const patientQ = useQuery({
    queryKey: ["getPatient", id],
    queryFn: fn(() => getPatient({ patientId: id })),
    retry: (failureCount, error) => {
      const status = statusFrom(error);
      if (status.code === Code.NotFound || status.code === Code.PermissionDenied) {
        router.replace("/404");
        return false;
      }
      return failureCount < 3;
    }
  });
  const patient = patientQ.data?.patient;

  if (patientQ.isPending || (patientQ.isError && patientQ.isFetching)) return <SpecificPatientSkeleton />;
  if (patientQ.isError) return <SpecificPatientError onRetry={patientQ.refetch} onGoBack={router.back} />;
  if (!patient) return <SpecificPatientSkeleton />;

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
          Patient Profile
        </h1>
      </div>

      {/* Patient Information */}
      <PatientInformation patient={patient} />
      <PatientTabs patient={patient} />
      <PatientAssignedNurses patient={patient} />
    </div>
  );
}

function SpecificPatientSkeleton() {
  return (
    <div className="space-y-8">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Skeleton className="h-9 w-16" />
          <Skeleton className="h-10 w-64" />
        </div>
      </div>

      {/* Patient Information Skeleton */}
      <Card className="w-full mx-auto mb-6 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="border-b border-gray-100">
          <Skeleton className="h-8 w-64" />
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
            <div className="flex items-center space-x-3 p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-5 w-48" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-[120px] w-full" />
            </div>
          </div>
          <div className="flex flex-col sm:flex-row sm:justify-end mt-8 gap-3">
            <Skeleton className="h-10 w-[140px]" />
            <Skeleton className="h-10 w-[140px]" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function SpecificPatientError({
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
            Failed to Load Patient Data
          </CardTitle>
          <p className="text-red-600 text-sm leading-relaxed">
            We encountered an error while trying to fetch the patient's information.
            This could be due to a network issue or you may not have permissions to view the patient data.
          </p>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 pt-0">
          <Button onClick={onRetry} variant="outline" className="w-full border-red-200 text-red-600 hover:bg-red-50">
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
          <Button onClick={onGoBack} variant="outline" className="w-full">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
