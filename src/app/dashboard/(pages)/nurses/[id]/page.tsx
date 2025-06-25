"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, ArrowLeft, RefreshCw, User } from 'lucide-react'
import { useQuery } from "@tanstack/react-query";
import { fn, statusFrom } from "@/lib/utils";
import { getUser } from "@/app/dashboard/(pages)/nurses/[id]/actions";
import { useParams, useRouter } from "next/navigation";
import { role2text, status2text } from "@/lib/tools/enum2text";
import { format } from "date-fns";
import { timestamp2date } from "@/lib/tools/timestamp2date";
import { AssignedPatients } from "@/app/dashboard/(pages)/nurses/[id]/(components)/AssignedPatients";
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Code } from "@connectrpc/connect";
import { EditAccountDialog } from "@/app/dashboard/(pages)/nurses/[id]/(components)/EditAccountDialog";
import { Role, Status } from "@/proto/user_pb";
import { ChangePasswordDialog } from "@/app/dashboard/(pages)/nurses/[id]/(components)/ChangePasswordDialog";
import { DeleteAccountAlertDialog } from "@/app/dashboard/(pages)/nurses/[id]/(components)/DeleteAccountAlertDialog";
import { ChangeStatusSelect } from "@/app/dashboard/(pages)/nurses/[id]/(components)/ChangeStatusSelect";
import { DashboardContainer } from "@/app/dashboard/(components)/DashboardContainer";

export default function SpecificNurse() {
  const { id: userId } = useParams<{ id: string }>();
  const router = useRouter();

  const getUserQ = useQuery({
    queryKey: ["getUser", userId],
    queryFn: fn(() => getUser({ userId })),
    retry: (failureCount, error) => {
      const status = statusFrom(error);
      if (status.code === Code.NotFound || status.code === Code.PermissionDenied) {
        router.replace("/404");
        return false;
      }
      return failureCount < 3;
    }
  });

  if (getUserQ.isPending || (getUserQ.isError && getUserQ.isFetching)) return <SpecificNurseSkeleton />;
  if (getUserQ.isError) return <SpecificNurseError q={getUserQ} />;

  const { user, patients } = getUserQ.data;

  return (
    <DashboardContainer>
      <h1 className="w-min text-nowrap bg-background text-3xl font-bold mb-4">Nurse Management</h1>
      <div className="container mx-auto space-y-6">
        <Card className="relative z-10">
          <CardContent className="space-y-4 mt-6">
            <div className="flex items-center space-x-4">
              <User className="h-10 w-10 bg-muted rounded-3xl p-2" />
              <div>
                <p className="font-semibold">{user?.name}</p>
                <p className="text-sm text-muted-foreground">@{user?.username}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline">{role2text(user?.role)}</Badge>
              <Badge variant="outline">{status2text(user?.status)}</Badge>
            </div>
            <div className="space-y-1">
              {user?.createdAt && (
                <p className="text-sm italic">
                  <span className="font-bold not-italic">Account Created: </span>
                  {format(timestamp2date(user?.createdAt), "MMM do, yyyy")}
                </p>
              )}
              <p className="text-sm italic">
                <span className="font-bold not-italic">On Current Billing Period (Active): </span>
                {user?.isActive ? "Yes" : "No"}
              </p>
            </div>
            {user && user.role !== Role.Admin && (
              <div className="flex flex-wrap gap-2">
                {user && user.status === Status.Accepted && <ChangePasswordDialog user={user} />}
                {user && user.status === Status.Accepted && <EditAccountDialog user={user} />}
                {user && [Status.Accepted, Status.Rejected].includes(user.status) && <ChangeStatusSelect user={user} />}
                {user && user.role === Role.Nurse && user.status === Status.Rejected && !user.isActive && (<DeleteAccountAlertDialog user={user} />)}
              </div>
            )}
          </CardContent>
        </Card>

        {user && user.role !== Role.Admin && user.status === Status.Accepted && patients &&
          <AssignedPatients user={user} patients={patients} />
        }
      </div>
    </DashboardContainer>
  );
}

function SpecificNurseSkeleton() {
  return (
    <DashboardContainer>
      <Skeleton className="h-10 w-48 mb-4 md:mb-6" />
      <div className="container mx-auto space-y-6">
        <Card className="relative z-10">
          <CardContent className="space-y-4 mt-6">
            <div className="flex items-center space-x-4">
              <Skeleton className="h-6 w-6 rounded-full" />
              <div>
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-4 w-24 mt-1" />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-5 w-16" />
            </div>
            <div className="space-y-1">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-4 w-56" />
            </div>
            <div className="flex flex-wrap gap-2">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-8 w-32" />
              ))}
            </div>
          </CardContent>
        </Card>

        <AssignedPatientsSkeleton />
      </div>
    </DashboardContainer>
  )
}

function AssignedPatientsSkeleton() {
  return (
    <Card className="relative z-10">
      <CardHeader className="flex flex-row gap-2 items-center justify-between">
        <div>
          <Skeleton className="h-6 w-40 mb-1" />
          <Skeleton className="h-4 w-56" />
        </div>
        <Skeleton className="h-9 w-32" />
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead><Skeleton className="h-4 w-20" /></TableHead>
              <TableHead><Skeleton className="h-4 w-20" /></TableHead>
              <TableHead className="flex items-center justify-end pr-10">
                <Skeleton className="h-4 w-16" />
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(3)].map((_, i) => (
              <TableRow key={i}>
                <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                <TableCell className="flex justify-end">
                  <Skeleton className="h-8 w-20" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

function SpecificNurseError({ q }: { q: ReturnType<typeof useQuery> }) {
  const router = useRouter()

  return (
    <div className="p-4">
      <Card className="w-full mx-auto">
        <CardHeader>
          <div className="flex items-center justify-center mb-4">
            <AlertTriangle className="h-12 w-12 text-destructive" />
          </div>
          <CardTitle className="text-lg md:text-2xl font-bold text-center">Failed to Load Nurse Data</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-muted-foreground mb-4 max-w-2xl mx-auto text-xs md:text-base">
            We encountered an error while trying to fetch the nurse&#39;s information.
            This could be due to a network issue or you may not have permissions to view the nurse data.
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