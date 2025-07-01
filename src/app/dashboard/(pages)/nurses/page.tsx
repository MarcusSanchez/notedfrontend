"use client";

import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Users,
  Filter,
  AlertCircle,
  RefreshCw,
  Eye,
  MoreHorizontal,
  UserCheck,
  UserX, Stethoscope
} from 'lucide-react';
import { Role, User } from '@/proto/user_pb';
import { Status } from '@/proto/user_pb';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { getUsersStats, listUsers } from './actions';
import { role2text, status2text } from "@/lib/tools/enum2text";
import { fn } from "@/lib/utils";

const pageSize = 12;

const NurseManagement = () => {
  const router = useRouter();
  const params = useSearchParams();

  const [realQuery, setRealQuery] = useState(params.get("q") ?? "");
  const [inputQuery, setInputQuery] = useState(params.get("q") ?? "");
  const [statusFilter, setStatusFilter] = useState<Status>(parseInt(params.get("status") ?? "") || Status.UnspecifiedStatus);
  const [roleFilter, setRoleFilter] = useState<Role>(parseInt(params.get("status") ?? "") || Role.UnspecifiedRole);
  const [activeFilter, setActiveFilter] = useState<boolean | null>(null);
  const [currentPage, setCurrentPage] = useState(parseInt(params.get("page") ?? "1"));

  const previousQuery = useRef("");

  const userStatsQ = useQuery({
    queryKey: ["userStats"],
    queryFn: fn(() => getUsersStats()),
  });
  const stats = userStatsQ.data;

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
  const totalItems = userInfQ.data?.pages[0]?.total ?? 0;

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
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent pb-2">
            Nurse Management
          </h1>
          <p className="text-gray-600 text-lg">
            Manage your healthcare team members and their access permissions
          </p>
        </div>

        {/*<div className="flex items-center space-x-3">*/}
        {/*  <Button*/}
        {/*    variant="outline"*/}
        {/*    className="border-blue-200 text-blue-600 hover:bg-blue-50"*/}
        {/*  >*/}
        {/*    <Plus className="w-4 h-4 mr-2" />*/}
        {/*    Invite Nurse*/}
        {/*  </Button>*/}
        {/*  <Button*/}
        {/*    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg"*/}
        {/*  >*/}
        {/*    <UserCog className="w-4 h-4 mr-2" />*/}
        {/*    Bulk Actions*/}
        {/*  </Button>*/}
        {/*</div>*/}
      </div>

      {/* Stats Cards */}
      {userStatsQ.isError ? (
        <StatsCardsError onRetry={userStatsQ.refetch} />
      ) : userStatsQ.isPending || !stats ? (
        <StatsCardsSkeleton />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total Users"
            value={stats.totalUsers}
            icon={Users}
            color="blue"
          />
          <StatsCard
            title="Total Nurses"
            value={stats.totalNurses}
            icon={Stethoscope}
            color="purple"
          />
          <StatsCard
            title="Active Users"
            value={stats.totalActiveUsers}
            icon={UserCheck}
            color="green"
          />
          <StatsCard
            title="Inactive Users"
            value={stats.totalInactiveUsers}
            icon={UserX}
            color="red"
          />
        </div>
      )}

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
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
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
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <CardTitle className="text-xl font-semibold text-gray-900">
                  Team Members
                </CardTitle>
                <p className="text-sm text-gray-500">
                  {totalItems} user{totalItems !== 1 ? 's' : ''} found
                </p>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {userInfQ.isPending ? (
            <UsersTableSkeleton />
          ) : userInfQ.isError ? (
            <UsersTableError onRetry={userInfQ.refetch} />
          ) : users.length > 0 ? (
            <UsersTable users={users} />
          ) : (
            <EmptyState />
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {!userInfQ.isPending && !userInfQ.isError && users.length > 0 && (
        <Pagination
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalPages={totalPages!}
        />
      )}
    </div>
  );
};

const StatsCard = ({
  title,
  value,
  icon: Icon,
  color,
}: {
  title: string;
  value: number;
  icon: React.ElementType;
  color: 'blue' | 'green' | 'purple' | 'red';
}) => {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    red: 'bg-red-100 text-red-600'
  };

  return (
    <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className={`w-12 h-12 rounded-xl ${colorClasses[color]} flex items-center justify-center`}>
            <Icon className="w-6 h-6" />
          </div>
        </div>
        <div className="space-y-1">
          <h3 className="text-sm font-medium text-gray-600">{title}</h3>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
};

const SearchBar = ({
  inputQuery,
  setInputQuery
}: {
  inputQuery: string;
  setInputQuery: (query: string) => void;
}) => {
  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium text-gray-700">Search</Label>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <Input
          placeholder="Search by full name..."
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          className="pl-10 border-gray-300 focus:border-blue-400 focus:ring-blue-400/20 bg-white/80"
        />
      </div>
    </div>
  );
};

