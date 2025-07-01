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
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { CreateNoteResponse } from "@/proto/note_pb";
import { fn } from "@/lib/utils";
import { createNote } from "@/app/dashboard/(pages)/notes/[id]/actions";
import { Timestamp } from "@bufbuild/protobuf";
import { useRouter } from "next/navigation";

export function CreateNoteAdditionalFields() {
  const { note, setNote } = useNoteStore();

  const toggleMonthlyDiscussion = (value: boolean) => setNote(n => ({ ...n, discussedMonthlyEducation: value }));

  return (
    <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader className="border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
            <CheckCircle className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <CardTitle className="text-xl font-semibold text-gray-900">
              Additional Fields
            </CardTitle>
            <CardDescription className="text-gray-600">
              Confirm if a monthly discussion was taken, and provide any additional information regarding the consumer and this session.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="flex flex-col gap-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    checked={!!note.discussedMonthlyEducation}
                    onCheckedChange={c => toggleMonthlyDiscussion(!!c)}
                  />
                  <Label
                    className="text-sm font-medium text-blue-800 cursor-pointer"
                    onClick={() => toggleMonthlyDiscussion(!note.discussedMonthlyEducation)}
                  >
                    Discussed Monthly Education With Patient
                  </Label>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <div className="w-5 h-5 bg-gray-50 rounded-md flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-gray-600" />
              </div>
              Additional Information <span className="text-gray-500 font-normal">(Optional)</span>
            </Label>
            <Textarea
              className="min-h-[100px] border-gray-300 focus:border-blue-400 focus:ring-blue-400/20"
              value={note.additionalInformation || ''}
              onChange={e => setNote({ ...note, additionalInformation: e.target.value })}
              placeholder="Enter any additional information about the session..."
              maxLength={500}
            />
            <p className="text-xs text-gray-500">
              {(note.additionalInformation || '').length}/500 characters
            </p>
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
      hasPatient: note.patient?.id !== "" && note.patient?.id !== undefined,
      hasGoal: note.goalId !== "" && note.goalId !== undefined,
      hasRequiredFields:
        note.physicalHealth !== undefined &&
        note.emotionalHealth !== undefined &&
        note.exhibitedBehaviors !== null &&
        (!note.exhibitedBehaviors || note.behaviorDescription !== "") &&
        note.goalProgress !== undefined
    };

    setValidationResults(results);
    setIsValid(Object.values(results).every(Boolean));
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
    <div className="flex items-center space-x-2">
      {isValid ? (
        <CheckCircle className="h-4 w-4 text-green-500" />
      ) : (
        <XCircle className="h-4 w-4 text-red-500" />
      )}
      <span className="text-sm text-gray-700">{label}</span>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="w-full font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg">
          Create Note
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md md:min-w-[35vw]">
        <DialogHeader>
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold text-gray-900">
                Create Note
              </DialogTitle>
              <DialogDescription className="text-gray-600">
                Please ensure that all required fields are filled before creating the note.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-3">
          <ValidationItem isValid={validationResults.hasPatient} label="Selected a patient" />
          <ValidationItem isValid={validationResults.hasGoal} label="Selected the goal being worked on during the session" />
          <ValidationItem isValid={validationResults.hasRequiredFields} label="All required fields filled" />
          <ValidationItem isValid={validationResults.hasStep} label="Outline at least one health and safety step taken" />
          <ValidationItem isValid={validationResults.hasEvent} label="Describe at least one event that had taken place" />
        </div>

        {!isValid && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <XCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
              <p className="text-sm text-red-700">
                Please complete all required fields before creating the note.
              </p>
            </div>
          </div>
        )}

        <DialogFooter className="gap-2 pt-6">
          <Button
            variant="outline"
            onClick={() => setIsOpen(false)}
            className="font-semibold"
          >
            Close
          </Button>
          <Button
            onClick={() => createNoteMutation.mutate()}
            disabled={!isValid}
            className="font-semibold bg-blue-600 hover:bg-blue-700 text-white"
          >
            Create Note
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}