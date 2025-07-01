"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Filter,
  Search,
  Info,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  RefreshCw,
  Users, Eye
} from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ListedPatientWithInfo, ListPatientsOrderBy } from '@/proto/patient_pb';
import { useInfiniteQuery } from "@tanstack/react-query";
import { listPatients } from "@/app/dashboard/(pages)/patients/actions";
import { listPatientsOrderBy2text, service2text } from '@/lib/tools/enum2text';
import { timestamp2date } from "@/lib/tools/timestamp2date";

const pageSize = 12;

export function SearchPatients() {
  const router = useRouter();
  const params = useSearchParams();

  const [realFirstName, setRealFirstName] = useState(params.get("firstName") ?? "");
  const [firstName, setFirstName] = useState(params.get("firstName") ?? "");
  const [realLastName, setRealLastName] = useState(params.get("lastName") ?? "");
  const [lastName, setLastName] = useState(params.get("lastName") ?? "");
  const [orderBy, setOrderBy] = useState<ListPatientsOrderBy>(parseInt(params.get("orderBy") ?? "") || ListPatientsOrderBy.CreatedAtDesc);
  const [currentPage, setCurrentPage] = useState(parseInt(params.get("page") ?? "1"));

  const previousFirstName = useRef("");
  const previousLastName = useRef("");

  useEffect(() => {
    const timer = setTimeout(() => {
      if (previousFirstName.current !== firstName || previousLastName.current !== lastName) return;
      setCurrentPage(1);
      setRealFirstName(firstName);
      setRealLastName(lastName);
    }, 300);

    previousFirstName.current = firstName;
    previousLastName.current = lastName;

    return () => clearTimeout(timer);
  }, [firstName, lastName]);

  const patientInfQ = useInfiniteQuery({
    queryKey: ["patientsInfinite", realFirstName, realLastName, orderBy, currentPage],
    initialPageParam: currentPage,
    queryFn: async ({ pageParam }) => {
      const response = await listPatients({
        firstName: realFirstName || undefined,
        lastName: realLastName || undefined,
        orderBy: orderBy,
        page: pageParam,
      });
      if (!response.success) throw response.error;
      return response.data;
    },
    getNextPageParam: (current) => current.nextPage,
    getPreviousPageParam: current => current.page !== 1 ? current.page - 1 : undefined,
  });

  const patients = patientInfQ.data?.pages[0]?.patients ?? [];
  const totalPages = patientInfQ.data?.pages.length && Math.ceil(patientInfQ.data?.pages[0]?.total / pageSize);

  const [initialLoad, setInitialLoad] = useState(true);
  useEffect(() => {
    if (initialLoad) return setInitialLoad(false);

    const newParams = new URLSearchParams();
    if (firstName) newParams.set("firstName", firstName);
    if (lastName) newParams.set("lastName", lastName);
    if (orderBy !== ListPatientsOrderBy.CreatedAtDesc) newParams.set("orderBy", orderBy.toString());
    if (currentPage > 1) newParams.set("page", currentPage.toString());

    router.replace(`/dashboard/patients?${newParams}`);
  }, [firstName, lastName, orderBy, currentPage]);

  if (totalPages && currentPage > totalPages) setCurrentPage(totalPages);

  return (
    <div className="space-y-6">
      {/* Privacy Notice */}
      <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <Info className="h-5 w-5 text-blue-600 flex-shrink-0" />
        <p className="text-sm text-blue-800">
          Due to patient privacy protection, first and last names must match exactly as recorded.
        </p>
      </div>

      {/* Search and Filters */}
      <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Filter className="w-5 h-5 text-blue-600" />
            </div>
            <CardTitle className="text-xl font-semibold text-gray-900">
              Search & Filter
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex flex-col xl:flex-row gap-4">
            <SearchBar
              firstName={firstName}
              setFirstName={setFirstName}
              lastName={lastName}
              setLastName={setLastName}
            />
            <Filters orderBy={orderBy} setOrderBy={setOrderBy} />
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <CardTitle className="text-xl font-semibold text-gray-900">
                Patient Records
              </CardTitle>
              <CardDescription className="text-gray-600">
                {patients.length} patient{patients.length !== 1 ? 's' : ''} found
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {patientInfQ.isPending ? (
            <PatientTableSkeleton />
          ) : patientInfQ.isError ? (
            <PatientTableError onRetry={patientInfQ.refetch} />
          ) : patients.length > 0 ? (
            <PatientTable patients={patients} />
          ) : (
            <EmptyState />
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {!patientInfQ.isPending && !patientInfQ.isError && patients.length > 0 && totalPages !== undefined && (
        <Pagination
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalPages={totalPages}
        />
      )}
    </div>
  );
}

function SearchBar({
  firstName,
  setFirstName,
  lastName,
  setLastName
}: {
  firstName: string;
  setFirstName: (name: string) => void;
  lastName: string;
  setLastName: (name: string) => void;
}) {
  return (
    <div className="flex flex-col md:flex-row gap-4 flex-grow">
      <div className="flex-grow space-y-2">
        <Label className="text-sm font-medium text-gray-700">First Name</Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            placeholder="Search by first name..."
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="pl-10 border-gray-300 focus:border-blue-400 focus:ring-blue-400/20 bg-white/80"
          />
        </div>
      </div>
      <div className="flex-grow space-y-2">
        <Label className="text-sm font-medium text-gray-700">Last Name</Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            placeholder="Search by last name..."
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="pl-10 border-gray-300 focus:border-blue-400 focus:ring-blue-400/20 bg-white/80"
          />
        </div>
      </div>
    </div>
  );
}

function Filters({
  orderBy,
  setOrderBy
}: {
  orderBy: ListPatientsOrderBy;
  setOrderBy: (orderBy: ListPatientsOrderBy) => void;
}) {
  const changeOrderBy = (order: string) => {
    const orderMap: { [key: string]: ListPatientsOrderBy } = {
      'Created (Oldest First)': ListPatientsOrderBy.CreatedAtAsc,
      'Created (Newest First)': ListPatientsOrderBy.CreatedAtDesc,
      'Last Monthly Talk (Oldest First)': ListPatientsOrderBy.LastMonthlyTalkAsc,
      'Last Monthly Talk (Newest First)': ListPatientsOrderBy.LastMonthlyTalkDesc
    };
    setOrderBy(orderMap[order] || ListPatientsOrderBy.CreatedAtDesc);
  };

  return (
    <div className="w-full xl:w-auto space-y-2">
      <Label className="text-sm font-medium text-gray-700">Order By</Label>
      <Select value={listPatientsOrderBy2text(orderBy)} onValueChange={changeOrderBy}>
        <SelectTrigger className="w-full xl:w-[280px] border-gray-300 focus:border-blue-400 focus:ring-blue-400/20 bg-white/80">
          <SelectValue placeholder="Order By" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Order By</SelectLabel>
            <SelectItem value="Created (Newest First)">Created (Newest First)</SelectItem>
            <SelectItem value="Created (Oldest First)">Created (Oldest First)</SelectItem>
            <SelectItem value="Last Monthly Talk (Newest First)">Last Monthly Talk (Newest First)</SelectItem>
            <SelectItem value="Last Monthly Talk (Oldest First)">Last Monthly Talk (Oldest First)</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}

function PatientTable({ patients, }: { patients: ListedPatientWithInfo[]; }) {
  const router = useRouter();

  return (
    <div className="overflow-hidden">
      <Table>
        <TableHeader className="bg-gray-50/80">
          <TableRow>
            <TableHead className="pl-6 py-4 text-gray-900 font-semibold">First Name</TableHead>
            <TableHead className="text-gray-900 font-semibold">Last Name</TableHead>
            <TableHead className="max-md:hidden text-gray-900 font-semibold">Service</TableHead>
            <TableHead className="max-md:hidden text-gray-900 font-semibold">Last Monthly Talk</TableHead>
            <TableHead className="text-right pr-6 text-gray-900 font-semibold">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {patients.map((patient, index) => (
            <TableRow
              key={patient.id}
              className={`cursor-pointer hover:bg-blue-50/50 transition-colors ${
                index % 2 === 0 ? 'bg-white/50' : 'bg-gray-50/30'
              }`}
              onClick={() => router.push(`/dashboard/patients/${patient.id}`)}
            >
              <TableCell className="pl-6 py-6 font-medium text-gray-900">
                {patient.firstName}
              </TableCell>
              <TableCell className="font-medium text-gray-900">
                {patient.lastName}
              </TableCell>
              <TableCell className="max-md:hidden text-gray-700">
                {service2text(patient.service)}
                {patient.serviceCount > 1 && (
                  <span className="text-gray-500 ml-1">
                    + {patient.serviceCount - 1} more
                  </span>
                )}
              </TableCell>
              <TableCell className="max-md:hidden text-gray-700">
                {patient.lastMonthlyTalk
                  ? patient.lastMonthlyTalk && timestamp2date(patient.lastMonthlyTalk).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                })
                  : 'N/A'
                }
              </TableCell>
              <TableCell className="text-gray-700">
                <div className="flex items-center justify-end space-x-2 mr-4">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/dashboard/patients/${patient.id}`);
                    }}
                    className="border-blue-200 text-blue-600 hover:bg-blue-50"
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    View
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function PatientTableSkeleton() {
  return (
    <div className="p-6">
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-28" />
          </div>
        ))}
      </div>
    </div>
  );
}

function PatientTableError({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="text-center py-12 px-6">
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <AlertCircle className="w-8 h-8 text-red-600" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">Failed to load patients</h3>
      <p className="text-gray-600 mb-4">There was an error loading the patient data.</p>
      <Button onClick={onRetry} variant="outline" className="border-red-200 text-red-600 hover:bg-red-50">
        <RefreshCw className="w-4 h-4 mr-2" />
        Try Again
      </Button>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="text-center py-16 px-6">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <Users className="w-8 h-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">No patients found</h3>
      <p className="text-gray-600 mb-4">
        Try adjusting your search criteria or create a new patient record.
      </p>
    </div>
  );
}

function Pagination({
  currentPage,
  setCurrentPage,
  totalPages
}: {
  currentPage: number;
  setCurrentPage: (page: number) => void;
  totalPages: number;
}) {
  return (
    <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="border-gray-300"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>

          <p className="text-sm text-gray-600">
            Page {currentPage} {totalPages > 0 && `of ${totalPages}`}
          </p>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="border-gray-300"
          >
            Next
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}