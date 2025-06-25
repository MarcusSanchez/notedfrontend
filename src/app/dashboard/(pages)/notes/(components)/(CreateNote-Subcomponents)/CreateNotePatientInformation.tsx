"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { cn, fn } from "@/lib/utils";
import { listNursePatients, listPatientGoals } from "@/app/dashboard/(pages)/notes/actions";
import { useNoteStore, useUserStore } from "@/lib/state";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { ListedPatient } from "@/proto/patient_pb";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Bed, CalendarIcon, Clock, Dumbbell, HandHeart, MessageCircleWarning, TrendingUp, Trophy } from "lucide-react";
import { format } from "date-fns";
import { date } from "zod";
import { Calendar } from "@/components/ui/calendar";
import { GoalProgress, Health } from "@/proto/note_pb";
import { health2text, progress2text } from "@/lib/tools/enum2text";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { behaviorDescriptionSchema } from "@/lib/schemas/schemas";

export function CreateNotePatientInformation() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Patient Information</CardTitle>
        <CardDescription>Select the patient, goal, and other information to create a new note.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6">
          <PatientSelect />
          <DateSelect />
          <GoalSelectAndGoalProgress />
          <PatientHealth />
          <ExhibitedBehaviorsCheckAndDescription />
        </div>
      </CardContent>
    </Card>
  );
}

