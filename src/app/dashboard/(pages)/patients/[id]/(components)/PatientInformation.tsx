"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button, buttonVariants } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Calendar, Edit, FileText, Trash2, User } from 'lucide-react'
import { nameSchema } from "@/lib/schemas/schemas"
import { Textarea } from "@/components/ui/textarea";
import { SchemaInput } from "@/components/utility/SchemaInput";
import { Patient, Sex } from "@/proto/patient_pb";
import { timestamp2date } from "@/lib/tools/timestamp2date";
import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cn, fn } from "@/lib/utils";
import { deletePatient, updatePatient } from "@/app/dashboard/(pages)/patients/[id]/actions";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
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
} from "@/components/ui/alert-dialog";
import { sex2text } from "@/lib/tools/enum2text";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";


export function PatientInformation({ patient }: { patient: Patient }) {
  const qc = useQueryClient();
  const router = useRouter();
  const { toast } = useToast();

  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [firstName, setFirstName] = useState(patient.firstName);
  const [lastName, setLastName] = useState(patient.lastName);
  const [sex, setSex] = useState(patient.sex);
  const [hasMaladaptiveBehaviors, setHasMaladaptiveBehaviors] = useState(patient.hasMaladaptiveBehaviors);
  const [additionalInformation, setAdditionalInformation] = useState(patient.additionalInformation || "");

  const deletePatientMutation = useMutation({
    mutationKey: ["deletePatient", patient.id],
    mutationFn: fn(() => deletePatient({ patientId: patient.id })),
    onSuccess: () => {
      setTimeout(() => qc.invalidateQueries({ queryKey: ["getPatient", patient.id] }), 2000);
      router.push("/dashboard/patients");
      toast({
        title: "Successfully deleted patient.",
        description: `${patient.firstName} ${patient.lastName} has been removed from the system.`,
      });
    }
  });

  const updatePatientMutation = useMutation({
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
      setIsUpdateDialogOpen(false)
    }
  });

  const handleUpdatePatient = () => {
    const results = [nameSchema.safeParse(firstName), nameSchema.safeParse(lastName)];
    if (!results.every(r => r.success)) return;
    updatePatientMutation.mutate();
  };

  const handleCancelUpdate = () => {
    setFirstName(patient.firstName);
    setLastName(patient.lastName);
    setHasMaladaptiveBehaviors(patient.hasMaladaptiveBehaviors);
    setAdditionalInformation(patient.additionalInformation || "");
    setIsUpdateDialogOpen(false);
  };

  const sexes = [Sex.Male, Sex.Female, Sex.Other];

  const updatePatientDisabled = (
    updatePatientMutation.isPending ||
    (
      firstName === patient.firstName &&
      lastName === patient.lastName &&
      sex === patient.sex &&
      hasMaladaptiveBehaviors === patient.hasMaladaptiveBehaviors &&
      additionalInformation === patient.additionalInformation
    )
  );

  return (
    <Card className="w-full mx-auto mb-6">
      <CardHeader>
        <CardTitle className="text-2xl font-bold flex items-center gap-2">
          <User className="w-6 h-6" />
          Patient Information
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="firstName" className="text-sm font-bold">
                First Name
              </Label>
              <Input id="firstName" value={patient.firstName} readOnly className="mt-1" />
            </div>
            <div>
              <Label htmlFor="lastName" className="text-sm font-bold">
                Last Name
              </Label>
              <Input id="lastName" value={patient.lastName} readOnly className="mt-1" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="lastMonthlyTalk" className="text-sm font-bold flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Last Monthly Talk
              </Label>
              <Input
                id="lastMonthlyTalk"
                value={patient.lastMonthlyTalk && timestamp2date(patient.lastMonthlyTalk).toLocaleDateString() || "No monthly talk date provided."}
                readOnly
                className="mt-1 w-full"
              />
            </div>
            <div>
              <Label htmlFor="sex" className="text-sm font-bold flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Sex
              </Label>
              <Input
                id="sex"
                value={sex2text(patient.sex)}
                readOnly
                className="mt-1 w-full"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox id="maladaptiveBehaviors" checked={patient.hasMaladaptiveBehaviors} disabled />
            <Label htmlFor="maladaptiveBehaviors" className="text-sm font-bold">
              Has Maladaptive Behaviors
            </Label>
          </div>

          <div>
            <Label htmlFor="additionalInfo" className="text-sm font-bold flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Additional Information
            </Label>
            <Textarea
              id="additionalInfo"
              value={patient.additionalInformation || "No additional information provided."}
              rows={4}
              readOnly
              className="mt-1"
            />
          </div>
        </div>

        <div className="flex max-sm:flex-col sm:justify-end mt-6 sm:space-x-2 max-sm:space-y-2">
          <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="font-bold max-sm:w-full" size="sm">
                <Edit className="h-4 w-4 mr-2" />
                Update Patient
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:min-w-[550px] md:min-w-[750px]">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                  <User className="w-6 h-6" />
                  Update Patient
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4">
                  <SchemaInput value={firstName} setValue={setFirstName} name="first name" schema={nameSchema} />
                  <SchemaInput value={lastName} setValue={setLastName} name="last name" schema={nameSchema} />
                </div>
                <div className="flex flex-col">
                  <Label htmlFor="sex" className="font-bold text-sm flex items-center gap-2">Sex</Label>
                  <Select value={sex.toString()} onValueChange={(value) => setSex(parseInt(value))}>
                    <SelectTrigger className="w-full]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Sexes</SelectLabel>
                        {sexes.map((sex) => (
                          <SelectItem value={sex.toString()} key={sex}>
                            {sex2text(sex)}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="maladaptiveBehaviors"
                    checked={hasMaladaptiveBehaviors}
                    onCheckedChange={(c) => c ? setHasMaladaptiveBehaviors(true) : setHasMaladaptiveBehaviors(false)}
                  />
                  <Label
                    htmlFor="maladaptiveBehaviors" className="font-bold text-sm cursor-pointer"
                    onClick={() => setHasMaladaptiveBehaviors(!hasMaladaptiveBehaviors)}
                  >
                    This patient has maladaptive behaviors.
                  </Label>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="additionalInfo" className="font-bold text-sm flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Additional Information <span className="text-muted-foreground font-normal">(Optional)</span>
                  </Label>
                  <Textarea
                    id="additionalInfo"
                    value={additionalInformation}
                    onChange={(e) => setAdditionalInformation(e.target.value)}
                    maxLength={500}
                    className="min-h-[100px]"
                    placeholder="Enter any additional information here..."
                  />
                </div>
              </div>
              <DialogFooter className="flex justify-end items-center gap-2">
                <Button className="w-full sm:w-32 font-bold" variant="secondary" onClick={handleCancelUpdate}>
                  Cancel
                </Button>
                <Button className="w-full sm:w-32 font-bold" onClick={handleUpdatePatient} disabled={updatePatientDisabled}>
                  Update Patient
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button className="font-bold max-sm:w-full" variant="destructive" size="sm">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Patient
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  Deleting this patient is permanent and cannot be undone. Doing so will also delete all associated data
                  referencing this patient, including notes.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  className={cn(buttonVariants({ variant: "destructive" }))}
                  onClick={() => deletePatientMutation.mutate()}
                >
                  Delete Patient
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );
}