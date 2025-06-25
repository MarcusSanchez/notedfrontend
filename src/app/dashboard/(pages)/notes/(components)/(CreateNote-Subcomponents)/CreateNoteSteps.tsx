"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import React, { useState } from "react";
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
import { step2text } from "@/lib/tools/enum2text";
import { useNoteStore } from "@/lib/state";
import { HealthAndSafetyStep } from "@/proto/note_pb";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";


export function CreateNoteSteps() {
  const { note, setNote } = useNoteStore();
  const [open, setOpen] = useState(false);

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
  ].filter((step) => !note.steps.includes(step));

  const addStep = (step: HealthAndSafetyStep) => {
    setNote(n => ({ ...n, steps: [...n.steps, step] }));
    setOpen(false);
  };

  const removeStep = (step: HealthAndSafetyStep) => setNote(n => ({ ...n, steps: n.steps.filter(s => s !== step) }));

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row justify-between gap-2">
          <div className="flex flex-col gap-1">
            <CardTitle>Health and Safety Steps</CardTitle>
            <CardDescription>
              What steps were taken to ensure the health and safety of the consumer? List at least one step taken.
            </CardDescription>
          </div>
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
                <Select onValueChange={(value) => addStep(parseInt(value))}>
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
        </div>
      </CardHeader>
      <CardContent>
        {note.steps.length === 0
          ? (
            <div className="flex justify-center items-center h-32 text-muted-foreground text-sm">
              Please add at least one health and safety step in order to create the note.
            </div>
          )
          : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Step</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {note.steps.map((step) => (
                  <TableRow key={step}>
                    <TableCell>{step2text(step)}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeStep(step)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )
        }
      </CardContent>
    </Card>
  );
}
