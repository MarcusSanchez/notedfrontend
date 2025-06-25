"use client"

import { useParams, useRouter } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import { PatientInformation } from "@/app/dashboard/(pages)/patients/[id]/(components)/PatientInformation";
import { PatientTabs } from "@/app/dashboard/(pages)/patients/[id]/(components)/PatientTabs";
import { PatientAssignedNurses } from "@/app/dashboard/(pages)/patients/[id]/(components)/PatientAssignedNurses";
import { fn, statusFrom } from "@/lib/utils";
import { getPatient } from "@/app/dashboard/(pages)/patients/[id]/actions";
import { Code } from "@connectrpc/connect";
import { AlertTriangle, ArrowLeft, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { DashboardContainer } from "@/app/dashboard/(components)/DashboardContainer";

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
  if (patientQ.isError) return <SpecificPatientError q={patientQ} />;

  return (
    <DashboardContainer>
      <h1 className="w-min text-nowrap bg-background text-3xl font-bold mb-4">Patient Management</h1>
      <div className="mx-auto pt-0">
        {patient && (<>
          <PatientInformation patient={patient} />
          <PatientTabs patient={patient} />
          <PatientAssignedNurses patient={patient} />
        </>)}
      </div>
    </DashboardContainer>
  );
}

function SpecificPatientSkeleton() {
  return (
    <DashboardContainer>
      <Skeleton className="h-10 w-48 mb-4" />
      <div className="mx-auto pt-0">
        {/* Patient Information Skeleton */}
        <Card className="w-full mx-auto mb-6">
          <CardHeader>
            <Skeleton className="h-8 w-64" />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Skeleton className="h-5 w-24 mb-1" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div>
                <Skeleton className="h-5 w-24 mb-1" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="md:col-span-2">
                <Skeleton className="h-5 w-32 mb-1" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="flex items-center space-x-2">
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-5 w-48" />
              </div>
              <div className="col-span-full">
                <Skeleton className="h-5 w-40 mb-1" />
                <Skeleton className="h-[120px] w-full" />
              </div>
            </div>
            <div className="flex justify-end mt-6 space-x-2">
              <Skeleton className="h-9 w-[140px]" />
              <Skeleton className="h-9 w-[140px]" />
            </div>
          </CardContent>
        </Card>

        <div className="flex mb-4">
          <Skeleton className="h-10 w-60" />
        </div>

        {/* Patient Tabs Skeleton */}
        <Card className="w-full mb-6">
          <CardContent>
            <div className="flex justify-between items-center my-4">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-9 w-[120px]" />
            </div>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex justify-between items-center">
                  <Skeleton className="h-5 w-3/4" />
                  <div className="flex space-x-2">
                    <Skeleton className="h-8 w-8" />
                    <Skeleton className="h-8 w-8" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Patient Assigned Nurses Skeleton */}
        <Card className="relative z-10 mt-6">
          <CardHeader className="flex flex-row gap-2 items-center justify-between">
            <div>
              <Skeleton className="h-6 w-32 mb-1" />
              <Skeleton className="h-4 w-48" />
            </div>
            <Skeleton className="h-9 w-[160px]" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex justify-between items-center">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-9 w-24" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardContainer>
  );
}

function SpecificPatientError({ q }: { q: ReturnType<typeof useQuery> }) {
  const router = useRouter()

  return (
    <div className="w-full mx-auto p-4">
      <Card className="w-full mx-auto">
        <CardHeader>
          <div className="flex items-center justify-center mb-4">
            <AlertTriangle className="h-12 w-12 text-destructive" />
          </div>
          <CardTitle className="text-lg md:text-2xl font-bold text-center">Failed to Load Patient Data</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-muted-foreground mb-4 max-w-2xl mx-auto text-xs md:text-base">
            We encountered an error while trying to fetch the patient&#39;s information.
            This could be due to a network issue or you may not have permissions to view the patient data.
          </p>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={() => router.back()} variant="outline" className="w-full sm:w-auto">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
          <Button onClick={() => q.refetch()} className="w-full sm:w-auto">
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}