function PatientSelect() {
  const { user } = useUserStore();
  const { note, setNote } = useNoteStore();

  const [opened, setOpened] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const listPatientsQ = useQuery({
    queryKey: ["listPatients"],
    queryFn: fn(() => listNursePatients({ nurseId: user.id }))
  });
  const listedPatients = listPatientsQ.data?.patients;

  const filteredPatients = listedPatients?.filter((patient) => {
    const fullName = `${patient.firstName} ${patient.lastName}`;
    return fullName.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const selectPatient = (patient: ListedPatient) => {
    setNote(n => ({ ...n, patient, goalId: "" }));
    setOpened(false);
  };

  return (
    <Dialog open={opened} onOpenChange={() => setOpened(!opened)}>
      <DialogTrigger asChild>
        <div className="flex flex-col gap-2">
          <Label className="text-sm font-bold flex items-center gap-2">
            <Bed className="h-4 w-4" />
            Patient
          </Label>
          <Button className="justify-start" variant="outline">
            {note.patient.id != "" ? `${note.patient.firstName} ${note.patient.lastName}` : "Select a Patient"}
          </Button>
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Select a Patient</DialogTitle>
          <DialogDescription>
            Filter results by typing in the patient&#39;s name below.
          </DialogDescription>
        </DialogHeader>
        <Input
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
                      onClick={() => selectPatient(patient)}
                    >
                      Select
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {filteredPatients && filteredPatients.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} className="text-center text-muted-foreground">
                    No patients {listedPatients?.length != 0 && "matching that query"} to assign {user?.name && `to ${user.name}`}
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

function DateSelect() {
  const { note, setNote } = useNoteStore();

  return (
    <div className="flex flex-col gap-2">
      <Label className="text-sm font-bold flex items-center gap-2">
        <Clock className="h-4 w-4" />
        Date Consumer Received Care
      </Label>
      <Popover modal={true}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {note.date ? format(note.date, 'PPP') : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={note.date}
            onSelect={(newDate) => setNote(n => ({ ...n, date: newDate || new Date() }))}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}

function GoalSelectAndGoalProgress() {
  const { note, setNote } = useNoteStore();

  const listPatientsGoalsQ = useQuery({
    queryKey: ["listPatientsGoals", note.patient.id],
    queryFn: fn(() => listPatientGoals({ patientId: note.patient.id })),
    enabled: note.patient.id != "",
  });
  const listedGoals = listPatientsGoalsQ.data?.goals;

  return (
    <>
      <div className="flex flex-col gap-2">
        <Label className={cn("text-sm font-bold flex items-center gap-2", !note.patient.id && "text-muted-foreground")}>
          <Trophy className="h-4 w-4" />
          Goal
        </Label>
        <Select
          value={note.goalId}
          onValueChange={(value) => setNote(n => ({ ...n, goalId: value }))}
          disabled={note.patient.id === ""}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a Goal" />
          </SelectTrigger>
          <SelectContent>
            {listedGoals?.map((goal) => (
              <SelectItem key={goal.description} value={goal.id}>
                {goal.description}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-2">
        <Label className="text-sm font-bold flex items-center gap-2">
          <TrendingUp className="h-4 w-4" />
          Goal Progress
        </Label>
        <Select
          value={note.goalProgress !== GoalProgress.UnspecifiedGoalProgress ? note.goalProgress.toString() : ""}
          onValueChange={(value) => setNote(n => ({ ...n, goalProgress: parseInt(value) }))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Progress Made on Goal" />
          </SelectTrigger>
          <SelectContent>
            {[GoalProgress.Progressing, GoalProgress.Regressing, GoalProgress.Stagnant].map((gp) => (
              <SelectItem key={gp} value={gp.toString()}>
                {progress2text(gp)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </>
  );
}

function PatientHealth() {
  const { note, setNote } = useNoteStore();

  return (
    <>
      <div className="flex flex-col gap-2">
        <Label className="text-sm font-bold flex items-center gap-2">
          <Dumbbell className="h-4 w-4" />
          Physical Health
        </Label>
        <Select
          value={note.physicalHealth !== Health.UnspecifiedHealth ? note.physicalHealth.toString() : ""}
          onValueChange={(value) => setNote(n => ({ ...n, physicalHealth: parseInt(value) }))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Patient's Physical Health" />
          </SelectTrigger>
          <SelectContent>
            {[Health.Good, Health.Fair, Health.Poor].map((health) => (
              <SelectItem key={health} value={health.toString()}>
                {health2text(health)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-2">
        <Label className="text-sm font-bold flex items-center gap-2">
          <HandHeart className="h-4 w-4" />
          Emotional Health
        </Label>
        <Select
          value={note.emotionalHealth !== Health.UnspecifiedHealth ? note.emotionalHealth.toString() : ""}
          onValueChange={(value) => setNote(n => ({ ...n, emotionalHealth: parseInt(value) }))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Patient's Emotional Health" />
          </SelectTrigger>
          <SelectContent>
            {[Health.Good, Health.Fair, Health.Poor].map((health) => (
              <SelectItem key={health} value={health.toString()}>
                {health2text(health)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </>
  );
}

function ExhibitedBehaviorsCheckAndDescription() {
  const { note, setNote } = useNoteStore();

  if (note.patient.id === "") return null;
  if (!note.patient.hasMaladaptiveBehaviors) return null;

  const toggleExhibitedBehaviors = (value: boolean) => setNote(n => ({
    ...n,
    exhibitedBehaviors: value,
    behaviorDescription: value ? n.behaviorDescription : "",
  }));

  const updateExhibitedBehaviorsDescription = (value: string) => setNote(n => ({ ...n, behaviorDescription: value }));

  return (
    <div className="flex flex-col w-full space-y-3 md:space-y-6 col-span-1 md:col-span-2">
      <div className="flex items-center gap-2 w-full">
        <Checkbox checked={!!note.exhibitedBehaviors} onCheckedChange={c => toggleExhibitedBehaviors(!!c)} />
        <Label className="text-sm font-bold cursor-pointer " onClick={() => toggleExhibitedBehaviors(!note.exhibitedBehaviors)}>
          Patient Exhibited Maladaptive Behaviors
        </Label>
      </div>
      <div className="flex flex-col gap-2 w-full">
        <Label className={`text-sm font-bold flex w-full items-center gap-2 ${!note.exhibitedBehaviors && "text-muted-foreground"}`}>
          <MessageCircleWarning className="h-4 w-4" />
          Describe Exhibited Behaviors
        </Label>
        <Textarea
          className="w-full"
          placeholder="Describe the exhibited behaviors..."
          rows={4}
          value={note.behaviorDescription}
          onChange={(e) => updateExhibitedBehaviorsDescription(e.target.value)}
          disabled={!note.exhibitedBehaviors}
          maxLength={behaviorDescriptionSchema.max}
        />
      </div>
    </div>
  );
}
