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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import {
  Calendar as CalendarIcon,
  Clock,
  Trophy,
  TrendingUp,
  Dumbbell,
  Heart as HandHeart,
  MessageCircle as MessageCircleWarning,
  FileText,
  Edit,
  Trash2,
  User,
  Clipboard,
  Save,
  X
} from 'lucide-react';
import { format } from 'date-fns';
import { cn, fn } from '@/lib/utils';
import { GoalProgress, Health, Note } from '@/proto/note_pb';
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { deleteNote, updateNote } from '../actions';
import { Timestamp } from "@bufbuild/protobuf";
import { timestamp2date } from "@/lib/tools/timestamp2date";
import { health2text, progress2text } from "@/lib/tools/enum2text";

export function NoteInformationTab({ note }: { note: Note }) {
  const qc = useQueryClient();
  const router = useRouter();
  const { toast } = useToast();

  // this is done because the .toJsonString() doesn't exist due to how next.js handles classes in server actions, but ts doesn't know better
  note.date = Timestamp.fromDate(timestamp2date(note.date!));

  const [isEditing, setIsEditing] = useState(false);
  const [date, setDate] = useState(note.date!);
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
      date: date.toJsonString(),
      physicalHealth: physicalHealth !== note.physicalHealth ? physicalHealth : undefined,
      emotionalHealth: emotionalHealth !== note.emotionalHealth ? emotionalHealth : undefined,
      exhibitedMaladaptiveBehavior: exhibitedMaladaptiveBehavior !== note.exhibitedMaladaptiveBehavior ? exhibitedMaladaptiveBehavior : undefined,
      behaviorDescription: exhibitedMaladaptiveBehavior ? behaviorDescription !== note.behaviorDescription ? behaviorDescription : undefined : "",
      goalProgress: goalProgress !== note.goalProgress ? goalProgress : undefined,
      discussedMonthlyEducation: discussedMonthlyEducation !== note.discussedMonthlyEducation ? discussedMonthlyEducation : undefined,
      additionalInfo: additionalInformation !== note.additionalInfo ? additionalInformation : undefined,
    })),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["getNote"] });
    }
  });

  const hasChanged = (
    date.toJsonString() !== note.date!.toJsonString() ||
    physicalHealth !== note.physicalHealth ||
    emotionalHealth !== note.emotionalHealth ||
    exhibitedMaladaptiveBehavior !== note.exhibitedMaladaptiveBehavior ||
    (exhibitedMaladaptiveBehavior && behaviorDescription !== note.behaviorDescription) ||
    goalProgress !== note.goalProgress ||
    discussedMonthlyEducation !== note.discussedMonthlyEducation ||
    additionalInformation !== note.additionalInfo
  );

  const handleCancelEdit = () => {
    setDate(note.date!);
    setPhysicalHealth(note.physicalHealth);
    setEmotionalHealth(note.emotionalHealth);
    setExhibitedMaladaptiveBehavior(note.exhibitedMaladaptiveBehavior);
    setBehaviorDescription(note.behaviorDescription || "");
    setGoalProgress(note.goalProgress);
    setDiscussedMonthlyEducation(note.discussedMonthlyEducation);
    setAdditionalInformation(note.additionalInfo || "");
    setIsEditing(false);
  };

  return (
    <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader className="border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Clipboard className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-xl font-semibold text-gray-900">
                Note Information
              </CardTitle>
              <CardDescription className="text-gray-600">
                View and update information about this note
              </CardDescription>
            </div>
          </div>
          <div className="flex space-x-2">
            {!isEditing ? (
              <>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="border-red-200 text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete Note
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                          <Trash2 className="w-6 h-6 text-red-600" />
                        </div>
                        <div>
                          <AlertDialogTitle className="text-xl font-bold text-gray-900">
                            Delete Note
                          </AlertDialogTitle>
                          <AlertDialogDescription className="text-gray-600">
                            This action cannot be undone. This will permanently delete the note and all associated data.
                          </AlertDialogDescription>
                        </div>
                      </div>
                    </AlertDialogHeader>
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 my-4">
                      <div className="flex items-start space-x-3">
                        <div className="text-sm text-red-800">
                          <p className="font-medium mb-2">This will permanently delete:</p>
                          <ul className="space-y-1 text-red-700">
                            <li>• This note and all its content</li>
                            <li>• All events and steps recorded</li>
                            <li>• Generated content</li>
                            <li>• All associated data</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => deleteNoteMutation.mutate()}
                        className="bg-red-600 hover:bg-red-700 text-white"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete Note
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
                <Button
                  variant="outline"
                  className="border-blue-200 text-blue-600 hover:bg-blue-50"
                  onClick={() => setIsEditing(true)}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Note
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  className="border-gray-200 text-gray-600 hover:bg-gray-50"
                  onClick={handleCancelEdit}
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
                <Button
                  variant="outline"
                  className="border-blue-200 text-blue-600 hover:bg-blue-50"
                  onClick={() => updateNoteMutation.mutate()}
                  disabled={updateNoteMutation.isPending || !hasChanged}
                >
                  {updateNoteMutation.isPending ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
              </>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <div className="w-5 h-5 bg-blue-50 rounded-md flex items-center justify-center">
                <User className="w-4 h-4 text-blue-600" />
              </div>
              Patient Name
            </Label>
            <Input
              value={`${note.patient!.firstName} ${note.patient!.lastName}`}
              readOnly
              className={cn(
                "border-gray-200 focus:border-blue-400 focus:ring-blue-400/20",
                isEditing ? "bg-gray-50 opacity-70" : "bg-white/80"
              )}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <div className="w-5 h-5 bg-purple-50 rounded-md flex items-center justify-center">
                <User className="w-4 h-4 text-purple-600" />
              </div>
              Nurse Name
            </Label>
            <Input
              value={note.nurse!.name}
              readOnly
              className={cn(
                "border-gray-200 focus:border-blue-400 focus:ring-blue-400/20",
                isEditing ? "bg-gray-50 opacity-70" : "bg-white/80"
              )}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <div className="w-5 h-5 bg-green-50 rounded-md flex items-center justify-center">
                <Clock className="w-4 h-4 text-green-600" />
              </div>
              Date of Care
            </Label>
            {isEditing ? (
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal border-gray-300 focus:border-blue-400 focus:ring-blue-400/20",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(timestamp2date(date), 'PPP') : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date && timestamp2date(date)}
                    onSelect={(newDate) => setDate(newDate ? Timestamp.fromDate(newDate) : Timestamp.fromDate(new Date()))}
                  />
                </PopoverContent>
              </Popover>
            ) : (
              <Input
                value={format(timestamp2date(note.date!), 'PPP')}
                readOnly
                className="bg-white/80 border-gray-200 focus:border-blue-400 focus:ring-blue-400/20"
              />
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <div className="w-5 h-5 bg-indigo-50 rounded-md flex items-center justify-center">
                <CalendarIcon className="w-4 h-4 text-indigo-600" />
              </div>
              Date Created
            </Label>
            <Input
              value={format(timestamp2date(note.createdAt!), 'PPP')}
              readOnly
              className={cn(
                "border-gray-200 focus:border-blue-400 focus:ring-blue-400/20",
                isEditing ? "bg-gray-50 opacity-70" : "bg-white/80"
              )}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <div className="w-5 h-5 bg-yellow-50 rounded-md flex items-center justify-center">
                <Trophy className="w-4 h-4 text-yellow-600" />
              </div>
              Goal
            </Label>
            <Input
              value={note.goal!.description}
              readOnly
              className={cn(
                "border-gray-200 focus:border-blue-400 focus:ring-blue-400/20",
                isEditing ? "bg-gray-50 opacity-70" : "bg-white/80"
              )}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <div className="w-5 h-5 bg-purple-50 rounded-md flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-purple-600" />
              </div>
              Goal Progress
            </Label>
            {isEditing ? (
              <Select
                value={goalProgress.toString()}
                onValueChange={(value) => setGoalProgress(parseInt(value))}
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
            ) : (
              <Input
                value={progress2text(note.goalProgress)}
                readOnly
                className="bg-white/80 border-gray-200 focus:border-blue-400 focus:ring-blue-400/20"
              />
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <div className="w-5 h-5 bg-orange-50 rounded-md flex items-center justify-center">
                <Dumbbell className="w-4 h-4 text-orange-600" />
              </div>
              Physical Health
            </Label>
            {isEditing ? (
              <Select
                value={physicalHealth.toString()}
                onValueChange={(value) => setPhysicalHealth(parseInt(value))}
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
            ) : (
              <Input
                value={health2text(note.physicalHealth)}
                readOnly
                className="bg-white/80 border-gray-200 focus:border-blue-400 focus:ring-blue-400/20"
              />
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <div className="w-5 h-5 bg-pink-50 rounded-md flex items-center justify-center">
                <HandHeart className="w-4 h-4 text-pink-600" />
              </div>
              Emotional Health
            </Label>
            {isEditing ? (
              <Select
                value={emotionalHealth.toString()}
                onValueChange={(value) => setEmotionalHealth(parseInt(value))}
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
            ) : (
              <Input
                value={health2text(note.emotionalHealth)}
                readOnly
                className="bg-white/80 border-gray-200 focus:border-blue-400 focus:ring-blue-400/20"
              />
            )}
          </div>

          {note.patient!.hasMaladaptiveBehaviors && (
            <div className="flex items-center space-x-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="w-5 h-5 bg-blue-100 rounded-md flex items-center justify-center">
                <Checkbox
                  id="maladaptiveBehaviors"
                  checked={isEditing ? exhibitedMaladaptiveBehavior : note.exhibitedMaladaptiveBehavior}
                  disabled={!isEditing}
                  onCheckedChange={(checked) => setExhibitedMaladaptiveBehavior(!!checked)}
                  className="border-blue-400"
                />
              </div>
              <Label
                htmlFor="maladaptiveBehaviors"
                className="text-sm font-semibold text-blue-800 cursor-pointer"
                onClick={() => isEditing && setExhibitedMaladaptiveBehavior(c => !c)}
              >
                Patient Exhibited Maladaptive Behaviors
              </Label>
            </div>
          )}

          <div className="flex items-center space-x-3 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="w-5 h-5 bg-green-100 rounded-md flex items-center justify-center">
              <Checkbox
                id="monthlyEducation"
                checked={isEditing ? discussedMonthlyEducation : note.discussedMonthlyEducation}
                disabled={!isEditing}
                onCheckedChange={(checked) => setDiscussedMonthlyEducation(!!checked)}
                className="border-green-400"
              />
            </div>
            <Label
              htmlFor="monthlyEducation"
              className="text-sm font-semibold text-green-800 cursor-pointer"
              onClick={() => isEditing && setDiscussedMonthlyEducation(c => !c)}
            >
              Discussed Monthly Education With Patient
            </Label>
          </div>
        </div>

        {(note.exhibitedMaladaptiveBehavior || (isEditing && exhibitedMaladaptiveBehavior)) && (
          <div className="mt-6 space-y-2">
            <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <div className="w-5 h-5 bg-red-50 rounded-md flex items-center justify-center">
                <MessageCircleWarning className="w-4 h-4 text-red-600" />
              </div>
              Behavior Description
            </Label>
            {isEditing ? (
              <>
                <Textarea
                  value={behaviorDescription}
                  onChange={(e) => setBehaviorDescription(e.target.value)}
                  rows={4}
                  disabled={!exhibitedMaladaptiveBehavior}
                  className="border-gray-300 focus:border-blue-400 focus:ring-blue-400/20"
                  placeholder="Describe the exhibited behaviors..."
                  maxLength={500}
                />
                <p className="text-xs text-gray-500">
                  {behaviorDescription.length}/500 characters
                </p>
              </>
            ) : (
              <Textarea
                value={note.behaviorDescription || "No behavior description provided."}
                rows={4}
                readOnly
                className="bg-white/80 border-gray-200 focus:border-blue-400 focus:ring-blue-400/20"
              />
            )}
          </div>
        )}

        <div className="mt-6 space-y-2">
          <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <div className="w-5 h-5 bg-gray-50 rounded-md flex items-center justify-center">
              <FileText className="w-4 h-4 text-gray-600" />
            </div>
            Additional Information
          </Label>
          {isEditing ? (
            <>
              <Textarea
                value={additionalInformation}
                onChange={(e) => setAdditionalInformation(e.target.value)}
                rows={4}
                className="border-gray-300 focus:border-blue-400 focus:ring-blue-400/20"
                placeholder="Enter any additional information..."
                maxLength={500}
              />
              <p className="text-xs text-gray-500">
                {additionalInformation.length}/500 characters
              </p>
            </>
          ) : (
            <Textarea
              value={note.additionalInfo || "No additional information provided."}
              rows={4}
              readOnly
              className="bg-white/80 border-gray-200 focus:border-blue-400 focus:ring-blue-400/20"
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
}