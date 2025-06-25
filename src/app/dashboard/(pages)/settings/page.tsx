"use client"

import { Button } from "@/components/ui/button"
import { useUserStore } from "@/lib/state"
import {
  BarChartIcon as ChartNoAxesColumn,
  Barcode,
  Building2,
  CircleDollarSign,
  FilePenLineIcon as Signature,
  HandCoins,
  LogOut,
  PenIcon as UserPen,
  ShieldCheck,
  User,
  UserCog
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { role2text, status2text, subscription2text } from "@/lib/tools/enum2text"
import { EditAccountDialog } from "@/app/dashboard/(pages)/settings/(components)/EditAccountDialog"
import { ChangePasswordDialog } from "@/app/dashboard/(pages)/settings/(components)/ChangePasswordDialog"
import { useMutation, useQuery, UseQueryResult } from "@tanstack/react-query"
import { fn } from "@/lib/utils"
import {
  createBillingPortalSession,
  createCheckoutSession,
  getCompanyBilling,
  getCompanyByID
} from "@/app/dashboard/(pages)/settings/actions"
import { Skeleton } from "@/components/ui/skeleton"
import { ElementType } from "react";
import {
  CreateBillingPortalSessionResponse,
  CreateCheckoutSessionResponse,
  GetCompanyBillingResponse, GetCompanyByIDResponse
} from "@/proto/company_pb";
import { timestamp2date } from "@/lib/tools/timestamp2date";
import { formatDate } from "date-fns";
import { DashboardContainer } from "@/app/dashboard/(components)/DashboardContainer";

export default function Settings() {
  return (
    <DashboardContainer>
      <h1 className="w-min text-nowrap bg-background text-3xl font-bold mb-4">Settings</h1>
      <div className="flex flex-col gap-4">
        <CompanySettings />
        <AccountSettings />
        <BillingSettings />
      </div>
    </DashboardContainer>
  )
}

function AccountSettings() {
  const { user, signOut } = useUserStore()

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold flex items-center gap-2">
          <User className="w-6 h-6" />
          Account Information
        </CardTitle>
        <CardDescription>
          View and manage your account information. Admins can only manage their own account information.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6">
          <InfoField icon={UserPen} label="Name" value={user.name} />
          <InfoField icon={UserCog} label="Username" value={user.username} />
          <InfoField icon={ChartNoAxesColumn} label="Status" value={status2text(user.status)} />
          <InfoField icon={ShieldCheck} label="Role" value={role2text(user.role)} />
          <InfoField icon={Barcode} label="License Status" value={user.isLicensed ? "Licensed" : "Unlicensed"} />
        </div>
      </CardContent>
      <CardFooter className="flex flex-wrap justify-between">
        <div className="flex gap-2">
          <ChangePasswordDialog />
          <EditAccountDialog />
        </div>

        <Button onClick={() => signOut()} variant="ghost" className="font-bold text-red-500 dark:text-mocha-red dark:text-mocha-red hover:text-red-800">
          <LogOut className="w-4 h-4 mr-2 scale-x-[-1]" />
          Sign Out
        </Button>
      </CardFooter>
    </Card>
  );
}

function CompanySettings() {
  const { user } = useUserStore();

  const companyQ = useQuery({
    queryKey: ["getCompany", user.companyId],
    queryFn: fn(() => getCompanyByID({ id: user.companyId }))
  });
  const company = companyQ.data?.company;

  if (companyQ.isLoading) return <CompanySettingsSkeleton />;
  if (companyQ.error) return <CompanySettingsError query={companyQ} />;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold flex items-center gap-2">
          <Building2 className="w-6 h-6" />
          Company Information
        </CardTitle>
        <CardDescription>
          View your company&#39;s name and code. If you need to change this information, please contact support.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6">
          <InfoField icon={Signature} label="Name" value={company?.name} />
          <InfoField icon={Barcode} label="Code" value={company?.code} />
        </div>
      </CardContent>
    </Card>
  );
}

function CompanySettingsSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-full mt-2" />
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </CardContent>
    </Card>
  );
}

