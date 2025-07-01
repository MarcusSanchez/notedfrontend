"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  UserPlus,
  UserCheck,
  Trash2,
  Search,
} from 'lucide-react';
import { User } from "@/proto/user_pb";
import { PartialPatient } from "@/proto/user_pb";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fn } from "@/lib/utils";
import {
  assignPatientToNurse,
  listPatientsNotAssignedToNurse,
  unassignPatientToNurse
} from "@/app/dashboard/(pages)/nurses/[id]/actions";

interface AssignedPatientsProps {
  user: User;
  patients: PartialPatient[];
  isLoading: boolean;
}

export function AssignedPatients({ user, patients, isLoading, }: AssignedPatientsProps) {
  const qc = useQueryClient();

  const unassignPatientMu = useMutation({
    mutationKey: ["unassignPatient"],
    mutationFn: async (patientID: string) => await fn(() => unassignPatientToNurse({
      nurseId: user.id,
      patientId: patientID
    }))(),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["unassignedPatients", user.id] });
      qc.invalidateQueries({ queryKey: ["getUser", user.id], });
    },
  });

  if (isLoading) return <AssignedPatientsSkeleton />;

  return (
    <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader className="border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <UserCheck className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <CardTitle className="text-xl font-semibold text-gray-900">
                Assigned Patients
              </CardTitle>
              <CardDescription className="text-gray-600">
                List of patients under {user.name}'s care
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <AssignPatientDialog user={user} />
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {patients.length > 0 ? (
          <div className="overflow-hidden">
            <Table>
              <TableHeader className="bg-gray-50/80">
                <TableRow>
                  <TableHead className="text-gray-900 py-4 pl-6 font-semibold">First Name</TableHead>
                  <TableHead className="text-gray-900 font-semibold">Last Name</TableHead>
                  <TableHead className="text-right text-gray-900 font-semibold pr-8">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {patients.map((patient, index) => (
                  <TableRow
                    key={patient.id}
                    className={`hover:bg-purple-50/50 transition-colors ${
                      index % 2 === 0 ? 'bg-white/50' : 'bg-gray-50/30'
                    }`}
                  >
                    <TableCell className="font-medium py-6 pl-6 text-gray-900">
                      {patient.firstName}
                    </TableCell>
                    <TableCell className="font-medium text-gray-900">
                      {patient.lastName}
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-red-200 text-red-600 hover:bg-red-50"
                        onClick={() => unassignPatientMu.mutate(patient.id)}
                        disabled={unassignPatientMu.isPending}
                      >
                        <>
                          <Trash2 className="w-4 h-4 mr-1" />
                          Unassign
                        </>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-16 px-6">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <UserCheck className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No patients assigned</h3>
            <p className="text-gray-600 mb-6">
              This nurse doesn't have any patients assigned yet.
            </p>
            <AssignPatientDialog user={user} />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function AssignPatientDialog({ user }: { user: User }) {
  const qc = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");

  const [isOpen, setIsOpen] = useState(false);

  const unassignedPatientsQ = useQuery({
    queryKey: ["unassignedPatients", user.id],
    queryFn: fn(() => listPatientsNotAssignedToNurse({ nurseId: user.id })),
  });
  const unassignedPatients = unassignedPatientsQ.data?.patients;

  const assignPatientToNurseMu = useMutation({
    mutationKey: ["assignPatientToNurse", user.id],
    mutationFn: async (patientID: string) => fn(() => assignPatientToNurse({
      nurseId: user.id,
      patientId: patientID
    }))(),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["unassignedPatients", user.id] });
      qc.invalidateQueries({ queryKey: ["getUser", user.id], });
    },
  });

  const filteredPatients = unassignedPatients?.filter(patient => (
    `${patient.firstName} ${patient.lastName}`.toLowerCase().includes(searchQuery.toLowerCase())
  ));

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="border-blue-200 text-blue-600 hover:bg-blue-50"
        >
          <UserPlus className="w-4 h-4 mr-2" />
          Assign Patient
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <UserPlus className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold text-gray-900">
                Assign New Patient
              </DialogTitle>
              <DialogDescription className="text-gray-600">
                Select a patient to assign to {user.name}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Search Input */}
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search patients by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 border-gray-300 focus:border-blue-400 focus:ring-blue-400/20 bg-white/80"
            />
          </div>

          {/* Patients Table */}
          <div className="max-h-80 overflow-auto border border-gray-200 rounded-lg">
            <Table>
              <TableHeader className="bg-gray-50/80 sticky top-0">
                <TableRow>
                  <TableHead className="text-gray-900 font-semibold">First Name</TableHead>
                  <TableHead className="text-gray-900 font-semibold">Last Name</TableHead>
                  <TableHead className="text-right text-gray-900 font-semibold pr-6">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPatients && filteredPatients.length > 0 ? (
                  filteredPatients.map((patient, index) => (
                    <TableRow
                      key={patient.id}
                      className={`hover:bg-blue-50/50 transition-colors ${
                        index % 2 === 0 ? 'bg-white/50' : 'bg-gray-50/30'
                      }`}
                    >
                      <TableCell className="font-medium text-gray-900">
                        {patient.firstName}
                      </TableCell>
                      <TableCell className="font-medium text-gray-900">
                        {patient.lastName}
                      </TableCell>
                      <TableCell className="text-right pr-4">
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-green-200 text-green-600 hover:bg-green-50"
                          onClick={() => assignPatientToNurseMu.mutate(patient.id)}
                          disabled={assignPatientToNurseMu.isPending}
                        >
                          <>
                            <UserPlus className="w-4 h-4 mr-1" />
                            Assign
                          </>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-8 text-gray-500">
                      {searchQuery ? (
                        <>No patients found matching "{searchQuery}"</>
                      ) : (
                        <>No patients available to assign to {user.name}</>
                      )}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </DialogContent>
    </Dialog>
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
        <Table>
          <TableHeader className="bg-gray-50/80">
            <TableRow>
              <TableHead><Skeleton className="h-4 w-20" /></TableHead>
              <TableHead><Skeleton className="h-4 w-20" /></TableHead>
              <TableHead className="text-right pr-8">
                <Skeleton className="h-4 w-16 ml-auto" />
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 3 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                <TableCell className="text-right pr-6">
                  <Skeleton className="h-9 w-24" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}