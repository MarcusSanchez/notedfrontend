"use client"

import { useUserStore } from "@/lib/state"
import {
  AlertCircle,
  Barcode,
  Building2,
  Calendar,
  CheckCircle,
  CircleDollarSign,
  CreditCard,
  Edit3,
  Lock,
  LogOut,
  PenIcon as UserPen,
  RefreshCw,
  ShieldCheck,
  User,
  UserCog
} from 'lucide-react'
import { useMutation, useQuery } from "@tanstack/react-query"
import { fn } from "@/lib/utils"
import {
  createBillingPortalSession,
  createCheckoutSession,
  getCompanyBilling,
  getCompanyByID
} from "@/app/dashboard/(pages)/settings/actions"
import React from "react";
import {
  CreateBillingPortalSessionResponse,
  CreateCheckoutSessionResponse,
  SubscriptionStatus
} from "@/proto/company_pb";
import { timestamp2date } from "@/lib/tools/timestamp2date";
import { formatDate } from "date-fns";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Role } from "@/proto/user_pb";
import { role2text, status2text, subscription2text } from "@/lib/tools/enum2text";
import { ChangePasswordDialog } from "@/app/dashboard/(pages)/settings/(components)/ChangePasswordDialog";
import { EditAccountDialog } from "@/app/dashboard/(pages)/settings/(components)/EditAccountDialog";

const Settings = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6 lg:p-8">
      <div className="mx-auto space-y-8">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent pb-1">
              Settings
            </h1>
            <p className="text-gray-600 mt-2 text-lg">
              Manage your account, company, and billing information
            </p>
          </div>
        </div>

        {/* Settings Cards */}
        <div className="space-y-8">
          <CompanySettings />
          <AccountSettings />
          <BillingSettings />
        </div>
      </div>
    </div>
  );
};

const CompanySettings = () => {
  const { user } = useUserStore();

  const companyQ = useQuery({
    queryKey: ["getCompany", user.companyId],
    queryFn: fn(() => getCompanyByID({ id: user.companyId }))
  });
  const company = companyQ.data?.company;

  if (companyQ.isLoading) return <CompanySettingsSkeleton />;
  if (companyQ.error) return <CompanySettingsError onRetry={companyQ.refetch} />;
  if (!company) return <CompanySettingsSkeleton />;

  return (
    <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader className="border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
            <Building2 className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              Company Information
            </CardTitle>
            <CardDescription className="text-gray-600">
              View your company's name and code. If you need to change this information, please contact support.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InfoField
            icon={Building2}
            label="Company Name"
            value={company.name}
            bgColor="bg-blue-50"
            iconColor="text-blue-600"
          />
          <InfoField
            icon={Barcode}
            label="Company Code"
            value={company.code}
            bgColor="bg-purple-50"
            iconColor="text-purple-600"
          />
        </div>
      </CardContent>
    </Card>
  );
};

