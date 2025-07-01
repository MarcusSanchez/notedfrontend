"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Trash2, AlertTriangle, Shield, FileText } from 'lucide-react';
import { Patient } from "@/proto/patient_pb";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { deletePatient } from '../actions';
import { fn } from '@/lib/utils';

export function DeletePatientDialog({ patient }: { patient: Patient }) {
  const qc = useQueryClient();
  const router = useRouter();
  const { toast } = useToast();

  const [confirmationText, setConfirmationText] = useState('');

  const expectedConfirmation = 'DELETE';
  const isConfirmationValid = confirmationText.trim().toUpperCase() === expectedConfirmation;
  const patientFullName = `${patient.firstName} ${patient.lastName}`;

  const deletePatientMu = useMutation({
    mutationKey: ["deletePatient", patient.id],
    mutationFn: fn(() => deletePatient({ patientId: patient.id })),
    onSuccess: () => {
      setTimeout(() => qc.invalidateQueries({ queryKey: ["getPatient", patient.id] }), 2000);
      router.push("/dashboard/patients");
      toast({
        title: "Successfully deleted patient.",
        description: `${patient.firstName} ${patient.lastName} has been removed from the system.`,
      });
    },
  });

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="outline"
          className="border-red-200 text-red-600 hover:bg-red-50"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Delete Patient
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="sm:max-w-md min-w-[35vw]">
        <AlertDialogHeader>
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <AlertDialogTitle className="text-xl font-bold text-gray-900">
                Delete Patient Record
              </AlertDialogTitle>
              <AlertDialogDescription className="text-gray-600">
                This action cannot be undone. This will permanently delete the patient record.
              </AlertDialogDescription>
            </div>
          </div>
        </AlertDialogHeader>

        <div className="space-y-6">
          {/* Warning Section */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-red-800">
                <p className="font-medium mb-2">This will permanently delete:</p>
                <ul className="space-y-1 text-red-700">
                  <li>• <strong>{patientFullName}'s</strong> patient record</li>
                  <li>• All associated notes and documentation</li>
                  <li>• All care goals and treatment plans</li>
                  <li>• All nurse assignments for this patient</li>
                  <li>• Complete medical history in the system</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Patient Information */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <Shield className="w-5 h-5 text-gray-600" />
              <div className="text-sm text-gray-800">
                <p className="font-medium">Patient to be deleted:</p>
                <p className="text-gray-700 mt-1">{patientFullName}</p>
                <p className="text-gray-500 text-xs mt-1">ID: {patient.id}</p>
              </div>
            </div>
          </div>

          {/* Confirmation Input */}
          <div className="space-y-2">
            <Label htmlFor="confirmation" className="text-sm font-medium text-gray-700">
              Type "DELETE" to confirm
            </Label>
            <Input
              id="confirmation"
              type="text"
              placeholder="Type DELETE to confirm"
              value={confirmationText}
              onChange={(e) => setConfirmationText(e.target.value)}
              className="border-gray-300 focus:border-red-400 focus:ring-red-400/20"
            />
            <p className="text-xs text-gray-500">
              This confirmation is required to prevent accidental deletions
            </p>
          </div>

          {/* Data Impact Notice */}
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <FileText className="w-5 h-5 text-orange-600 mt-0.5" />
              <div className="text-sm text-orange-800">
                <p className="font-medium mb-1">Data Impact Notice:</p>
                <ul className="space-y-1 text-orange-700">
                  <li>• All patient data will be permanently removed</li>
                  <li>• Associated nurses will lose access to this patient</li>
                  <li>• This action is logged for compliance purposes</li>
                  <li>• Data cannot be recovered after deletion</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <AlertDialogFooter className="gap-2 pt-6">
          <AlertDialogCancel
            disabled={deletePatientMu.isPending}
            onClick={() => setConfirmationText('')}
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={() => deletePatientMu.mutate()}
            disabled={deletePatientMu.isPending || !isConfirmationValid}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            {deletePatientMu.isPending ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Patient
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}