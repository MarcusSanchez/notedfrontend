"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { listUsers } from "@/app/dashboard/(pages)/nurses/actions";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Role, Status, User } from "@/proto/user_pb";
import { ChevronLeft, ChevronRight, LoaderCircle, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { role2text, status2text } from "@/lib/tools/enum2text";
import { match } from "ts-pattern";
import { useBreakpoints } from "@/hooks/use-breakpoints";
import { Label } from "@/components/ui/label";
import { DashboardContainer } from "@/app/dashboard/(components)/DashboardContainer";
import { when } from "@/lib/utils";

const pageSize = 12;

export default function NurseManagement() {
  const router = useRouter();
  const params = useSearchParams();

  const [realQuery, setRealQuery] = useState(params.get("q") ?? "");
  const [inputQuery, setInputQuery] = useState(params.get("q") ?? "");
  const [statusFilter, setStatusFilter] = useState<Status>(parseInt(params.get("status") ?? "") || Status.UnspecifiedStatus);
  const [roleFilter, setRoleFilter] = useState<Role>(parseInt(params.get("status") ?? "") || Role.UnspecifiedRole);
  const [activeFilter, setActiveFilter] = useState<boolean | null>(null);
  const [currentPage, setCurrentPage] = useState(parseInt(params.get("page") ?? "1"));

  const previousQuery = useRef("");

  useEffect(() => {
    const timer = setTimeout(() => {
      if (previousQuery.current !== inputQuery) return;
      setCurrentPage(1);
      setRealQuery(inputQuery);
    }, 300);

    previousQuery.current = inputQuery;

    return () => clearTimeout(timer);
  }, [inputQuery]);

  const userInfQ = useInfiniteQuery({
    queryKey: ["usersInfinite", realQuery, statusFilter, roleFilter, currentPage, activeFilter],
    initialPageParam: currentPage,
    queryFn: async ({ pageParam }) => {
      const response = await listUsers({
        fullName: realQuery || undefined,
        status: [Status.Accepted, Status.Rejected].includes(statusFilter) ? statusFilter : undefined,
        role: [Role.Admin, Role.Nurse].includes(roleFilter) ? roleFilter : undefined,
        isActive: activeFilter !== null ? activeFilter : undefined,
        page: pageParam,
      });
      if (!response.success) throw response.error;
      return response.data;
    },
    getNextPageParam: (current) => current.nextPage,
    getPreviousPageParam: current => current.page !== 1 ? current.page - 1 : undefined,
  });

  const users = userInfQ.data?.pages[0]?.users ?? [];
  const totalPages = userInfQ.data?.pages.length && Math.ceil(userInfQ.data?.pages[0]?.total / pageSize);

  const [initialLoad, setInitialLoad] = useState(true);
  useEffect(() => {
    if (initialLoad) return setInitialLoad(false);

    const newParams = new URLSearchParams();
    if (inputQuery) newParams.set("q", inputQuery);
    if (statusFilter !== Status.UnspecifiedStatus) newParams.set("status", statusFilter.toString());
    if (roleFilter !== Role.UnspecifiedRole) newParams.set("role", roleFilter.toString());
    if (activeFilter !== null) newParams.set("active", activeFilter.toString());
    if (currentPage > 1) newParams.set("page", currentPage.toString());

    router.replace(`/dashboard/nurses?${newParams}`);
  }, [inputQuery, statusFilter, roleFilter, currentPage, activeFilter]);

  if (totalPages && currentPage > totalPages) setCurrentPage(totalPages);

  return (
    <DashboardContainer>
      <h1 className="w-min text-nowrap bg-background text-3xl font-bold mb-4">Nurse Management</h1>
      <div className="flex flex-col md:flex-row gap-2 md:gap-4 mb-6">
        <SearchBar inputQuery={inputQuery} setInputQuery={setInputQuery} />
        <Filters
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          roleFilter={roleFilter}
          setRoleFilter={setRoleFilter}
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
        />
      </div>
      <Card className="p-1 min-h-[545px]">
        {
          userInfQ.isPending || (userInfQ.isError && userInfQ.isFetching)
            ? (
              <div className="flex justify-center items-center min-h-[545px] text-muted-foreground">
                <LoaderCircle className="animate-spin" size={24} />
              </div>
            )
            : userInfQ.isError
              ? (
                <div className="flex flex-col gap-2 justify-center items-center min-h-[545px] text-muted-foreground">
                  <p className="text-center">Failed to query your company&#39;s users. Please try again later.</p>
                  <Button variant="outline" onClick={() => userInfQ.refetch()}>Retry</Button>
                </div>
              )
              : users.length > 0
                ? <NurseTable users={users} />
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
    </DashboardContainer>
  );
}

type SearchBarProps = {
  inputQuery: string;
  setInputQuery: (query: string) => void;
};

function SearchBar({ inputQuery, setInputQuery }: SearchBarProps) {
  return (
    <div className="relative flex-grow">
      <Label className="bg-background">Search</Label>
      <div className="relative flex-grow">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by full name"
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          className="pl-8"
        />
      </div>
    </div>
  );
}

type FiltersProps = {
  statusFilter: Status;
  setStatusFilter: (status: Status) => void;
  roleFilter: Role;
  setRoleFilter: (role: Role) => void;
  activeFilter: boolean | null;
  setActiveFilter: (filter: boolean | null) => void;
};

function Filters({
  statusFilter,
  setStatusFilter,
  roleFilter,
  setRoleFilter,
  activeFilter,
  setActiveFilter
}: FiltersProps) {
  const changeStatus = (status: string) => {
    const newStatus = match(status)
      .with("Accepted", () => Status.Accepted)
      .with("Rejected", () => Status.Rejected)
      .otherwise(() => Status.UnspecifiedStatus);

    setStatusFilter(newStatus);
  }

  const changeRole = (role: string) => {
    const newRole = match(role)
      .with("Nurse", () => Role.Nurse)
      .with("Admin", () => Role.Admin)
      .otherwise(() => Role.UnspecifiedRole);

    setRoleFilter(newRole);
  }

  const changeActiveFilter = (active: string) => {
    const newActive = match(active)
      .with("Active", () => true)
      .with("Inactive", () => false)
      .otherwise(() => null);

    setActiveFilter(newActive);
  }

  return (
    <div className="flex gap-4">
      <div className="w-full">
        <Label className="bg-background">Status</Label>
        <Select defaultValue="All" value={status2text(statusFilter)} onValueChange={changeStatus}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Status</SelectLabel>
              <SelectItem value="All">All</SelectItem>
              <SelectItem value="Accepted">Accepted</SelectItem>
              <SelectItem value="Rejected">Rejected</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div className="w-full">
        <Label className="bg-background">Role</Label>
        <Select defaultValue="All" value={role2text(roleFilter)} onValueChange={changeRole}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Role" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Role</SelectLabel>
              <SelectItem value="All">All</SelectItem>
              <SelectItem value="Nurse">Nurse</SelectItem>
              <SelectItem value="Admin">Admin</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div className="w-full">
        <Label className="bg-background">Active</Label>
        <Select defaultValue="All" value={activeFilter === null ? "All" : activeFilter ? "Active" : "Inactive"} onValueChange={changeActiveFilter}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Active" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Active</SelectLabel>
              <SelectItem value="All">All</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Inactive">Inactive</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

type NurseTableProps = { users: User[] };

function NurseTable({ users }: NurseTableProps) {
  const router = useRouter();
  const { isSM } = useBreakpoints();

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Full Name</TableHead>
          {isSM && <TableHead>Role</TableHead>}
          <TableHead>Active</TableHead>
          <TableHead className="pr-9">Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user, i) => (
          <TableRow key={user.id} className={`${when(i % 2 == 0, "bg-accent")} cursor-pointer`} onClick={() => router.push(`/dashboard/nurses/${user.id}`)}>
            <TableCell className="font-medium">{user.name}</TableCell>
            {isSM && <TableCell>{role2text(user.role)}</TableCell>}
            <TableCell className="">{user.isActive ? "Active" : "Inactive"}</TableCell>
            <TableCell className="flex items-center">
              <div className="w-[4.5rem] h-full flex justify-center items-center">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    user.status === Status.Accepted
                      ? "bg-green-100 text-green-800"
                      : user.status === Status.Pending
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                  }`}
                >
                  {status2text(user.status)}
                </span>
              </div>
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