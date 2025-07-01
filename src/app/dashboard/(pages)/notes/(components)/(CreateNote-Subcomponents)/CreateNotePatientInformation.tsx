"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Bed,
  Calendar as CalendarIcon,
  Clock,
  Trophy,
  TrendingUp,
  Dumbbell,
  Heart as HandHeart,
  MessageCircle as MessageCircleWarning,
  Search, CheckCircle
} from 'lucide-react';
import { format } from 'date-fns';
import { cn, fn } from '@/lib/utils';
import { useNoteStore } from '@/lib/state';
import { useUserStore } from '@/lib/state';
import { useQuery } from '@tanstack/react-query';
import { listNursePatients, listPatientGoals } from '../../actions';
import { ListedPatient } from '@/proto/patient_pb';
import { GoalProgress, Health } from '@/proto/note_pb';
import { health2text, progress2text } from '@/lib/tools/enum2text';

export function CreateNotePatientInformation() {
  return (
    <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader className="border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
            <Bed className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <CardTitle className="text-xl font-semibold text-gray-900">
              Patient Information
            </CardTitle>
            <CardDescription className="text-gray-600">
              Select the patient, goal, and other information to create a new note.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
    <Dialog open={opened} onOpenChange={setOpened}>
      <DialogTrigger asChild>
        <div className="space-y-2">
          <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <div className="w-5 h-5 bg-blue-50 rounded-md flex items-center justify-center">
              <Bed className="w-4 h-4 text-blue-600" />
            </div>
            Patient
          </Label>
          <Button
            variant="outline"
            className="w-full justify-start border-gray-300 focus:border-blue-400 focus:ring-blue-400/20"
          >
            {note.patient.id !== "" ? `${note.patient.firstName} ${note.patient.lastName}` : "Select a Patient"}
          </Button>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold bg-transparent text-gray-900">
            Select a Patient
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Filter results by typing in the patient's name below.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search patients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 border-gray-300 focus:border-blue-400 focus:ring-blue-400/20"
            />
          </div>

          <ScrollArea className="max-h-80 border border-gray-200 rounded-xl">
            <Table>
              <TableHeader className="bg-gray-50/80">
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
                          className="border-blue-200 text-blue-600 hover:bg-blue-50"
                          onClick={() => selectPatient(patient)}
                        >
                          Select
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
                        <>No patients available to assign</>
                      )}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function DateSelect() {
  const { note, setNote } = useNoteStore();

  return (
    <div className="space-y-2">
      <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
        <div className="w-5 h-5 bg-green-50 rounded-md flex items-center justify-center">
          <Clock className="w-4 h-4 text-green-600" />
        </div>
        Date Consumer Received Care
      </Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal border-gray-300 focus:border-blue-400 focus:ring-blue-400/20",
              !note.date && "text-muted-foreground"
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
  const goals = listPatientsGoalsQ.data?.goals;

  return (
    <>
      <div className="space-y-2">
        <Label className={cn(
          "text-sm font-semibold text-gray-700 flex items-center gap-2",
          !note.patient.id && "text-muted-foreground"
        )}>
          <div className="w-5 h-5 bg-yellow-50 rounded-md flex items-center justify-center">
            <Trophy className="w-4 h-4 text-yellow-600" />
          </div>
          Goal
        </Label>
        <Select
          value={note.goalId}
          onValueChange={(value) => setNote(n => ({ ...n, goalId: value }))}
          disabled={note.patient.id === ""}
        >
          <SelectTrigger className="border-gray-300 focus:border-blue-400 focus:ring-blue-400/20">
            <SelectValue placeholder="Select a Goal" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Available Goals</SelectLabel>
              {goals?.map((goal) => (
                <SelectItem key={goal.id} value={goal.id}>
                  {goal.description}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
          <div className="w-5 h-5 bg-purple-50 rounded-md flex items-center justify-center">
            <TrendingUp className="w-4 h-4 text-purple-600" />
          </div>
          Goal Progress
        </Label>
        <Select
          value={note.goalProgress !== GoalProgress.UnspecifiedGoalProgress ? note.goalProgress.toString() : ""}
          onValueChange={(value) => setNote(n => ({ ...n, goalProgress: parseInt(value) }))}
        >
          <SelectTrigger className="border-gray-300 focus:border-blue-400 focus:ring-blue-400/20">
            <SelectValue placeholder="Select Progress Made on Goal" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Goal Progress</SelectLabel>
              {[GoalProgress.Progressing, GoalProgress.Regressing, GoalProgress.Stagnant].map((gp) => (
                <SelectItem key={gp} value={gp.toString()}>
                  {progress2text(gp)}
                </SelectItem>
              ))}
            </SelectGroup>
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
      <div className="space-y-2">
        <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
          <div className="w-5 h-5 bg-orange-50 rounded-md flex items-center justify-center">
            <Dumbbell className="w-4 h-4 text-orange-600" />
          </div>
          Physical Health
        </Label>
        <Select
          value={note.physicalHealth !== Health.UnspecifiedHealth ? note.physicalHealth.toString() : ""}
          onValueChange={(value) => setNote(n => ({ ...n, physicalHealth: parseInt(value) }))}
        >
          <SelectTrigger className="border-gray-300 focus:border-blue-400 focus:ring-blue-400/20">
            <SelectValue placeholder="Select Patient's Physical Health" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Physical Health</SelectLabel>
              {[Health.Good, Health.Fair, Health.Poor].map((health) => (
                <SelectItem key={health} value={health.toString()}>
                  {health2text(health)}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
          <div className="w-5 h-5 bg-pink-50 rounded-md flex items-center justify-center">
            <HandHeart className="w-4 h-4 text-pink-600" />
          </div>
          Emotional Health
        </Label>
        <Select
          value={note.emotionalHealth !== Health.UnspecifiedHealth ? note.emotionalHealth.toString() : ""}
          onValueChange={(value) => setNote(n => ({ ...n, emotionalHealth: parseInt(value) }))}
        >
          <SelectTrigger className="border-gray-300 focus:border-blue-400 focus:ring-blue-400/20">
            <SelectValue placeholder="Select Patient's Emotional Health" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Emotional Health</SelectLabel>
              {[Health.Good, Health.Fair, Health.Poor].map((health) => (
                <SelectItem key={health} value={health.toString()}>
                  {health2text(health)}
                </SelectItem>
              ))}
            </SelectGroup>
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
    <div className="flex flex-col w-full space-y-4 col-span-1 md:col-span-2">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <Checkbox
                checked={note.exhibitedBehaviors}
                onCheckedChange={c => toggleExhibitedBehaviors(!!c)}
              />
              <Label
                className="text-sm text-blue-600 cursor-pointer"
                onClick={() => toggleExhibitedBehaviors(!note.exhibitedBehaviors)}
              >
                Patient Exhibited Maladaptive Behaviors
              </Label>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-2 w-full">
        <Label className={cn(
          "text-sm font-semibold text-gray-700 flex items-center gap-2",
          !note.exhibitedBehaviors && "text-muted-foreground"
        )}>
          <div className="w-5 h-5 bg-red-50 rounded-md flex items-center justify-center">
            <MessageCircleWarning className="w-4 h-4 text-red-600" />
          </div>
          Describe Exhibited Behaviors
        </Label>
        <Textarea
          className="w-full border-gray-300 focus:border-blue-400 focus:ring-blue-400/20"
          placeholder="Describe the exhibited behaviors..."
          rows={4}
          value={note.behaviorDescription}
          onChange={(e) => updateExhibitedBehaviorsDescription(e.target.value)}
          disabled={!note.exhibitedBehaviors}
          maxLength={500}
        />
        <p className="text-xs text-gray-500">
          {note.behaviorDescription.length}/500 characters
        </p>
      </div>
    </div>
  );
}