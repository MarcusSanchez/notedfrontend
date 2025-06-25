"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { listPatients } from "@/app/dashboard/(pages)/patients/actions";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { ListedPatientWithInfo, ListPatientsOrderBy } from "@/proto/patient_pb";
import { ChevronLeft, ChevronRight, Info, LoaderCircle, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { listPatientsOrderBy2text, service2text } from "@/lib/tools/enum2text";
import { match } from "ts-pattern";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import { timestamp2date } from "@/lib/tools/timestamp2date";
import { when } from "@/lib/utils";

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
    <>
      <div className="flex md:w-min gap-1 items-center bg-background text-muted-foreground text-xs sm:text-sm mb-4">
        <Info className="h-4 w-4" />
        <p className="md:text-nowrap">Due to patient privacy protection, first and last names must match exactly as recorded.</p>
      </div>

      <div className="flex flex-col xl:flex-row gap-2 xl:gap-4 mb-6">
        <SearchBar firstName={firstName} setFirstName={setFirstName} lastName={lastName} setLastName={setLastName} />
        <Filters
          orderBy={orderBy}
          setOrderBy={setOrderBy}
        />
      </div>
      <Card className="p-1 min-h-[495px]">
        {
          patientInfQ.isPending || (patientInfQ.isError && patientInfQ.isFetching)
            ? (
              <div className="flex justify-center items-center min-h-[545px] text-muted-foreground">
                <LoaderCircle className="animate-spin" size={24} />
              </div>
            )
            : patientInfQ.isError
              ? (
                <div className="flex flex-col gap-2 justify-center items-center min-h-[545px] text-muted-foreground">
                  <p className="text-center">Failed to query patients. Please try again later.</p>
                  <Button variant="outline" onClick={() => patientInfQ.refetch()}>Retry</Button>
                </div>
              )
              : patients.length > 0
                ? <PatientTable patients={patients} />
                : (
                  <div className="flex justify-center items-center min-h-[545px] text-muted-foreground">
                    <p>No Results Found</p>
                  </div>
                )
        }
      </Card>
      <Pagination
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalPages={totalPages}
      />
    </>
  );
}

type SearchBarProps = {
  firstName: string;
  setFirstName: (name: string) => void;
  lastName: string;
  setLastName: (name: string) => void;
};

export function SearchBar({ firstName, setFirstName, lastName, setLastName }: SearchBarProps) {
  return (
    <div className="flex flex-col md:flex-row gap-2 md:gap-4 flex-grow">
      <div className="relative flex-grow">
        <Label className="bg-background">First Name</Label>
        <div className="relative flex-grow">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by first name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>
      <div className="relative flex-grow">
        <Label className="bg-background">Last Name</Label>
        <div className="relative flex-grow">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by last name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>
    </div>
  );
}

type FiltersProps = {
  orderBy: ListPatientsOrderBy;
  setOrderBy: (orderBy: ListPatientsOrderBy) => void;
};

export function Filters({
  orderBy,
  setOrderBy
}: FiltersProps) {
  const changeOrderBy = (order: string) => {
    const newOrderBy = match(order)
      .with("Created (Oldest First)", () => ListPatientsOrderBy.CreatedAtAsc)
      .with("Created (Newest First)", () => ListPatientsOrderBy.CreatedAtDesc)
      .with("Last Monthly Talk (Oldest First)", () => ListPatientsOrderBy.LastMonthlyTalkAsc)
      .with("Last Monthly Talk (Newest First)", () => ListPatientsOrderBy.LastMonthlyTalkDesc)
      .otherwise(() => ListPatientsOrderBy.CreatedAtDesc);

    setOrderBy(newOrderBy);
  }

  return (
    <div className="flex flex-col md:flex-row gap-2 lg:gap-4">
      <div className="w-full xl:w-auto">
        <Label className="bg-background">Order By</Label>
        <Select value={listPatientsOrderBy2text(orderBy)} onValueChange={changeOrderBy}>
          <SelectTrigger className="w-full">
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
    </div>
  );
}

type PatientTableProps = { patients: ListedPatientWithInfo[] };

export function PatientTable({ patients }: PatientTableProps) {
  const router = useRouter();

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="text-xs sm:text-sm">First Name</TableHead>
          <TableHead className="text-xs sm:text-sm">Last Name</TableHead>
          <TableHead className="text-xs sm:text-sm">Service</TableHead>
          <TableHead className="text-xs sm:text-sm">Last Monthly Talk</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {patients.map((patient, i) => (
          <TableRow key={patient.id} className={`${when(i % 2 == 0, "bg-accent")} cursor-pointer`} onClick={() => router.push(`/dashboard/patients/${patient.id}`)}>
            <TableCell className="text-xs sm:text-sm border-t">{patient.firstName}</TableCell>
            <TableCell className="text-xs sm:text-sm border-t">{patient.lastName}</TableCell>
            <TableCell className="text-xs sm:text-sm border-t">
              {service2text(patient.service)} {patient.serviceCount > 1 ? `+ ${patient.serviceCount - 1} more` : ""}
            </TableCell>
            <TableCell className="text-xs sm:text-sm border-t">
              {patient?.lastMonthlyTalk && format(timestamp2date(patient?.lastMonthlyTalk), "MMM do, yyyy")}
              {!patient?.lastMonthlyTalk && "N/A"}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

type PaginationProps = {
  currentPage: number;
  setCurrentPage: (page: number) => void;
  totalPages?: number;
};

export function Pagination({ currentPage, setCurrentPage, totalPages }: PaginationProps) {
  return (
    <div className="flex items-center justify-between space-x-2 py-4">
      <Button
        variant="outline"
        size="sm"
        className="w-24"
        onClick={() => setCurrentPage(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <ChevronLeft className="h-4 w-4 mr-2" />
        Previous
      </Button>
      <p className="text-sm bg-background">
        Page {currentPage} {totalPages !== undefined && totalPages !== 0 && `of ${totalPages}`}
      </p>
      <Button
        variant="outline"
        size="sm"
        className="w-24"
        onClick={() => setCurrentPage(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next
        <ChevronRight className="h-4 w-4 ml-2" />
      </Button>
    </div>
  );
}