const Filters = ({
  statusFilter,
  setStatusFilter,
  roleFilter,
  setRoleFilter,
  activeFilter,
  setActiveFilter
}: {
  statusFilter: Status;
  setStatusFilter: (status: Status) => void;
  roleFilter: Role;
  setRoleFilter: (role: Role) => void;
  activeFilter: boolean | null;
  setActiveFilter: (filter: boolean | null) => void;
}) => {
  const changeStatus = (status: string) => {
    const statusMap: { [key: string]: Status } = {
      'Accepted': Status.Accepted,
      'Rejected': Status.Rejected,
      'All': Status.UnspecifiedStatus
    };
    setStatusFilter(statusMap[status] || Status.UnspecifiedStatus);
  };

  const changeRole = (role: string) => {
    const roleMap: { [key: string]: Role } = {
      'Admin': Role.Admin,
      'Nurse': Role.Nurse,
      'All': Role.UnspecifiedRole
    };
    setRoleFilter(roleMap[role] || Role.UnspecifiedRole);
  };

  const changeActiveFilter = (active: string) => {
    const activeMap: { [key: string]: boolean | null } = {
      'Active': true,
      'Inactive': false,
      'All': null
    };
    setActiveFilter(activeMap[active] ?? null);
  };

  return (
    <>
      <div className="space-y-2">
        <Label className="text-sm font-medium text-gray-700">Status</Label>
        <Select value={status2text(statusFilter)} onValueChange={changeStatus}>
          <SelectTrigger className="border-gray-300 focus:border-blue-400 focus:ring-blue-400/20 bg-white/80">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Status</SelectLabel>
              <SelectItem value="All">All</SelectItem>
              <SelectItem value="Accepted">Accepted</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Rejected">Rejected</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium text-gray-700">Role</Label>
        <Select value={role2text(roleFilter)} onValueChange={changeRole}>
          <SelectTrigger className="border-gray-300 focus:border-blue-400 focus:ring-blue-400/20 bg-white/80">
            <SelectValue placeholder="Role" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Role</SelectLabel>
              <SelectItem value="All">All</SelectItem>
              <SelectItem value="Admin">Admin</SelectItem>
              <SelectItem value="Nurse">Nurse</SelectItem>
              <SelectItem value="Manager">Manager</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium text-gray-700">Active Status</Label>
        <Select
          value={activeFilter === null ? "All" : activeFilter ? "Active" : "Inactive"}
          onValueChange={changeActiveFilter}
        >
          <SelectTrigger className="border-gray-300 focus:border-blue-400 focus:ring-blue-400/20 bg-white/80">
            <SelectValue placeholder="Active" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Active Status</SelectLabel>
              <SelectItem value="All">All</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Inactive">Inactive</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </>
  );
};

