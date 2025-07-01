import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
  Trash2,
  Search,
  Users
} from 'lucide-react';
import { Patient } from '@/proto/patient_pb';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { assignPatientToNurse, unassignPatientToNurse } from '../../../nurses/[id]/actions';
import { fn } from '@/lib/utils';
import { listNursesNotAssignedToPatient } from "@/app/dashboard/(pages)/patients/actions";

export function PatientAssignedNurses({ patient }: { patient: Patient }) {
  const qc = useQueryClient();

  const unassignPatientMu = useMutation({
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
    <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader className="border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-xl font-semibold text-gray-900">
                Assigned Nurses
              </CardTitle>
              <CardDescription className="text-gray-600">
                List of nurses assigned to {patient.firstName} {patient.lastName}
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <AssignNurseDialog patient={patient} />
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {patient.assignedNurses.length > 0 ? (
          <div className="overflow-hidden">
            <Table>
              <TableHeader className="bg-gray-50/80">
                <TableRow>
                  <TableHead className="pl-6 py-3 text-gray-900 font-semibold">Full Name</TableHead>
                  <TableHead className="text-right text-gray-900 font-semibold pr-8">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {patient.assignedNurses.map((nurse, index) => (
                  <TableRow
                    key={nurse.id}
                    className={`hover:bg-blue-50/50 transition-colors ${
                      index % 2 === 0 ? 'bg-white/50' : 'bg-gray-50/30'
                    }`}
                  >
                    <TableCell className="pl-6 py-4 font-medium text-gray-900">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs font-semibold">
                            {nurse.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <span>{nurse.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-red-200 text-red-600 hover:bg-red-50"
                        onClick={() => unassignPatientMu.mutate(nurse.id)}
                        disabled={unassignPatientMu.isPending}
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Unassign
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
              <Users className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No nurses assigned</h3>
            <p className="text-gray-600 mb-6">
              This patient doesn't have any nurses assigned yet.
            </p>
            <AssignNurseDialog patient={patient} />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function AssignNurseDialog({ patient }: { patient: Patient }) {
  const qc = useQueryClient();

  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const unassignedNursesQ = useQuery({
    queryKey: ["unassignedNurses", patient.id],
    queryFn: fn(() => listNursesNotAssignedToPatient({ patientId: patient.id })),
  });
  const unassignedNurses = unassignedNursesQ.data?.nurses;

  const assignPatientToNurseMu = useMutation({
    mutationKey: ["assignPatientToNurse", patient.id],
    mutationFn: async (userId: string) => fn(() => assignPatientToNurse({
      nurseId: userId,
      patientId: patient.id
    }))(),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["unassignedNurses", patient.id] });
      qc.invalidateQueries({ queryKey: ["getPatient", patient.id] });
      setIsOpen(false);
    },
  });

  const filteredNurses = unassignedNurses?.filter(nurse => {
    const searchLower = searchQuery.toLowerCase();
    return nurse.name.toLowerCase().includes(searchLower);
  });

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="border-blue-200 text-blue-600 hover:bg-blue-50"
        >
          <UserPlus className="w-4 h-4 mr-2" />
          Assign to Nurse
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
                Assign to Nurse
              </DialogTitle>
              <DialogDescription className="text-gray-600">
                Select a nurse to assign {patient.firstName} {patient.lastName} to
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
              placeholder="Search nurses by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 border-gray-300 focus:border-blue-400 focus:ring-blue-400/20 bg-white/80"
            />
          </div>

          {/* Nurses Table */}
          <div className="max-h-80 overflow-auto border border-gray-200 rounded-lg">
            <Table>
              <TableHeader className="bg-gray-50/80 sticky top-0">
                <TableRow>
                  <TableHead className="pl-4 py-3 text-gray-900 font-semibold">Full Name</TableHead>
                  <TableHead className="text-right text-gray-900 font-semibold pr-6">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredNurses && filteredNurses.length > 0 ? (
                  filteredNurses.map((nurse, index) => (
                    <TableRow
                      key={nurse.id}
                      className={`hover:bg-blue-50/50 transition-colors ${
                        index % 2 === 0 ? 'bg-white/50' : 'bg-gray-50/30'
                      }`}
                    >
                      <TableCell className="pl-4 py-4 font-medium text-gray-900">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs font-semibold">
                              {nurse.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <span>{nurse.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right pr-4">
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-green-200 text-green-600 hover:bg-green-50"
                          onClick={() => assignPatientToNurseMu.mutate(nurse.id)}
                          disabled={assignPatientToNurseMu.isPending}
                        >
                          <UserPlus className="w-4 h-4 mr-1" />
                          Assign
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={2} className="text-center py-8 text-gray-500">
                      {searchQuery ? (
                        <>No nurses found matching "{searchQuery}"</>
                      ) : (
                        <>No nurses available to assign to {patient.firstName} {patient.lastName}</>
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
