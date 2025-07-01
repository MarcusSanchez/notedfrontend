"use client";

import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertTriangle,
  ArrowLeft,
  RefreshCw,
  User as UserIcon,
  Calendar,
  Edit,
  Lock,
  Trash2,
  Mail,
  Shield,
  CheckCircle,
  XCircle,
  Clock,
} from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { fn, statusFrom } from "@/lib/utils";
import { getUser } from "@/app/dashboard/(pages)/nurses/[id]/actions";
import { Code } from '@connectrpc/connect';
import { Role, Status } from '@/proto/user_pb';
import { role2text, status2text } from '@/lib/tools/enum2text';
import { timestamp2date } from "@/lib/tools/timestamp2date";
import { AssignedPatients } from './(components)/AssignedPatients';
import { ChangeStatusSelect } from "@/app/dashboard/(pages)/nurses/[id]/(components)/ChangeStatusSelect";
import { EditAccountDialog } from "@/app/dashboard/(pages)/nurses/[id]/(components)/EditAccountDialog";
import { ChangePasswordDialog } from "@/app/dashboard/(pages)/nurses/[id]/(components)/ChangePasswordDialog";
import { DeleteAccountAlertDialog } from "@/app/dashboard/(pages)/nurses/[id]/(components)/DeleteAccountAlertDialog";

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
  if (getUserQ.isError) return <SpecificNurseError onRetry={getUserQ.refetch} />;

  const { user, patients } = getUserQ.data;
  if (!user || !patients) return <SpecificNurseSkeleton />

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
          {user.role === Role.Admin ? 'Admin' : user.role === Role.Nurse ? 'Nurse' : 'User'} Profile
        </h1>
      </div>

      {/* Profile Information Card */}
      <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                <UserIcon className="w-8 h-8 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold text-gray-900">
                  {user.name}
                </CardTitle>
                <p className="text-gray-600 text-lg">@{user.username}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Badge
                variant="outline"
                className={`px-3 py-1 text-sm font-medium border-0 ${
                  user.role === Role.Admin
                    ? 'bg-purple-100 text-purple-800'
                    : user.role === Role.Nurse
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-indigo-100 text-indigo-800'
                }`}
              >
                {role2text(user.role)}
              </Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-6">
          {/* Cool Status Section */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Status</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Account Status */}
              <div className={`relative overflow-hidden rounded-xl p-6 ${
                user.status === Status.Accepted
                  ? 'bg-gradient-to-br from-green-500 to-emerald-600'
                  : user.status === Status.Pending
                    ? 'bg-gradient-to-br from-yellow-500 to-orange-600'
                    : 'bg-gradient-to-br from-red-500 to-rose-600'
              } text-white shadow-lg`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/80 text-sm font-medium">Account Status</p>
                    <p className="text-2xl font-bold">{status2text(user.status)}</p>
                  </div>
                  {user.status === Status.Accepted ? (
                    <CheckCircle className="w-8 h-8 text-white/80" />
                  ) : user.status === Status.Pending ? (
                    <Clock className="w-8 h-8 text-white/80" />
                  ) : (
                    <XCircle className="w-8 h-8 text-white/80" />
                  )}
                </div>
                <div className="absolute -bottom-2 -right-2 w-16 h-16 bg-white/10 rounded-full" />
                <div className="absolute -top-2 -left-2 w-12 h-12 bg-white/10 rounded-full" />
              </div>

              {/* License Status */}
              <div className={`relative overflow-hidden rounded-xl p-6 ${
                user.isLicensed
                  ? 'bg-gradient-to-br from-blue-500 to-indigo-600'
                  : 'bg-gradient-to-br from-gray-500 to-slate-600'
              } text-white shadow-lg`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/80 text-sm font-medium">License Status</p>
                    <p className="text-2xl font-bold">{user.isLicensed ? 'Licensed' : 'Unlicensed'}</p>
                  </div>
                  <Shield className="w-8 h-8 text-white/80" />
                </div>
                <div className="absolute -bottom-2 -right-2 w-16 h-16 bg-white/10 rounded-full" />
                <div className="absolute -top-2 -left-2 w-12 h-12 bg-white/10 rounded-full" />
              </div>
            </div>
          </div>

          {/* User Information Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <InfoField
              icon={Mail}
              label="Email Address"
              value={user.email}
              bgColor="bg-blue-50"
              iconColor="text-blue-600"
            />
            <InfoField
              icon={Calendar}
              label="Account Created"
              value={user.createdAt && timestamp2date(user.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
              bgColor="bg-green-50"
              iconColor="text-green-600"
            />
          </div>

          {user.role !== Role.Admin && (
            <div className="flex flex-wrap gap-4 pt-6 border-t border-gray-200">
              {user.status === Status.Accepted && (
                <>
                  <ChangePasswordDialog user={user} />
                  <EditAccountDialog user={user} />
                </>
              )}

              {[Status.Accepted, Status.Rejected].includes(user.status) && (
                <ChangeStatusSelect user={user} />
              )}

              {user.role === Role.Nurse &&
                user.status === Status.Rejected &&
                !user.isLicensed && (
                  <DeleteAccountAlertDialog user={user}/>
                )}
            </div>
          )}
        </CardContent>
      </Card>

      {user.role !== Role.Admin && user.status === Status.Accepted && (
        <AssignedPatients
          user={user}
          patients={patients}
          isLoading={getUserQ.isPending || getUserQ.isFetching}
        />
      )}
    </div>
  );
}

const InfoField = ({
  icon: Icon,
  label,
  value,
  bgColor = "bg-gray-50",
  iconColor = "text-gray-600"
}: {
  icon: React.ElementType;
  label: string;
  value?: string;
  bgColor?: string;
  iconColor?: string;
}) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-2">
        <div className={`w-5 h-5 ${bgColor} rounded-md flex items-center justify-center`}>
          <Icon className={`w-4 h-4 ${iconColor}`} />
        </div>
        <span className="text-sm font-semibold text-gray-700">{label}</span>
      </div>
      <div className="bg-white/80 border border-gray-200 rounded-md px-3 py-2 text-sm text-gray-900">
        {value || '-'}
      </div>
    </div>
  );
};

function SpecificNurseSkeleton() {
  return (
    <div className="space-y-8">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Skeleton className="h-9 w-16" />
          <Skeleton className="h-10 w-48" />
        </div>
        <div className="flex space-x-2">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-8 w-20" />
        </div>
      </div>

      {/* Profile Card Skeleton */}
      <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="border-b border-gray-100">
          <div className="flex items-center space-x-4">
            <Skeleton className="w-16 h-16 rounded-full" />
            <div>
              <Skeleton className="h-7 w-48 mb-2" />
              <Skeleton className="h-5 w-32" />
            </div>
            <div className="ml-auto flex items-center space-x-3">
              <Skeleton className="h-6 w-16 rounded-full" />
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-6">
          {/* Status Cards Skeleton */}
          <div className="mb-8">
            <Skeleton className="h-6 w-32 mb-4" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Array.from({ length: 2 }).map((_, index) => (
                <Skeleton key={index} className="h-24 rounded-xl" />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {Array.from({ length: 2 }).map((_, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Skeleton className="w-5 h-5 rounded-md" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-3 pt-6 border-t border-gray-200">
            <Skeleton className="h-10 w-40" />
            <Skeleton className="h-10 w-36" />
            <Skeleton className="h-10 w-44" />
          </div>
        </CardContent>
      </Card>

      {/* Assigned Patients Skeleton */}
      <AssignedPatientsSkeleton />
    </div>
  );
}

function AssignedPatientsSkeleton() {
  return (
    <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader className="border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Skeleton className="w-10 h-10 rounded-lg" />
            <div>
              <Skeleton className="h-6 w-40 mb-1" />
              <Skeleton className="h-4 w-56" />
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-10 w-36" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="p-6">
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex space-x-4">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <Skeleton className="h-9 w-24" />
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function SpecificNurseError({ onRetry, }: { onRetry: () => void; }) {
  const router = useRouter();

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
            Failed to Load Nurse Data
          </CardTitle>
          <p className="text-red-600 text-sm leading-relaxed">
            We encountered an error while trying to fetch the nurse's information.
            This could be due to a network issue or you may not have permissions to view the nurse data.
          </p>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 pt-0">
          <Button onClick={onRetry} variant="outline" className="w-full border-red-200 text-red-600 hover:bg-red-50">
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
          <Button onClick={router.back} variant="outline" className="w-full">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}