"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle, Trash2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { HealthAndSafetyStep, Note } from "@/proto/note_pb";
import { addStep, removeStep } from "@/app/dashboard/(pages)/notes/[id]/actions";
import { fn } from "@/lib/utils";
import { step2text } from "@/lib/tools/enum2text";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export function StepTab({ note }: { note: Note }) {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);

  const addStepMutation = useMutation({
    mutationKey: ["addStep", note.id],
    mutationFn: async (step: HealthAndSafetyStep) => await fn(() => addStep({ noteId: note.id, step: step }))(),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["getNote", note.id] });
      setOpen(false);
    },
  });

  const removeStepMutation = useMutation({
    mutationKey: ["removeStep", note.id],
    mutationFn: async (stepId: string) => await fn(() => removeStep({ stepId: stepId }))(),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["getNote", note.id] });
    },
  });

  const filteredSteps = [
    HealthAndSafetyStep.ConstantSupervision,
    HealthAndSafetyStep.OneOnOneMonitoring,
    HealthAndSafetyStep.SafeStreetNavigation,
    HealthAndSafetyStep.ProperHandHygiene,
    HealthAndSafetyStep.VehicleSafetyAwareness,
    HealthAndSafetyStep.SafeEatingAndChokingPrevention,
    HealthAndSafetyStep.ProperUseOfEquipment,
    HealthAndSafetyStep.MedicationReminders,
    HealthAndSafetyStep.ReinforceCommunityEtiquette,
    HealthAndSafetyStep.TeachingSelfAdvocacy,
    HealthAndSafetyStep.MedicalOrDentalAppointmentAssitance,
    HealthAndSafetyStep.HouseholdChoresAndMaintenance,
    HealthAndSafetyStep.ProperShoppingAwareness,
  ].filter((step) => !note.steps.map((s) => s.step).includes(step));

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0 text-xl">
          <span>Health and Safety Steps</span>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="font-bold">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Step
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Step</DialogTitle>
                <DialogDescription>
                  Please select a health and safety step to add.
                </DialogDescription>
              </DialogHeader>
              {filteredSteps.length > 0 && (
                <Select onValueChange={(value) => addStepMutation.mutate(parseInt(value))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a step" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredSteps.map((step) => (
                      <SelectItem value={step.toString()} key={step}>
                        {step2text(step)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </DialogContent>
          </Dialog>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {note.steps.length === 0 ? (
          <div className="flex justify-center items-center h-32 text-muted-foreground text-sm">
            No health and safety steps recorded for this note. Please add a step.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Step</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {note.steps.map((step) => (
                <TableRow key={step.id}>
                  <TableCell>{step2text(step.step)}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeStepMutation.mutate(step.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