const UsersTable = ({ users }: { users: User[] }) => {
  const router = useRouter();

  const getStatusBadge = (status: string) => {
    const statusClasses = {
      'Accepted': 'bg-green-100 text-green-800 border-green-200',
      'Pending': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'Rejected': 'bg-red-100 text-red-800 border-red-200'
    };

    return (
      <Badge variant="outline" className={`${statusClasses[status as keyof typeof statusClasses]} border font-medium`}>
        {status}
      </Badge>
    );
  };

  const getRoleBadge = (role: string) => {
    const roleClasses = {
      'Admin': 'bg-purple-100 text-purple-800 border-purple-200',
      'Nurse': 'bg-blue-100 text-blue-800 border-blue-200',
      'Manager': 'bg-indigo-100 text-indigo-800 border-indigo-200'
    };

    return (
      <Badge variant="outline" className={`${roleClasses[role as keyof typeof roleClasses]} border font-medium`}>
        {role}
      </Badge>
    );
  };

  return (
    <div className="overflow-hidden">
      {/* Desktop Table */}
      <div className="hidden md:block">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50/80 border-b border-gray-200">
            <tr>
              <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">User</th>
              <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">Role</th>
              <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">Status</th>
              <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">Active</th>
              <th className="text-right py-4 px-6 text-sm font-semibold text-gray-900">Actions</th>
            </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
            {users.map((user, index) => (
              <tr
                key={user.id}
                className={`hover:bg-blue-50/50 transition-colors cursor-pointer ${
                  index % 2 === 0 ? 'bg-white/50' : 'bg-gray-50/30'
                }`}
                onClick={() => router.push(`/dashboard/nurses/${user.id}`)}
              >
                <td className="py-4 px-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-semibold">
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{user.name}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-6">
                  {getRoleBadge(role2text(user.role))}
                </td>
                <td className="py-4 px-6">
                  {getStatusBadge(status2text(user.status))}
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${user.isActive ? 'bg-green-500' : 'bg-gray-400'}`} />
                    <span className={`text-sm font-medium ${user.isActive ? 'text-green-700' : 'text-gray-500'}`}>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </span>
                  </div>
                </td>

                <td className="py-4 px-6 text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/dashboard/nurses/${user.id}`);
                      }}
                      className="border-blue-200 text-blue-600 hover:bg-blue-50"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4 p-4">
        {users.map((user) => (
          <Card
            key={user.id}
            className="cursor-pointer hover:shadow-md transition-all duration-200 bg-white/80 backdrop-blur-sm"
            onClick={() => router.push(`/dashboard/nurses/${user.id}`)}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-semibold">
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{user.name}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                </div>
                <Button size="sm" variant="ghost">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {getRoleBadge(role2text(user.role))}
                  {getStatusBadge(status2text(user.status))}
                </div>
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${user.isActive ? 'bg-green-500' : 'bg-gray-400'}`} />
                  <span className={`text-sm font-medium ${user.isActive ? 'text-green-700' : 'text-gray-500'}`}>
                    {user.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

const StatsCardsSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
    {[...Array(4)].map((_, i) => (
      <Card key={i} className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <Skeleton className="w-12 h-12 rounded-xl" />
          </div>
          <div className="space-y-1">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-3 w-20" />
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
);

const StatsCardsError = ({ onRetry }: { onRetry: () => void }) => (
  <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm border-red-200">
    <CardContent className="p-8 text-center">
      <div className="flex items-center justify-center mb-4">
        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
          <AlertCircle className="w-6 h-6 text-red-600" />
        </div>
      </div>
      <h3 className="text-lg font-semibold text-red-900 mb-2">Failed to load statistics</h3>
      <p className="text-red-600 mb-4">There was an error loading the user statistics.</p>
      <Button onClick={onRetry} variant="outline" className="border-red-200 text-red-600 hover:bg-red-50">
        <RefreshCw className="w-4 h-4 mr-2" />
        Try Again
      </Button>
    </CardContent>
  </Card>
);

const UsersTableSkeleton = () => (
  <div className="p-6">
    <div className="space-y-4">
      {Array.from({ length: 5 }).map((_, index) => (
        <div key={index} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
          <Skeleton className="w-10 h-10 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-48" />
          </div>
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-8 w-16 rounded-md" />
        </div>
      ))}
    </div>
  </div>
);

const UsersTableError = ({ onRetry }: { onRetry: () => void }) => (
  <div className="text-center py-12 px-6">
    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
      <AlertCircle className="w-8 h-8 text-red-600" />
    </div>
    <h3 className="text-lg font-semibold text-gray-900 mb-2">Failed to load users</h3>
    <p className="text-gray-600 mb-4">There was an error loading the user data.</p>
    <Button onClick={onRetry} variant="outline" className="border-red-200 text-red-600 hover:bg-red-50">
      <RefreshCw className="w-4 h-4 mr-2" />
      Try Again
    </Button>
  </div>
);

const EmptyState = () => (
  <div className="text-center py-12 px-6">
    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
      <Users className="w-8 h-8 text-gray-400" />
    </div>
    <h3 className="text-lg font-semibold text-gray-900 mb-2">No users found</h3>
    <p className="text-gray-600 mb-4">Try adjusting your search criteria or filters.</p>
    {/*<Button variant="outline">*/}
    {/*  <Plus className="w-4 h-4 mr-2" />*/}
    {/*  Invite New User*/}
    {/*</Button>*/}
  </div>
);

const Pagination = ({
  currentPage,
  setCurrentPage,
  totalPages,
}: {
  currentPage: number;
  setCurrentPage: (page: number) => void;
  totalPages: number;
}) => {
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
};

export default NurseManagement;
