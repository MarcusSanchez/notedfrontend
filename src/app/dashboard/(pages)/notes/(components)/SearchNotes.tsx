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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import {
  Search,
  Info,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  RefreshCw,
  FileText,
  Calendar as CalendarIcon, Eye, Filter,
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useRouter, useSearchParams } from 'next/navigation';
import { useInfiniteQuery } from "@tanstack/react-query";
import { listNotes } from "@/app/dashboard/(pages)/notes/actions";
import { Timestamp } from "@bufbuild/protobuf";
import { ListedNote } from "@/proto/note_pb";
import { timestamp2date } from "@/lib/tools/timestamp2date";

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
    <div className="space-y-6">
      {/* Privacy Notice */}
      <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <Info className="h-5 w-5 text-blue-600 flex-shrink-0" />
        <p className="text-sm text-blue-800">
          Due to patient privacy protection, patient first and last names must match exactly as recorded.
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
          <div className="flex flex-col space-y-4">
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
        </CardContent>
      </Card>

      {/* Results */}
      <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <CardTitle className="text-xl font-semibold text-gray-900">
                Note Records
              </CardTitle>
              <CardDescription className="text-gray-600">
                {notes.length} note{notes.length !== 1 ? 's' : ''} found
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {notesQuery.isPending ? (
            <NoteTableSkeleton />
          ) : notesQuery.isError ? (
            <NoteTableError onRetry={notesQuery.refetch} />
          ) : notes.length > 0 ? (
            <NoteTable notes={notes} />
          ) : (
            <EmptyState />
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {!notesQuery.isPending && !notesQuery.isError && notes.length > 0 && (
        <Pagination
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalPages={totalPages!}
        />
      )}
    </div>
  );
}


function SearchBar({
  patientFirstName,
  setPatientFirstName,
  patientLastName,
  setPatientLastName,
  nurseName,
  setNurseName
}: {
  patientFirstName: string;
  setPatientFirstName: (name: string) => void;
  patientLastName: string;
  setPatientLastName: (name: string) => void;
  nurseName: string;
  setNurseName: (name: string) => void;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="space-y-2">
        <Label className="text-sm font-medium text-gray-700">Patient First Name</Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            placeholder="Search by first name..."
            value={patientFirstName}
            onChange={(e) => setPatientFirstName(e.target.value)}
            className="pl-10 border-gray-300 focus:border-blue-400 focus:ring-blue-400/20 bg-white/80"
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label className="text-sm font-medium text-gray-700">Patient Last Name</Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            placeholder="Search by last name..."
            value={patientLastName}
            onChange={(e) => setPatientLastName(e.target.value)}
            className="pl-10 border-gray-300 focus:border-blue-400 focus:ring-blue-400/20 bg-white/80"
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label className="text-sm font-medium text-gray-700">Nurse Name</Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            placeholder="Search by nurse name..."
            value={nurseName}
            onChange={(e) => setNurseName(e.target.value)}
            className="pl-10 border-gray-300 focus:border-blue-400 focus:ring-blue-400/20 bg-white/80"
          />
        </div>
      </div>
    </div>
  );
}

function Filters({
  afterDate,
  setAfterDate,
  beforeDate,
  setBeforeDate,
  orderByAsc,
  setOrderByAsc
}: {
  afterDate: Date | undefined;
  setAfterDate: (date: Date | undefined) => void;
  beforeDate: Date | undefined;
  setBeforeDate: (date: Date | undefined) => void;
  orderByAsc: boolean;
  setOrderByAsc: (asc: boolean) => void;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="space-y-2">
        <Label className="text-sm font-medium text-gray-700">After Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal border-gray-300 focus:border-blue-400 focus:ring-blue-400/20",
                !afterDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {afterDate ? format(afterDate, "M/d/yyyy") : <span>Pick a date</span>}
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

      <div className="space-y-2">
        <Label className="text-sm font-medium text-gray-700">Before Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal border-gray-300 focus:border-blue-400 focus:ring-blue-400/20",
                !beforeDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {beforeDate ? format(beforeDate, "M/d/yyyy") : <span>Pick a date</span>}
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

      <div className="space-y-2">
        <Label className="text-sm font-medium text-gray-700">Order By</Label>
        <Select value={orderByAsc ? "asc" : "desc"} onValueChange={(value) => setOrderByAsc(value === "asc")}>
          <SelectTrigger className="border-gray-300 focus:border-blue-400 focus:ring-blue-400/20 bg-white/80">
            <SelectValue />
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

function NoteTable({ notes, }: { notes: ListedNote[]; }) {
  const router = useRouter();

  return (
    <div className="overflow-hidden">
      <Table>
        <TableHeader className="bg-gray-50/80">
          <TableRow>
            <TableHead className="pl-6 py-4 text-gray-900 font-semibold">Nurse</TableHead>
            <TableHead className="text-gray-900 font-semibold">Patient</TableHead>
            <TableHead className="text-gray-900 font-semibold hidden lg:table-cell">Date Created</TableHead>
            <TableHead className="text-gray-900 font-semibold">Note's Date</TableHead>
            <TableHead className="text-right pr-6 text-gray-900 font-semibold">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {notes.map((note, index) => (
            <TableRow
              key={note.id}
              className={`cursor-pointer hover:bg-blue-50/50 transition-colors ${
                index % 2 === 0 ? 'bg-white/50' : 'bg-gray-50/30'
              }`}
              onClick={() => router.push(`/dashboard/notes/${note.id}`)}
            >
              <TableCell className="pl-6 py-4 font-medium text-gray-900">
                {note.nurseName}
              </TableCell>
              <TableCell className="font-medium text-gray-900">
                {note.patientFirstName} {note.patientLastName}
              </TableCell>
              <TableCell className="text-gray-700 hidden lg:table-cell">
                {note.createdAt && format(timestamp2date(note.createdAt), "MMM do, yyyy")}
              </TableCell>
              <TableCell className="text-gray-700">
                {note.date && format(timestamp2date(note.date), "MMM do, yyyy")}
              </TableCell>
              <TableCell className="text-gray-700">
                <div className="flex items-center justify-end space-x-2 mr-4">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/dashboard/notes/${note.id}`);
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

// Skeleton Component
function NoteTableSkeleton() {
  return (
    <div className="p-6">
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-28 hidden lg:block" />
            <Skeleton className="h-4 w-28" />
          </div>
        ))}
      </div>
    </div>
  );
}

// Error Component
function NoteTableError({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="text-center py-12 px-6">
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <AlertCircle className="w-8 h-8 text-red-600" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">Failed to load notes</h3>
      <p className="text-gray-600 mb-4">There was an error loading the note data.</p>
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
        <FileText className="w-8 h-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">No notes found</h3>
      <p className="text-gray-600 mb-4">
        Try adjusting your search criteria or create a new note record.
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