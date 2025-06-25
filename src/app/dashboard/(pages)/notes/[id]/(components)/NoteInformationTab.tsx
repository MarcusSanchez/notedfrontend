"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button, buttonVariants } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import {
  CalendarIcon,
  ClipboardPen,
  Dumbbell,
  Edit,
  FileText,
  HandHeart,
  Stethoscope,
  Trash2,
  TrendingUp,
  Trophy,
} from 'lucide-react'
import { Textarea } from "@/components/ui/textarea";
import { timestamp2date } from "@/lib/tools/timestamp2date";
import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cn, fn } from "@/lib/utils";
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
import { GoalProgress, Health, Note } from "@/proto/note_pb";
import { deleteNote, updateNote } from "@/app/dashboard/(pages)/notes/[id]/actions";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { health2text, progress2text } from "@/lib/tools/enum2text";
import { Timestamp } from "@bufbuild/protobuf";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";

export function NoteInformationTab({ note }: { note: Note }) {
  const qc = useQueryClient();
  const router = useRouter();
  const { toast } = useToast();

  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [date, setDate] = useState(timestamp2date(note.date!) || new Date());
  const [physicalHealth, setPhysicalHealth] = useState(note.physicalHealth);
  const [emotionalHealth, setEmotionalHealth] = useState(note.emotionalHealth);
  const [exhibitedMaladaptiveBehavior, setExhibitedMaladaptiveBehavior] = useState(note.exhibitedMaladaptiveBehavior);
  const [behaviorDescription, setBehaviorDescription] = useState(note.behaviorDescription || "");
  const [goalProgress, setGoalProgress] = useState(note.goalProgress);
  const [discussedMonthlyEducation, setDiscussedMonthlyEducation] = useState(note.discussedMonthlyEducation);
  const [additionalInformation, setAdditionalInformation] = useState(note.additionalInfo || "");

  const deleteNoteMutation = useMutation({
    mutationKey: ["deleteNote", note.id],
    mutationFn: fn(() => deleteNote({ noteId: note.id })),
    onSuccess: () => {
      router.push("/dashboard/notes");
      toast({
        title: "Successfully deleted note.",
        description: `The note has been removed from the system.`,
      });
    }
  });

  const updateNoteMutation = useMutation({
    mutationKey: ["updateNote", note.id],
    mutationFn: fn(() => updateNote({
      noteId: note.id,
      date: Timestamp.fromDate(date).toJsonString(),
      physicalHealth: physicalHealth !== note.physicalHealth ? physicalHealth : undefined,
      emotionalHealth: emotionalHealth !== note.emotionalHealth ? emotionalHealth : undefined,
      exhibitedMaladaptiveBehavior: exhibitedMaladaptiveBehavior !== note.exhibitedMaladaptiveBehavior ? exhibitedMaladaptiveBehavior : undefined,
      behaviorDescription: exhibitedMaladaptiveBehavior ? behaviorDescription !== note.behaviorDescription ? behaviorDescription : undefined : "",
      goalProgress: goalProgress !== note.goalProgress ? goalProgress : undefined,
      discussedMonthlyEducation: discussedMonthlyEducation !== note.discussedMonthlyEducation ? discussedMonthlyEducation : undefined,
      additionalInfo: additionalInformation !== note.additionalInfo ? additionalInformation : undefined,
    })),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["getNote"] }).then(() => setIsUpdateDialogOpen(false));
    }
  });

  const handleUpdateNote = () => {
    updateNoteMutation.mutate();
  };

  const handleCancelUpdate = () => {
    setDate(timestamp2date(note.date!) || new Date());
    setPhysicalHealth(note.physicalHealth);
    setEmotionalHealth(note.emotionalHealth);
    setExhibitedMaladaptiveBehavior(note.exhibitedMaladaptiveBehavior);
    setBehaviorDescription(note.behaviorDescription || "");
    setGoalProgress(note.goalProgress);
    setDiscussedMonthlyEducation(note.discussedMonthlyEducation);
    setAdditionalInformation(note.additionalInfo || "");
    setIsUpdateDialogOpen(false);
  };

  return (
    <Card className="w-full mx-auto mb-6">
      <CardHeader>
        <CardTitle className="text-2xl font-bold flex items-center gap-2">
          <ClipboardPen className="w-6 h-6" />
          Note Information
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6">
          <div>
            <Label className="text-sm font-bold">
              Patient First Name
            </Label>
            <Input value={note.patient?.firstName} readOnly className="mt-1" />
          </div>
          <div>
            <Label className="text-sm font-bold">
              Patient Last Name
            </Label>
            <Input value={note.patient?.lastName} readOnly className="mt-1" />
          </div>
          <div className="md:col-span-2">
            <Label className="text-sm font-bold flex items-center gap-2">
              <Stethoscope className="w-4 h-4" />
              Nurse
            </Label>
            <Input value={note.nurse?.name} readOnly className="mt-1" />
          </div>
          <div>
            <Label className="text-sm font-bold flex items-center gap-2">
              <CalendarIcon className="w-4 h-4" />
              Date of Note
            </Label>
            <Input
              value={note.date && timestamp2date(note.date).toLocaleDateString() || "N/A"}
              readOnly
              className="mt-1"
            />
          </div>
          <div>
            <Label className="text-sm font-bold flex items-center gap-2">
              <CalendarIcon className="w-4 h-4" />
              Note Created
            </Label>
            <Input
              value={note.createdAt && timestamp2date(note.createdAt).toLocaleDateString() || "N/A"}
              readOnly
              className="mt-1"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox checked={note.exhibitedMaladaptiveBehavior} disabled />
            <Label className="text-sm font-bold">
              Patient Exhibited Maladaptive Behaviors
            </Label>
          </div>
          <div className="col-span-full">
            <Label
              className={cn(
                "text-sm font-bold flex items-center gap-2",
                !exhibitedMaladaptiveBehavior && "text-muted-foreground"
              )}
            >
              <FileText className="w-4 h-4" />
              Maladaptive Behaviors Description
            </Label>
            <Textarea
              value={note.behaviorDescription || "No behavior description provided."}
              rows={4}
              readOnly
              disabled={!note.exhibitedMaladaptiveBehavior}
              className="mt-1"
            />
          </div>
          <div>
            <Label className="text-sm font-bold flex items-center gap-2">
              <Dumbbell className="w-4 h-4" />
              Physical Health
            </Label>
            <Input value={health2text(note.physicalHealth)} readOnly className="mt-1" />
          </div>
          <div>
            <Label className="text-sm font-bold flex items-center gap-2">
              <HandHeart className="w-4 h-4" />
              Emotional Health
            </Label>
            <Input value={health2text(note.emotionalHealth)} readOnly className="mt-1" />
          </div>
          <div>
            <Label className="text-sm font-bold flex items-center gap-2">
              <Trophy className="w-4 h-4" />
              Goal Description
            </Label>
            <Input value={note.goal?.description} readOnly className="mt-1" />
          </div>
          <div>
            <Label className="text-sm font-bold flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Goal Progress
            </Label>
            <Input value={progress2text(note.goalProgress)} readOnly className="mt-1" />
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox checked={note.discussedMonthlyEducation} disabled />
            <Label className="text-sm font-bold">
              Discussed Monthly Education
            </Label>
          </div>
          <div className="col-span-full">
            <Label className="text-sm font-bold flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Additional Information
            </Label>
            <Textarea
              value={note.additionalInfo || "No additional information provided."}
              rows={4}
              readOnly
              className="mt-1"
            />
          </div>
        </div>
        <div className="flex justify-end mt-6 space-x-2">
          <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="font-bold" size="sm">
                <Edit className="h-4 w-4 mr-2" />
                Update Note
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[850px]">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold">Update Note</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="flex flex-col gap-2">
                  <Label className="font-bold">
                    Date
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
                        {date ? format(date, 'PPP') : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={(newDate) => setDate(newDate || new Date())}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="flex gap-2 w-full">
                  <div className="flex flex-col gap-2 flex-grow">
                    <Label className="font-bold">
                      Physical Health
                    </Label>
                    <Select value={physicalHealth.toString()} onValueChange={(value) => setPhysicalHealth(parseInt(value))}>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select physical health" />
                      </SelectTrigger>
                      <SelectContent>
                        {[Health.Good, Health.Fair, Health.Poor].map((value) => (
                          <SelectItem key={value} value={value.toString()}>
                            {health2text(value)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex flex-col gap-2 flex-grow">
                    <Label className="font-bold">
                      Emotional Health
                    </Label>
                    <Select value={emotionalHealth.toString()} onValueChange={(value) => setEmotionalHealth(parseInt(value))}>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select emotional health" />
                      </SelectTrigger>
                      <SelectContent>
                        {[Health.Good, Health.Fair, Health.Poor].map((value) => (
                          <SelectItem key={value} value={value.toString()}>
                            {health2text(value)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Label className="font-bold">
                    Goal Progress
                  </Label>
                  <Select value={goalProgress.toString()} onValueChange={(value) => setGoalProgress(parseInt(value))}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select goal progress" />
                    </SelectTrigger>
                    <SelectContent>
                      {[GoalProgress.Progressing, GoalProgress.Regressing, GoalProgress.Stagnant].map((value) => (
                        <SelectItem key={value} value={value.toString()}>
                          {progress2text(value)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    checked={exhibitedMaladaptiveBehavior}
                    onCheckedChange={(checked) => setExhibitedMaladaptiveBehavior(!!checked)}
                  />
                  <Label className="font-bold text-sm cursor-pointer" onClick={() => setExhibitedMaladaptiveBehavior(c => !c)}>
                    Exhibited Maladaptive Behavior
                  </Label>
                </div>
                <div className="grid gap-2">
                  <Label className={cn("font-bold", !exhibitedMaladaptiveBehavior && "text-muted-foreground")}>
                    Behavior Description
                  </Label>
                  <Textarea
                    placeholder="Describe the exhibited maladaptive behavior..."
                    disabled={!exhibitedMaladaptiveBehavior}
                    value={behaviorDescription}
                    onChange={(e) => setBehaviorDescription(e.target.value)}
                    rows={4}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    checked={discussedMonthlyEducation}
                    onCheckedChange={(checked) => setDiscussedMonthlyEducation(checked as boolean)}
                  />
                  <Label className="font-bold text-sm cursor-pointer">
                    Discussed Monthly Education
                  </Label>
                </div>
                <div>
                  <Label className="font-bold">
                    Additional Information
                  </Label>
                  <Textarea
                    placeholder="Enter additional information here..."
                    value={additionalInformation}
                    onChange={(e) => setAdditionalInformation(e.target.value)}
                    rows={4}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={handleCancelUpdate} className="font-bold">
                  Cancel
                </Button>
                <Button type="submit" onClick={handleUpdateNote} className="font-bold">
                  Update Note
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button className="font-bold" variant="destructive" size="sm">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Note
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  Deleting this note is permanent and cannot be undone. All data associated with this note will be lost.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  className={cn(buttonVariants({ variant: "destructive" }))}
                  onClick={() => deleteNoteMutation.mutate()}
                >
                  Delete Note
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );
}
