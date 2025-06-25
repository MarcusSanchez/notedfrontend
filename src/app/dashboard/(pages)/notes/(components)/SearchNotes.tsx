"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { listNotes } from "@/app/dashboard/(pages)/notes/actions";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { ListedNote } from "@/proto/note_pb";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Info, LoaderCircle, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import { timestamp2date } from "@/lib/tools/timestamp2date";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn, when } from "@/lib/utils";
import { Timestamp } from "@bufbuild/protobuf";
import { useBreakpoints } from "@/hooks/use-breakpoints";

const pageSize = 12;

export function SearchNotes() {
  const router = useRouter();
  const params = useSearchParams();

  const [patientFirstName, setPatientFirstName] = useState(params.get("patientFirstName") ?? "");
  const [patientLastName, setPatientLastName] = useState(params.get("patientLastName") ?? "");
  const [nurseName, setNurseName] = useState(params.get("nurseName") ?? "");
  const [afterDate, setAfterDate] = useState<Date | undefined>(params.get("afterDate") ? new Date(params.get("afterDate")!) : undefined);
  const [beforeDate, setBeforeDate] = useState<Date | undefined>(params.get("beforeDate") ? new Date(params.get("beforeDate")!) : undefined);
  const [orderByAsc, setOrderByAsc] = useState(params.get("orderByAsc") === "true");
  const [currentPage, setCurrentPage] = useState(parseInt(params.get("page") ?? "1"));

  const [realPatientFirstName, setRealPatientFirstName] = useState(patientFirstName);
  const [realPatientLastName, setRealPatientLastName] = useState(patientLastName);
  const [realNurseName, setRealNurseName] = useState(nurseName);

  const previousFirstName = useRef(patientFirstName);
  const previousLastName = useRef(patientLastName);
  const previousNurseName = useRef(nurseName);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (
        previousFirstName.current !== patientFirstName ||
        previousLastName.current !== patientLastName ||
        previousNurseName.current !== nurseName
      ) {
        setCurrentPage(1);
        previousFirstName.current = patientFirstName;
        previousLastName.current = patientLastName;
        previousNurseName.current = nurseName;

        setRealPatientFirstName(patientFirstName);
        setRealPatientLastName(patientLastName);
        setRealNurseName(nurseName);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [patientFirstName, patientLastName, nurseName]);

  const notesQuery = useInfiniteQuery({
    queryKey: ["notesInfinite", realPatientFirstName, realPatientLastName, realNurseName, afterDate, beforeDate, orderByAsc, currentPage],
    initialPageParam: currentPage,
    queryFn: async ({ pageParam }) => {
      const response = await listNotes({
        patientFirstName: patientFirstName || undefined,
        patientLastName: patientLastName || undefined,
        nurseName: nurseName || undefined,
        afterDate: afterDate ? Timestamp.fromDate(afterDate).toJsonString() : undefined,
        beforeDate: beforeDate ? Timestamp.fromDate(beforeDate).toJsonString() : undefined,
        orderByAsc: orderByAsc,
        page: pageParam,
      });
      if (!response.success) throw response.error;
      return response.data;
    },
    getNextPageParam: (lastPage) => lastPage.nextPage,
    getPreviousPageParam: (firstPage) => (firstPage.page !== 1 ? firstPage.page - 1 : undefined),
  });

  const notes = notesQuery.data?.pages[0]?.notes ?? [];
  const totalPages = notesQuery.data?.pages[0]?.total && Math.ceil(notesQuery.data.pages[0].total / pageSize);

  const [initialLoad, setInitialLoad] = useState(true);
  useEffect(() => {
    if (initialLoad) return setInitialLoad(false);

    const newParams = new URLSearchParams();
    if (patientFirstName) newParams.set("patientFirstName", patientFirstName);
    if (patientLastName) newParams.set("patientLastName", patientLastName);
    if (nurseName) newParams.set("nurseName", nurseName);
    if (afterDate) newParams.set("afterDate", afterDate.toISOString());
    if (beforeDate) newParams.set("beforeDate", beforeDate.toISOString());
    if (orderByAsc) newParams.set("orderByAsc", orderByAsc.toString());
    if (currentPage > 1) newParams.set("page", currentPage.toString());

    router.replace(`/dashboard/notes?${newParams}`);
  }, [patientFirstName, patientLastName, nurseName, afterDate, beforeDate, orderByAsc, currentPage]);

  if (totalPages && currentPage > totalPages) setCurrentPage(totalPages);

  return (
    <>
      <div className="flex md:w-min gap-1 items-center bg-background text-muted-foreground text-xs sm:text-sm mb-4">
        <Info className="h-4 w-4" />
        <p className="md:text-nowrap">Due to patient privacy protection, patient first and last names must match exactly as recorded.</p>
      </div>

      <div className="flex flex-col xl:flex-row gap-2 xl:gap-4 mb-6">
        <SearchBar
          patientFirstName={patientFirstName}
          setPatientFirstName={setPatientFirstName}
          patientLastName={patientLastName}
          setPatientLastName={setPatientLastName}
          nurseName={nurseName}
          setNurseName={setNurseName}
        />
        <Filters
          afterDate={afterDate}
          setAfterDate={setAfterDate}
          beforeDate={beforeDate}
          setBeforeDate={setBeforeDate}
          orderByAsc={orderByAsc}
          setOrderByAsc={setOrderByAsc}
        />
      </div>
      <Card className="p-1 min-h-[495px]">
        {notesQuery.isPending || (notesQuery.isError && notesQuery.isFetching) ? (
          <div className="flex justify-center items-center min-h-[545px] text-muted-foreground">
            <LoaderCircle className="animate-spin" size={24} />
          </div>
        ) : notesQuery.isError ? (
          <div className="flex flex-col gap-2 justify-center items-center min-h-[545px] text-muted-foreground">
            <p className="text-center">Failed to query notes. Please try again later.</p>
            <Button variant="outline" onClick={() => notesQuery.refetch()}>Retry</Button>
          </div>
        ) : notes.length > 0 ? (
          <NoteTable notes={notes} />
        ) : (
          <div className="flex justify-center items-center min-h-[545px] text-muted-foreground">
            <p>No Results Found</p>
          </div>
        )}
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
  patientFirstName: string;
  setPatientFirstName: (name: string) => void;
  patientLastName: string;
  setPatientLastName: (name: string) => void;
  nurseName: string;
  setNurseName: (name: string) => void;
};

function SearchBar({
  patientFirstName,
  setPatientFirstName,
  patientLastName,
  setPatientLastName,
  nurseName,
  setNurseName
}: SearchBarProps) {
  return (
    <div className="flex flex-col md:flex-row gap-2 md:gap-4 flex-grow">
      <div className="flex flex-row gap-2 md:gap-4 flex-grow">
        <div className="relative flex-grow">
          <Label className="bg-background">Patient First Name</Label>
          <div className="relative flex-grow">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Patient first name"
              value={patientFirstName}
              onChange={(e) => setPatientFirstName(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>
        <div className="relative flex-grow">
          <Label className="bg-background">Patient Last Name</Label>
          <div className="relative flex-grow">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Patient last name"
              value={patientLastName}
              onChange={(e) => setPatientLastName(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>
      </div>
      <div className="relative flex-grow">
        <Label className="bg-background">Nurse Name</Label>
        <div className="relative flex-grow">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Nurse name"
            value={nurseName}
            onChange={(e) => setNurseName(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>
    </div>
  );
}

type FiltersProps = {
  afterDate: Date | undefined;
  setAfterDate: (date: Date | undefined) => void;
  beforeDate: Date | undefined;
  setBeforeDate: (date: Date | undefined) => void;
  orderByAsc: boolean;
  setOrderByAsc: (desc: boolean) => void;
};

function Filters({
  afterDate,
  setAfterDate,
  beforeDate,
  setBeforeDate,
  orderByAsc,
  setOrderByAsc
}: FiltersProps) {
  return (
    <div className="flex flex-col md:flex-row gap-2 lg:gap-4">
      <div className="flex flex-row gap-2 lg:gap-4 w-full">
        <div className="w-full xl:w-auto">
          <Label className="bg-background">After Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !afterDate && "text-muted-foreground"
                  )}
              >
                <CalendarIcon className="h-4 w-4" />
                {afterDate ? format(afterDate, "M/d/yyyy") : <span>Pick a Date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={afterDate}
                onSelect={setAfterDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        <div className="w-full xl:w-auto">
          <Label className="bg-background">Before Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !beforeDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="h-4 w-4" />
                {beforeDate ? format(beforeDate, "M/d/yyyy") : <span>Pick a Date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={beforeDate}
                onSelect={setBeforeDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <div className="w-full xl:w-auto">
        <Label className="bg-background">Order By</Label>
        <Select value={orderByAsc ? "asc" : "desc"} onValueChange={(value) => setOrderByAsc(value === "asc")}>
          <SelectTrigger className="w-full xl:w-[180px]">
            <SelectValue placeholder="Order By" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Order By</SelectLabel>
              <SelectItem value="desc">Newest First</SelectItem>
              <SelectItem value="asc">Oldest First</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

type NoteTableProps = { notes: ListedNote[] };

function NoteTable({ notes }: NoteTableProps) {
  const router = useRouter();
  const { isLG } = useBreakpoints();

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="text-xs sm:text-sm">Nurse</TableHead>
          <TableHead className="text-xs sm:text-sm">Patient</TableHead>
          {isLG && (
            <TableHead className="text-xs sm:text-sm">Date Created</TableHead>
          )}
          <TableHead className="text-xs sm:text-sm">Note&#39;s Date</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {notes.map((note, i) => (
          <TableRow key={note.id} className={`${when(i % 2 == 0, "bg-accent")} cursor-pointer`} onClick={() => router.push(`/dashboard/notes/${note.id}`)}>
            <TableCell className="text-xs sm:text-sm">{note.nurseName}</TableCell>
            <TableCell className="text-xs sm:text-sm">{note.patientFirstName} {note.patientLastName}</TableCell>
            {isLG && (
              <TableCell className="text-xs sm:text-sm">
                {note.createdAt ? format(timestamp2date(note.createdAt), "MMM do, yyyy") : "N/A"}
              </TableCell>
            )}
            <TableCell className="text-xs sm:text-sm">
              {note.date ? format(timestamp2date(note.date), isLG ? "MMM do, yyyy" : "M/d/yyyy") : "N/A"}
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

function Pagination({ currentPage, setCurrentPage, totalPages }: PaginationProps) {
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
      <p className = "text-sm bg-background">
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