const AccountSettings = () => {
  const { user, signOut } = useUserStore()

  const getRoleColor = (role: Role) => {
    switch (role) {
      case Role.Admin:
        return 'bg-purple-100 text-purple-800';
      case Role.Nurse:
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader className="border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
            <User className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              Account Information
            </CardTitle>
            <CardDescription className="text-gray-600">
              View and manage your account information. Admins can only manage their own account information.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <InfoField
            icon={UserPen}
            label="Full Name"
            value={user.name}
            bgColor="bg-blue-50"
            iconColor="text-blue-600"
          />
          <InfoField
            icon={UserCog}
            label="Username"
            value={user.username}
            bgColor="bg-purple-50"
            iconColor="text-purple-600"
          />
          <div className="space-y-2">
            <Label className="text-sm font-semibold flex items-center gap-2 text-gray-700">
              <div className="w-5 h-5 bg-green-50 rounded-md flex items-center justify-center">
                <ShieldCheck className="w-4 h-4 text-green-600" />
              </div>
              Status
            </Label>
            <div className="relative">
              <Badge className="bg-green-100 text-green-800 border-0 px-4 py-2 text-sm font-medium">
                {status2text(user.status)}
              </Badge>
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-semibold flex items-center gap-2 text-gray-700">
              <div className="w-5 h-5 bg-orange-50 rounded-md flex items-center justify-center">
                <UserCog className="w-4 h-4 text-orange-600" />
              </div>
              Role
            </Label>
            <div className="relative">
              <Badge className={`${getRoleColor(user.role)} border-0 px-4 py-2 text-sm font-medium`}>
                {role2text(user.role)}
              </Badge>
            </div>
          </div>
          <div className="md:col-span-2">
            <div className="space-y-2">
              <Label className="text-sm font-semibold flex items-center gap-2 text-gray-700">
                <div className="w-5 h-5 bg-indigo-50 rounded-md flex items-center justify-center">
                  <Barcode className="w-4 h-4 text-indigo-600" />
                </div>
                License Status
              </Label>
              <div className="relative">
                <Badge className={`${user.isLicensed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'} border-0 px-4 py-2 text-sm font-medium`}>
                  {user.isLicensed ? 'Licensed' : 'Unlicensed'}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-between pt-6 border-t border-gray-200">
          <div className="flex space-x-3">
            <ChangePasswordDialog />
            <EditAccountDialog />
          </div>
          <Button
            onClick={() => signOut()}
            variant="outline"
            className="border-red-200 text-red-600 hover:bg-red-50"
          >
            <LogOut className="w-4 h-4 mr-2 scale-x-[-1]" />
            Sign Out
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const BillingSettings = () => {
  const { user } = useUserStore();

  const billingQ = useQuery({
    queryKey: ["getBillingInfo", user.id],
    queryFn: fn(() => getCompanyBilling()),
  });
  const billing = billingQ.data?.billing;

  const createPortalMu = useMutation<CreateBillingPortalSessionResponse>({
    mutationKey: ["createBillingPortalSession", user.id],
    mutationFn: fn(() => createBillingPortalSession()),
    onSuccess: ({ portalUrl }) => window.location.replace(portalUrl),
  });

  const createCheckoutMu = useMutation<CreateCheckoutSessionResponse>({
    mutationKey: ["createCheckoutSession", user.id],
    mutationFn: fn(() => createCheckoutSession()),
    onSuccess: ({ checkoutUrl }) => window.location.replace(checkoutUrl),
  });

  if (billingQ.isLoading) return <BillingSettingsSkeleton />;
  if (billingQ.error) return <BillingSettingsError onRetry={billingQ.refetch} />;
  if (!billing) return <BillingSettingsSkeleton />;

  const getSubscriptionStatusColor = (status: SubscriptionStatus) => {
    switch (status) {
      case SubscriptionStatus.Active:
        return 'bg-green-100 text-green-800';
      case SubscriptionStatus.PastDue:
        return 'bg-yellow-100 text-yellow-800';
      case SubscriptionStatus.Cancelled:
        return 'bg-red-100 text-red-800';
      case SubscriptionStatus.Nonexistent:
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader className="border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
            <CircleDollarSign className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              Billing Information
            </CardTitle>
            <CardDescription className="text-gray-600">
              View your company's billing information and manage your subscription.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <InfoField
            icon={CreditCard}
            label="Customer ID"
            value={billing.customerId}
            bgColor="bg-blue-50"
            iconColor="text-blue-600"
          />
          <InfoField
            icon={Barcode}
            label="Subscription ID"
            value={billing.subscriptionId}
            bgColor="bg-purple-50"
            iconColor="text-purple-600"
          />
          <div className="md:col-span-2 space-y-2">
            <Label className="text-sm font-semibold flex items-center gap-2 text-gray-700">
              <div className="w-5 h-5 bg-green-50 rounded-md flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-green-600" />
              </div>
              Subscription Status
            </Label>
            <div className="relative">
              <Badge className={`${getSubscriptionStatusColor(billing.subscriptionStatus)} border-0 px-4 py-2 text-sm font-medium`}>
                {subscription2text(billing.subscriptionStatus)}
              </Badge>
            </div>
          </div>
          <InfoField
            icon={Calendar}
            label="Billing Start"
            value={billing.billingStart ? formatDate(timestamp2date(billing.billingStart), "MMMM do, yyyy") : '-'}
            bgColor="bg-indigo-50"
            iconColor="text-indigo-600"
          />
          <InfoField
            icon={Calendar}
            label="Billing End"
            value={billing.billingEnd ? formatDate(timestamp2date(billing.billingEnd), "MMMM do, yyyy") : '-'}
            bgColor="bg-pink-50"
            iconColor="text-pink-600"
          />
        </div>

        {/* Action Button */}
        <div className="pt-6 border-t border-gray-200">
          {user.isLicensed ? (
            <Button
              onClick={() => createPortalMu.mutate()}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg"
            >
              <CreditCard className="w-4 h-4 mr-2" />
              Manage Subscription
            </Button>
          ) : (
            <Button
              onClick={() => createCheckoutMu.mutate()}
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg"
            >
              <CreditCard className="w-4 h-4 mr-2" />
              Purchase Subscription and License
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

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
      <Label className="text-sm font-semibold flex items-center gap-2 text-gray-700">
        <div className={`w-5 h-5 ${bgColor} rounded-md flex items-center justify-center`}>
          <Icon className={`w-4 h-4 ${iconColor}`} />
        </div>
        {label}
      </Label>
      <Input
        value={value || '-'}
        readOnly
        className="bg-white/80 border-gray-200 focus:border-blue-400 focus:ring-blue-400/20"
      />
    </div>
  );
};

const CompanySettingsSkeleton = () => (
  <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
    <CardHeader className="border-b border-gray-100">
      <div className="flex items-center space-x-3">
        <Skeleton className="w-12 h-12 rounded-xl" />
        <div>
          <Skeleton className="h-6 w-48 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
      </div>
    </CardHeader>
    <CardContent className="pt-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    </CardContent>
  </Card>
);

const BillingSettingsSkeleton = () => (
  <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
    <CardHeader className="border-b border-gray-100">
      <div className="flex items-center space-x-3">
        <Skeleton className="w-12 h-12 rounded-xl" />
        <div>
          <Skeleton className="h-6 w-48 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
      </div>
    </CardHeader>
    <CardContent className="pt-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full" />
          </div>
        ))}
      </div>
      <div className="pt-6 border-t border-gray-200">
        <Skeleton className="h-10 w-48" />
      </div>
    </CardContent>
  </Card>
);

const CompanySettingsError = ({ onRetry }: { onRetry: () => void }) => (
  <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm border-red-200">
    <CardHeader className="text-center">
      <div className="flex items-center justify-center mb-4">
        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
          <AlertCircle className="w-6 h-6 text-red-600" />
        </div>
      </div>
      <CardTitle className="text-xl text-red-900">Failed to Load Company Information</CardTitle>
      <CardDescription className="text-red-600">
        Unable to fetch company details. Please check your connection and try again.
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

const BillingSettingsError = ({ onRetry }: { onRetry: () => void }) => (
  <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm border-red-200">
    <CardHeader className="text-center">
      <div className="flex items-center justify-center mb-4">
        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
          <AlertCircle className="w-6 h-6 text-red-600" />
        </div>
      </div>
      <CardTitle className="text-xl text-red-900">Failed to Load Billing Information</CardTitle>
      <CardDescription className="text-red-600">
        Unable to fetch billing details. Please check your connection and try again.
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

export default Settings;