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
import { PartialPatient, User } from "@/proto/user_pb";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fn } from "@/lib/utils";
import {
  assignPatientToNurse,
  listPatientsNotAssignedToNurse,
  unassignPatientToNurse
} from "@/app/dashboard/(pages)/nurses/[id]/actions";
import { ScrollArea } from "@/components/ui/scroll-area";

type AssignedPatientsProps = {
  user: User
  patients: PartialPatient[]
}

export function AssignedPatients({ user, patients }: AssignedPatientsProps) {
  const qc = useQueryClient();

  const unassignPatientMutation = useMutation({
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

  return (
    <Card className="relative z-10">
      <CardHeader className="flex flex-row gap-2 items-center justify-between">
        <div>
          <CardTitle className="text-sm sm:text-xl font-semibold">Assigned Patients</CardTitle>
          <CardDescription>List of patients under {user?.name}&#39;s care</CardDescription>
        </div>
        {user && <AssignPatientDialog user={user} />}
      </CardHeader>
      <CardContent>
        {patients && patients?.length > 0 && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>First Name</TableHead>
                <TableHead>Last Name</TableHead>
                <TableHead className="flex items-center justify-end pr-10">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {patients?.map((patient) => (
                <TableRow key={patient.id}>
                  <TableCell>{patient.firstName}</TableCell>
                  <TableCell>{patient.lastName}</TableCell>
                  <TableCell className="flex justify-end">
                    <Button
                      className="font-bold" variant="outline" size="sm"
                      onClick={() => unassignPatientMutation.mutate(patient.id)}
                    >
                      Unassign
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
        {patients && patients?.length === 0 && (
          <div className="flex items-center justify-center h-32">
            <p className="text-muted-foreground">No patients assigned</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function AssignPatientDialog({ user }: { user: User }) {
  const { isMD } = useBreakpoints();
  const qc = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");

  const unassignedPatientsQ = useQuery({
    queryKey: ["unassignedPatients", user.id],
    queryFn: fn(() => listPatientsNotAssignedToNurse({ nurseId: user.id })),
  });
  const unassignedPatients = unassignedPatientsQ.data?.patients;

  const assignPatientToNurseMutation = useMutation({
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
    <Dialog>
      <DialogTrigger asChild>
        <Button size={!isMD ? "sm" : "default"} className="font-bold">
          <UserPlus className="h-4 w-4 mr-2" />
          Assign Patient
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assign New Patient</DialogTitle>
          <DialogDescription>Select a patient to assign to {user?.name}</DialogDescription>
        </DialogHeader>
        <input
          type="text"
          placeholder="Search patients..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-3 py-2 border rounded-md border-input bg-background"
        />
        <ScrollArea className="max-h-80">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>First Name</TableHead>
                <TableHead>Last Name</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPatients && filteredPatients.map((patient) => (
                <TableRow key={patient.id}>
                  <TableCell>{patient.firstName}</TableCell>
                  <TableCell>{patient.lastName}</TableCell>
                  <TableCell>
                    <Button
                      className="font-bold" variant="outline" size="sm"
                      onClick={() => assignPatientToNurseMutation.mutate(patient.id)}
                      disabled={assignPatientToNurseMutation.isPending}
                    >
                      Assign
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {filteredPatients && filteredPatients.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} className="text-center text-muted-foreground">
                    No patients {unassignedPatients?.length != 0 && "matching that query"} to assign {user?.name && `to ${user.name}`}
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