function CompanySettingsError({ query }: { query: UseQueryResult<GetCompanyByIDResponse, Error> }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold flex items-center gap-2">
          <Building2 className="w-6 h-6" />
          Company Information
        </CardTitle>
        <CardDescription>
          There was an error loading your company information.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center py-6 text-center">
          <div className="rounded-full bg-red-100 p-3 mb-4">
            <Building2 className="w-6 h-6 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-red-600 mb-2">
            Unable to Load Company Information
          </h3>
          <p className="text-sm text-muted-foreground max-w-md">
            {query.error?.message || "Please try refreshing the page or contact support if the problem persists."}
          </p>
        </div>
      </CardContent>
      <CardFooter className="justify-center">
        <Button
          variant="outline"
          onClick={() => query.refetch()}
          disabled={query.isFetching}
          className="font-bold"
        >
          {query.isFetching ? "Retrying..." : "Try Again"}
        </Button>
      </CardFooter>
    </Card>
  );
}

function BillingSettings() {
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
  if (billingQ.error) return <BillingError query={billingQ} />;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold flex items-center gap-2">
          <CircleDollarSign className="w-6 h-6" />
          Billing Information
        </CardTitle>
        <CardDescription>
          View your company&#39;s billing information.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6">
          <InfoField icon={Signature} label="Customer ID" value={billing?.customerId || "-"} />
          <InfoField icon={Signature} label="Subscription ID" value={billing?.subscriptionId || "-"} />
          <div className="col-span-1 md:col-span-2">
            <InfoField icon={Signature} label="Subscription Status" value={subscription2text(billing!.subscriptionStatus!)} />
          </div>
          <InfoField icon={Signature} label="Billing Start" value={billing?.billingStart ? formatDate(timestamp2date(billing?.billingStart), "MMMM do, yyyy") : "-"} />
          <InfoField icon={Signature} label="Billing End" value={billing?.billingEnd ? formatDate(timestamp2date(billing?.billingEnd), "MMMM do, yyyy") : "-"} />
        </div>
      </CardContent>
      <CardFooter>
        {!user.isLicensed && (
          <Button className="font-bold" size="sm" onClick={() => createCheckoutMu.mutate()}>
            <HandCoins className="h-4 w-4 mr-2" />
            Purchase Subscription and License
          </Button>
        )}
        {user.isLicensed && (
          <Button className="font-bold" size="sm" onClick={() => createPortalMu.mutate()}>
            <HandCoins className="h-4 w-4 mr-2" />
            Manage Subscription
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

function BillingSettingsSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-full mt-2" />
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6">
          <div>
            <Skeleton className="h-4 w-24 mb-1" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div>
            <Skeleton className="h-4 w-24 mb-1" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="col-span-2">
            <Skeleton className="h-4 w-24 mb-1" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div>
            <Skeleton className="h-4 w-24 mb-1" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div>
            <Skeleton className="h-4 w-24 mb-1" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Skeleton className="h-9 w-48" />
      </CardFooter>
    </Card>
  );
}

function BillingError({ query }: { query: UseQueryResult<GetCompanyBillingResponse, Error> }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold flex items-center gap-2">
          <CircleDollarSign className="w-6 h-6" />
          Billing Information
        </CardTitle>
        <CardDescription>
          There was an error loading your billing information.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center py-6 text-center">
          <div className="rounded-full bg-red-100 p-3 mb-4">
            <CircleDollarSign className="w-6 h-6 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-red-600 mb-2">
            Unable to Load Billing Information
          </h3>
          <p className="text-sm text-muted-foreground max-w-md">
            {query.error?.message || "Please try refreshing the page or contact support if the problem persists."}
          </p>
        </div>
      </CardContent>
      <CardFooter className="justify-center">
        <Button
          variant="outline"
          onClick={() => query.refetch()}
          className="font-bold"
        >
          Try Again
        </Button>
      </CardFooter>
    </Card>
  );
}

function InfoField({ icon: Icon, label, value }: { icon: ElementType; label: string; value?: string }) {
  return (
    <div>
      <Label className="text-sm font-bold flex items-center gap-2">
        <Icon className="w-4 h-4" />
        {label}
      </Label>
      <Input value={value} readOnly className="mt-1" />
    </div>
  );
}

