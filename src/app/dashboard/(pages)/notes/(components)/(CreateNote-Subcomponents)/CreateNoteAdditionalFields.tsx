"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import React, { useEffect, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useNoteStore } from "@/lib/state";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { CheckCircle, XCircle } from "lucide-react";
import { CreateNoteResponse, GoalProgress, Health } from "@/proto/note_pb";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { fn } from "@/lib/utils";
import { createNote } from "@/app/dashboard/(pages)/notes/[id]/actions";
import { Timestamp } from "@bufbuild/protobuf";
import { noteAdditionalInformationSchema } from "@/lib/schemas/schemas";

export function CreateNoteAdditionalFields() {
  const { note, setNote } = useNoteStore();

  const toggleMonthlyDiscussion = (value: boolean) => setNote(n => ({ ...n, discussedMonthlyEducation: value }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Additional Fields</CardTitle>
        <CardDescription>
          Confirm if a monthly discussion was taken, and provide any additional information regarding the consumer and this session.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-3 md:gap-6">
          <div className="flex items-center gap-2">
            <Checkbox checked={!!note.discussedMonthlyEducation} onCheckedChange={c => toggleMonthlyDiscussion(!!c)} />
            <Label className="text-sm font-bold cursor-pointer" onClick={() => toggleMonthlyDiscussion(!note.discussedMonthlyEducation)}>
              Discussed Monthly Education With Patient
            </Label>
          </div>
          <div className="flex flex-col gap-2">
            <Label className="text-sm font-bold cursor-pointer">
              Additional Information <span className="text-muted-foreground font-normal">(Optional)</span>
            </Label>
            <Textarea
              className="w-full h-24 p-2 rounded-md"
              value={note.additionalInformation}
              onChange={e => setNote({ ...note, additionalInformation: e.target.value })}
              maxLength={noteAdditionalInformationSchema.max}
            />
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <NoteValidationDialog />
      </CardFooter>
    </Card>
  );
}

function NoteValidationDialog() {
  const { note, resetNote } = useNoteStore();
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  const [validationResults, setValidationResults] = useState({
    hasStep: false,
    hasEvent: false,
    hasPatient: false,
    hasGoal: false,
    hasRequiredFields: false
  });
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    const results = {
      hasStep: note.steps.length > 0,
      hasEvent: note.events.length > 0,
      hasPatient: note.patient.id !== "",
      hasGoal: note.goalId !== "",
      hasRequiredFields:
        note.physicalHealth !== Health.UnspecifiedHealth &&
        note.emotionalHealth !== Health.UnspecifiedHealth &&
        note.exhibitedBehaviors !== null &&
        (!note.exhibitedBehaviors || note.behaviorDescription !== "") &&
        note.goalProgress !== GoalProgress.UnspecifiedGoalProgress
    };

    setValidationResults(results)
    setIsValid(Object.values(results).every(Boolean))
  }, [note]);

  const createNoteMutation = useMutation<CreateNoteResponse>({
    mutationKey: ["createNote", note],
    mutationFn: fn(() => createNote({
      patientId: note.patient.id,
      date: Timestamp.fromDate(note.date).toJsonString(),
      physicalHealth: note.physicalHealth,
      emotionalHealth: note.emotionalHealth,
      exhibitedMaladaptiveBehavior: note.exhibitedBehaviors ?? false,
      behaviorDescription: note.exhibitedBehaviors ? note.behaviorDescription : undefined,
      goalId: note.goalId,
      goalProgress: note.goalProgress,
      discussedMonthlyEducation: note.discussedMonthlyEducation ?? false,
      additionalInfo: note.additionalInformation,
      events: note.events,
      steps: note.steps,
    })),
    onSuccess: ({ noteId }) => {
      router.replace(`/dashboard/notes/${noteId}`);
      resetNote();
    },
  });

  const ValidationItem = ({ isValid, label }: { isValid: boolean, label: string }) => (
    <div className="flex items-center space-x-1">
      {isValid ? (
        <CheckCircle className="h-4 w-4 text-green-500" />
      ) : (
        <XCircle className="h-4 w-4 text-red-500 dark:text-mocha-red" />
      )}
      <span className="text-sm text-muted-foreground mb-[1px]">{label}</span>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger className="w-full flex justify-end">
        <Button className="w-full font-bold">Create Note</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Note</DialogTitle>
          <DialogDescription>
            Please ensure that all required fields are filled before creating the note.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2">
          <ValidationItem isValid={validationResults.hasPatient} label="Selected a patient." />
          <ValidationItem isValid={validationResults.hasGoal} label="Selected the goal being worked on during the session." />
          <ValidationItem isValid={validationResults.hasRequiredFields} label="All required fields filled" />
          <ValidationItem isValid={validationResults.hasStep} label="Outline at least one health and safety step taken." />
          <ValidationItem isValid={validationResults.hasEvent} label="Describe at least one event that had taken place." />
        </div>
        <DialogFooter>
          <Button variant="outline" className="font-bold" onClick={() => setIsOpen(false)}>Close</Button>
          <Button className="font-bold" onClick={() => createNoteMutation.mutate()} disabled={!isValid}>Create Note</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}