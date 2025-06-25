"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import React, { useState } from "react";
import { UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useBreakpoints } from "@/hooks/use-breakpoints";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fn } from "@/lib/utils";
import { assignPatientToNurse, unassignPatientToNurse } from "@/app/dashboard/(pages)/nurses/[id]/actions";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Patient } from "@/proto/patient_pb";
import { listNursesNotAssignedToPatient } from "@/app/dashboard/(pages)/patients/actions";
import Link from "next/link";

export function PatientAssignedNurses({ patient }: { patient: Patient }) {
  const qc = useQueryClient();

  const unassignPatientMutation = useMutation({
    mutationKey: ["unassignPatient", patient.id],
    mutationFn: async (userId: string) => await fn(() => unassignPatientToNurse({
      nurseId: userId,
      patientId: patient.id
    }))(),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["getPatient", patient.id] });
      qc.invalidateQueries({ queryKey: ["unassignedNurses", patient.id] });
    },
  });

  return (
    <Card className="relative z-10 mt-6">
      <CardHeader className="flex flex-row gap-2 items-center justify-between">
        <div>
          <CardTitle className="text-sm sm:text-xl font-semibold">Assigned Nurses</CardTitle>
          <CardDescription>List of nurses assigned to {patient.firstName} {patient.lastName}.</CardDescription>
        </div>
        <AssignPatientDialog patient={patient} />
      </CardHeader>
      <CardContent>
        {patient.assignedNurses && patient.assignedNurses?.length > 0 && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Full Name</TableHead>
                <TableHead className="flex items-center justify-end pr-10">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {patient.assignedNurses?.map((nurse) => (
                <TableRow key={nurse.id}>
                  <TableCell>
                    <Link href={`/dashboard/nurses/${nurse.id}`} className="hover:underline">
                      {nurse.name}
                    </Link>
                  </TableCell>
                  <TableCell className="flex justify-end">
                    <Button
                      className="font-bold" variant="outline" size="sm"
                      onClick={() => unassignPatientMutation.mutate(nurse.id)}
                    >
                      Unassign
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
        {patient.assignedNurses && patient.assignedNurses?.length === 0 && (
          <div className="flex items-center justify-center h-32">
            <p className="text-muted-foreground">No nurses assigned</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function AssignPatientDialog({ patient }: { patient: Patient }) {
  const { isMD } = useBreakpoints();
  const qc = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");

  const unassignedNursesQ = useQuery({
    queryKey: ["unassignedNurses", patient.id],
    queryFn: fn(() => listNursesNotAssignedToPatient({ patientId: patient.id })),
  });
  const unassignedNurses = unassignedNursesQ.data?.nurses;

  const assignPatientToNurseMutation = useMutation({
    mutationKey: ["assignPatientToNurse", patient.id],
    mutationFn: async (userId: string) => fn(() => assignPatientToNurse({
      nurseId: userId,
      patientId: patient.id
    }))(),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["unassignedNurses", patient.id] });
      qc.invalidateQueries({ queryKey: ["getPatient", patient.id] });
    },
  });

  const filterNurses = unassignedNurses?.filter(nurse => {
    const searchLower = searchQuery.toLowerCase();
    return nurse.name.toLowerCase().includes(searchLower);
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size={!isMD ? "sm" : "default"} className="font-bold">
          <UserPlus className="h-4 w-4 mr-2" />
          Assign to Nurse
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assign to Nurse</DialogTitle>
          <DialogDescription>Select a nurse to assign {patient.firstName} {patient.lastName} to.</DialogDescription>
        </DialogHeader>
        <input
          type="text"
          placeholder="Search nurses..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-3 py-2 border rounded-md border-input bg-background"
        />
        <ScrollArea className="max-h-80">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Full Name</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filterNurses && filterNurses.map((nurse) => (
                <TableRow key={nurse.id}>
                  <TableCell>{nurse.name}</TableCell>
                  <TableCell>
                    <Button
                      className="font-bold" variant="outline" size="sm"
                      onClick={() => assignPatientToNurseMutation.mutate(nurse.id)}
                      disabled={assignPatientToNurseMutation.isPending}
                    >
                      Assign
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {filterNurses && filterNurses.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} className="text-center text-muted-foreground">
                    {unassignedNurses?.length === 0
                      ? <p className="mb-2">No nurses to assign to {patient.firstName} {patient.lastName}.</p>
                      : <p className="mb-2">No nurses with that query was found.</p>
                    }
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
