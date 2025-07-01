"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Edit, User, FileText, CalendarMinus as VenusAndMars, AlertCircle, CheckCircle } from 'lucide-react';
import { Patient, Sex } from "@/proto/patient_pb";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { fn } from "@/lib/utils";
import { updatePatient } from '../actions';
import { nameSchema } from "@/lib/schemas/schemas";
import { sex2text } from "@/lib/tools/enum2text";

export function UpdatePatientDialog({ patient }: { patient: Patient }) {
  const qc = useQueryClient();

  const [open, setOpen] = useState(false);
  const [firstName, setFirstName] = useState(patient.firstName);
  const [lastName, setLastName] = useState(patient.lastName);
  const [sex, setSex] = useState(patient.sex);
  const [hasMaladaptiveBehaviors, setHasMaladaptiveBehaviors] = useState(patient.hasMaladaptiveBehaviors);
  const [additionalInformation, setAdditionalInformation] = useState(patient.additionalInformation || '');

  const [error, setError] = useState<string | null>(null);

  const sexes = [Sex.Male, Sex.Female, Sex.Other];

  const updatePatientMu = useMutation({
    mutationKey: ["updatePatient", patient.id],
    mutationFn: fn(() => updatePatient({
      patientId: patient.id,
      firstName: firstName !== patient.firstName ? firstName : undefined,
      lastName: lastName !== patient.lastName ? lastName : undefined,
      sex: sex !== patient.sex ? sex : undefined,
      hasMaladaptiveBehaviors: hasMaladaptiveBehaviors !== patient.hasMaladaptiveBehaviors ? hasMaladaptiveBehaviors : undefined,
      additionalInformation: additionalInformation !== patient.additionalInformation ? additionalInformation : undefined
    })),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["getPatient", patient.id] })
      setOpen(false)
    },
    onError: () => setError("Failed to update patient information. Please try again.")
  });

  const handleUpdatePatient = () => {
    const firstNameResult = nameSchema.safeParse(firstName);
    if (!firstNameResult.success) {
      setError("First " + firstNameResult.error.errors[0].message);
      return;
    }

    const lastNameResult = nameSchema.safeParse(lastName);
    if (!lastNameResult.success) {
      setError("Last " + lastNameResult.error.errors[0].message);
      return;
    }

    updatePatientMu.mutate();
  };

  const resetForm = () => {
    setFirstName(patient.firstName);
    setLastName(patient.lastName);
    setSex(patient.sex);
    setHasMaladaptiveBehaviors(patient.hasMaladaptiveBehaviors);
    setAdditionalInformation(patient.additionalInformation || '');
    setError(null);
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      resetForm();
    }
  };

  const hasChanges = (
    firstName !== patient.firstName ||
    lastName !== patient.lastName ||
    sex !== patient.sex ||
    hasMaladaptiveBehaviors !== patient.hasMaladaptiveBehaviors ||
    additionalInformation !== (patient.additionalInformation || '')
  );

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="border-blue-200 text-blue-600 hover:bg-blue-50"
        >
          <Edit className="w-4 h-4 mr-2" />
          Update Patient
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md min-w-[35vw]">
        <DialogHeader>
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <User className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold text-gray-900">
                Update Patient Information
              </DialogTitle>
              <p className="text-gray-600 text-sm">
                Make changes to the patient's information below.
              </p>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Name Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <div className="w-5 h-5 bg-blue-50 rounded-md flex items-center justify-center">
                  <User className="w-4 h-4 text-blue-600" />
                </div>
                First Name
              </Label>
              <Input
                id="firstName"
                type="text"
                placeholder="Enter first name..."
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="border-gray-300 focus:border-blue-400 focus:ring-blue-400/20"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <div className="w-5 h-5 bg-purple-50 rounded-md flex items-center justify-center">
                  <User className="w-4 h-4 text-purple-600" />
                </div>
                Last Name
              </Label>
              <Input
                id="lastName"
                type="text"
                placeholder="Enter last name..."
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="border-gray-300 focus:border-blue-400 focus:ring-blue-400/20"
              />
            </div>
          </div>

          {/* Sex Field */}
          <div className="space-y-2">
            <Label htmlFor="sex" className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <div className="w-5 h-5 bg-orange-50 rounded-md flex items-center justify-center">
                <VenusAndMars className="w-4 h-4 text-orange-600" />
              </div>
              Sex
            </Label>
            <Select value={sex.toString()} onValueChange={(value) => setSex(parseInt(value))}>
              <SelectTrigger className="border-gray-300 focus:border-blue-400 focus:ring-blue-400/20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Sex</SelectLabel>
                  {sexes.map((sexOption) => (
                    <SelectItem value={sexOption.toString()} key={sexOption}>
                      {sex2text(sexOption)}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {/* Maladaptive Behaviors */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="maladaptiveBehaviors"
                    checked={hasMaladaptiveBehaviors}
                    onCheckedChange={(checked) => setHasMaladaptiveBehaviors(checked as boolean)}
                  />
                  <Label
                    htmlFor="maladaptiveBehaviors"
                    className="text-sm font-medium text-blue-800 cursor-pointer"
                    onClick={() => setHasMaladaptiveBehaviors(checked => !checked)}
                  >
                    This patient exhibits maladaptive behaviors
                  </Label>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="space-y-2">
            <Label htmlFor="additionalInfo" className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <div className="w-5 h-5 bg-indigo-50 rounded-md flex items-center justify-center">
                <FileText className="w-4 h-4 text-indigo-600" />
              </div>
              Additional Information <span className="text-gray-500 font-normal">(Optional)</span>
            </Label>
            <Textarea
              id="additionalInfo"
              value={additionalInformation}
              onChange={(e) => setAdditionalInformation(e.target.value)}
              maxLength={500}
              className="min-h-[100px] border-gray-300 focus:border-blue-400 focus:ring-blue-400/20"
              placeholder="Enter any additional information here..."
            />
            <p className="text-xs text-gray-500">
              {additionalInformation.length}/500 characters
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Changes Indicator */}
          {hasChanges && !error && (
            <div className="flex items-center space-x-2 p-3 bg-green-50 border border-green-200 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
              <p className="text-sm text-green-700">Changes detected and ready to save</p>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2 pt-6">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={updatePatientMu.isPending}
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpdatePatient}
            disabled={updatePatientMu.isPending || !hasChanges || !firstName.trim() || !lastName.trim()}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {updatePatientMu.isPending ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Updating...
              </>
            ) : (
              <>
                <Edit className="w-4 h-4 mr-2" />
                Update Patient
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}