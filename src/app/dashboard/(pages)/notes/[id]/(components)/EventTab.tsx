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
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
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
import { Separator } from '@/components/ui/separator';
import {
  PlusCircle,
  Edit,
  Trash2,
  ChevronDown,
  ChevronUp,
  X,
  Activity
} from 'lucide-react';
import { MethodType } from '@/proto/note_pb';
import { Note } from '@/proto/note_pb';
import { method2text } from "@/lib/tools/enum2text";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  addChoiceToEvent,
  addEvent,
  addMethodToEvent,
  removeChoiceFromEvent,
  removeEvent, removeMethodFromEvent, updateChoiceInEvent,
  updateEventDescription
} from "@/app/dashboard/(pages)/notes/[id]/actions";
import { fn } from "@/lib/utils";

export function EventsTab({ note }: { note: Note }) {
  const qc = useQueryClient();

  const [open, setOpen] = useState(false);
  const [eventDescription, setEventDescription] = useState('');
  const [eventMethods, setEventMethods] = useState<MethodType[]>([]);
  const [eventChoices, setEventChoices] = useState<string[]>([]);
  const [hasChoices, setHasChoices] = useState(false);
  const [newChoice, setNewChoice] = useState('');

  const addEventMutation = useMutation({
    mutationKey: ['addEvent', note.id],
    mutationFn: fn(() => addEvent({
      noteId: note.id,
      event: {
        description: eventDescription,
        methods: eventMethods,
        choices: eventChoices,
      },
    })),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['getNote', note.id] });
      setOpen(false);
      setEventDescription('');
      setEventMethods([]);
      setEventChoices([]);
    },
  });

  const addMethod = (method: MethodType) => setEventMethods((prev) => [...prev, method]);
  const removeMethod = (index: number) => setEventMethods((prev) => prev.filter((_, i) => i !== index));

  const addChoice = () => {
    if (newChoice.trim()) {
      setEventChoices((prev) => [...prev, newChoice.trim()]);
      setNewChoice('');
    }
  };

  const removeChoice = (index: number) => setEventChoices((prev) => prev.filter((_, i) => i !== index));

  const filteredMethods = [
    MethodType.VerbalPrompt,
    MethodType.VisualQueue,
    MethodType.Gesture,
    MethodType.PhysicalPrompt,
    MethodType.Shadowing,
    MethodType.HandOverHand,
    MethodType.TotalAssist,
  ].filter((method) => !eventMethods.includes(method));

  return (
    <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader className="border-b border-gray-100">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Activity className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <CardTitle className="text-xl font-semibold text-gray-900">
                Events
              </CardTitle>
              <CardDescription className="text-gray-600">
                {note.events.length} event{note.events.length !== 1 ? 's' : ''} recorded for this note
              </CardDescription>
            </div>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="border-green-200 text-green-600 hover:bg-green-50">
                <PlusCircle className="w-4 h-4 mr-2" />
                Add Event
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold text-gray-900">
                  Add New Event
                </DialogTitle>
                <DialogDescription className="text-gray-600">
                  Please provide a description of the event, the methods used, and the choices provided.
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-6 py-4">
                {/* Event Description */}
                <div className="space-y-2">
                  <Label htmlFor="event-description" className="text-sm font-semibold text-gray-700">
                    Event Description
                  </Label>
                  <Textarea
                    id="event-description"
                    value={eventDescription}
                    onChange={(e) => setEventDescription(e.target.value)}
                    placeholder="Describe the event..."
                    className="min-h-[100px] border-gray-300 focus:border-blue-400 focus:ring-blue-400/20"
                    maxLength={500}
                  />
                  <p className="text-xs text-gray-500">
                    {eventDescription.length}/500 characters
                  </p>
                </div>

                {/* Methods */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <Label className="text-sm font-semibold text-gray-700">Methods</Label>
                      <p className="text-xs text-gray-500">What methods did you use to assist in this event?</p>
                    </div>
                    <Select
                      value=""
                      onValueChange={(value) => {
                        const methodType = parseInt(value) as MethodType;
                        addMethod(methodType);
                      }}
                    >
                      <SelectTrigger className="w-[200px] focus:border-blue-400 focus:ring-blue-400/20">
                        <SelectValue placeholder="Select Method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Choose a method</SelectLabel>
                          {filteredMethods.map((method) => (
                            <SelectItem key={method} value={method.toString()}>
                              {method2text(method)}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Selected Methods */}
                  <div className="flex flex-wrap gap-2">
                    {eventMethods.map((method, index) => (
                      <div
                        key={index}
                        className="inline-flex items-center rounded-full bg-blue-100 text-blue-800 px-3 py-1 text-sm font-medium border border-blue-200"
                      >
                        {method2text(method)}
                        <button
                          type="button"
                          onClick={() => removeMethod(index)}
                          className="ml-2 inline-flex h-4 w-4 items-center justify-center rounded-full hover:bg-blue-200 transition-colors"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Choices Section */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={hasChoices}
                      onCheckedChange={(checked) => setHasChoices(!!checked)}
                    />
                    <Label
                      className="text-sm font-semibold cursor-pointer text-gray-700"
                      onClick={() => setHasChoices(!hasChoices)}
                    >
                      Does this event require choices?
                    </Label>
                  </div>

                  {hasChoices && (
                    <div className="space-y-3">
                      <Label className="text-sm font-semibold text-gray-700">
                        Choices <span className="font-normal text-gray-500">(Minimum of 3)</span>
                      </Label>

                      {/* Existing Choices */}
                      {eventChoices.length > 0 && (
                        <div className="border border-gray-200 rounded-lg p-3 space-y-2">
                          {eventChoices.map((choice, index) => (
                            <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                              <span className="text-sm text-gray-900">{choice}</span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeChoice(index)}
                                className="h-6 w-6 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}

                      {eventChoices.length === 0 && (
                        <div className="flex justify-center items-center h-16 text-gray-500 text-sm border border-dashed border-gray-300 rounded-lg">
                          No choices recorded for this event. If applicable, please add choices to this event.
                        </div>
                      )}

                      <Separator />

                      {/* Add New Choice */}
                      <div className="flex gap-2">
                        <Input
                          placeholder="Enter new choice"
                          value={newChoice}
                          onChange={(e) => setNewChoice(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              addChoice();
                            }
                          }}
                          className="border-gray-300 focus:border-blue-400 focus:ring-blue-400/20"
                          maxLength={100}
                        />
                        <Button
                          variant="outline"
                          onClick={addChoice}
                          size="sm"
                          className="border-blue-200 text-blue-600 hover:bg-blue-50"
                        >
                          <PlusCircle className="h-4 w-4 mr-1" />
                          Add
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => {
                    setOpen(false);
                    setEventDescription('');
                    setEventMethods([]);
                    setEventChoices([]);
                    setHasChoices(false);
                    setNewChoice('');
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => addEventMutation.mutate()}
                  disabled={
                    addEventMutation.isPending ||
                    !eventDescription.trim() ||
                    eventMethods.length === 0 ||
                    (hasChoices && eventChoices.length < 3)
                  }
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  {addEventMutation.isPending ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Adding...
                    </>
                  ) : (
                    <>Add Event</>
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>

      <CardContent className="pt-6">
        {note.events.length === 0 ? (
          <div className="flex justify-center items-center h-32 text-gray-500 text-sm border border-dashed border-gray-300 rounded-lg">
            No events recorded for this note. Click "Add Event" to add a new event.
          </div>
        ) : (
          <div className="space-y-4">
            {note.events.map((event, index) => (
              <EventAccordionItem
                key={event.id}
                event={event}
                noteId={note.id}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function EventAccordionItem({ event, noteId }: { event: Note['events'][0]; noteId: string }) {
  const qc = useQueryClient();

  const [isExpanded, setIsExpanded] = useState(true);
  const [editDescription, setEditDescription] = useState(false);
  const [newDescription, setNewDescription] = useState(event.description);

  const updateEventMutation = useMutation({
    mutationKey: ["updateEvent", event.id],
    mutationFn: fn(() => updateEventDescription({ eventId: event.id, newDescription })),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["getNote", noteId] });
      setEditDescription(false);
    },
  });

  const removeEventMutation = useMutation({
    mutationKey: ["deleteEvent", event.id],
    mutationFn: fn(() => removeEvent({ eventId: event.id })),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["getNote", noteId] });
    },
  });

  return (
    <div className="border border-gray-200 rounded-lg bg-white shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        <div className="flex-1">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1 h-6 w-6"
            >
              {isExpanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
            <div className="flex-1">
              <p className="font-semibold text-sm text-gray-900">Event Description</p>
              {!editDescription && (
                <p className="text-sm text-gray-700 mt-1 line-clamp-2">{event.description}</p>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setEditDescription(true);
              setIsExpanded(true);
            }}
            className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the event and all associated data.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => removeEventMutation.mutate()}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {/* Content */}
      {isExpanded && (
        <div className="p-4 space-y-4">
          {/* Edit Description */}
          {editDescription && (
            <div className="space-y-3">
              <Label className="text-sm font-semibold text-gray-700">Edit Description</Label>
              <Textarea
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                className="border-gray-300 focus:border-blue-400 focus:ring-blue-400/20"
                maxLength={500}
              />
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setEditDescription(false);
                    setNewDescription(event.description);
                  }}
                  disabled={updateEventMutation.isPending}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={() => updateEventMutation.mutate()}
                  disabled={updateEventMutation.isPending}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {updateEventMutation.isPending ? (
                    <>
                      <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-1" />
                      Saving...
                    </>
                  ) : (
                    <>Save</>
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* Methods */}
          <MethodsSection event={event} noteId={noteId} />

          {/* Choices */}
          <ChoicesSection event={event} noteId={noteId} />
        </div>
      )}
    </div>
  );
}

function MethodsSection({ event, noteId }: { event: Note['events'][0]; noteId: string  }) {
  const qc = useQueryClient();

  const [open, setOpen] = useState(false);
  const [newMethod, setNewMethod] = useState<MethodType | null>(null);

  const addMethodMutation = useMutation({
    mutationKey: ["addMethod", event.id],
    mutationFn: async (method: MethodType) => await fn(() => addMethodToEvent({ eventId: event.id, method }))(),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["getNote", noteId] });
      setOpen(false);
    },
  });

  const removeMethodMutation = useMutation({
    mutationKey: ["removeMethod", event.id],
    mutationFn: async (methodId: string) => await fn(() => removeMethodFromEvent({ methodId }))(),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["getNote", noteId] });
    },
  });

  const filteredMethods = [
    MethodType.VerbalPrompt,
    MethodType.VisualQueue,
    MethodType.Gesture,
    MethodType.PhysicalPrompt,
    MethodType.Shadowing,
    MethodType.HandOverHand,
    MethodType.TotalAssist,
  ].filter((method) => !event.methods.map((m) => m.method).includes(method));

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <Label className="text-sm font-semibold text-gray-700">Methods</Label>
        {filteredMethods.length > 0 && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="border-blue-200 text-blue-600 hover:bg-blue-50">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Method
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Method</DialogTitle>
                <DialogDescription>
                  What method was used to assist the individual in this event?
                </DialogDescription>
              </DialogHeader>
              <Select onValueChange={(value) => setNewMethod(parseInt(value) as MethodType)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Choose a method</SelectLabel>
                    {filteredMethods.map((method) => (
                      <SelectItem key={method} value={method.toString()}>
                        {method2text(method)}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={() => addMethodMutation.mutate(newMethod!)}
                  disabled={newMethod === null || addMethodMutation.isPending}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {addMethodMutation.isPending ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Adding...
                    </>
                  ) : (
                    <>Add Method</>
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {event.methods.map((method, methodIndex) => (
          <div key={methodIndex} className="inline-flex items-center rounded-full bg-blue-100 text-blue-800 px-3 py-1 text-sm font-medium border border-blue-200">
            <span>{method2text(method.method)}</span>
            <Button variant="ghost" size="sm" className="ml-2 h-4 w-4 p-0" onClick={() => removeMethodMutation.mutate(method.id)}>
              <X className="h-3 w-3" />
            </Button>
          </div>
        ))}
        {event.methods.length === 0 && (
          <div className="text-sm text-gray-500">No methods recorded for this event.</div>
        )}
      </div>
    </div>
  );
}

function ChoicesSection({ event, noteId }: { event: Note['events'][0], noteId: string }) {
  const qc = useQueryClient()

  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [newChoice, setNewChoice] = useState("");
  const [editingChoice, setEditingChoice] = useState<{ id: string, description: string } | null>(null);

  const addChoiceMutation = useMutation({
    mutationKey: ["addChoice", event.id],
    mutationFn: async (description: string) => await addChoiceToEvent({ eventId: event.id, description }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["getNote", noteId] })
      setNewChoice("")
      setAddDialogOpen(false)
    },
  })

  const removeChoiceMutation = useMutation({
    mutationKey: ["removeChoice", event.id],
    mutationFn: async (choiceId: string) => await removeChoiceFromEvent({ choiceId }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["getNote", noteId] })
    },
  })

  const updateChoiceMutation = useMutation({
    mutationKey: ["updateChoice", event.id],
    mutationFn: async ({ choiceId, newDescription }: { choiceId: string, newDescription: string }) => {
      return await updateChoiceInEvent({ choiceId, newDescription })
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["getNote", noteId] })
      setEditingChoice(null)
      setEditDialogOpen(false)
    },
  })

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <Label className="text-sm font-semibold text-gray-700">Choices</Label>
        <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="border-green-200 text-green-600 hover:bg-green-50">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Choice
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Choice</DialogTitle>
              <DialogDescription>
                What was an option that was provided to the client in this event?
              </DialogDescription>
            </DialogHeader>
            <Input
              value={newChoice}
              onChange={(e) => setNewChoice(e.target.value)}
              placeholder="Enter new choice"
              maxLength={100}
            />
            <DialogFooter>
              <Button variant="outline" onClick={() => {
                setNewChoice("");
                setAddDialogOpen(false);
              }}>
                Cancel
              </Button>
              <Button
                onClick={() => addChoiceMutation.mutate(newChoice)}
                disabled={!newChoice.trim() || addChoiceMutation.isPending}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                {addChoiceMutation.isPending ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Adding...
                  </>
                ) : (
                  <>Add Choice</>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <div className="space-y-2">
        {event.choices.map((choice, choiceIndex) => (
          <div key={choiceIndex}>
            <div className="flex items-center justify-between p-2 bg-gray-50 rounded-md border border-gray-200">
              <span className="text-sm text-gray-900">{choice.description}</span>
              <div className="flex space-x-2">
                <Dialog open={editDialogOpen && editingChoice?.id === choice.id} onOpenChange={(open) => {
                  setEditDialogOpen(open);
                  if (!open) setEditingChoice(null);
                }}>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="sm" onClick={() => setEditingChoice({
                      id: choice.id,
                      description: choice.description
                    })}>
                      <Edit className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Edit Choice</DialogTitle>
                      <DialogDescription>
                        Update the description of the choice provided in this event.
                      </DialogDescription>
                    </DialogHeader>
                    <Input
                      value={editingChoice?.description || ''}
                      onChange={(e) => setEditingChoice(prev => prev ? { ...prev, description: e.target.value } : null)}
                      maxLength={100}
                    />
                    <DialogFooter>
                      <Button variant="outline" onClick={() => {
                        setEditDialogOpen(false);
                        setEditingChoice(null);
                      }}>
                        Cancel
                      </Button>
                      <Button
                        onClick={() => updateChoiceMutation.mutate({ choiceId: editingChoice!.id, newDescription: editingChoice!.description})}
                        disabled={!editingChoice?.description.trim() || updateChoiceMutation.isPending}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        {updateChoiceMutation.isPending ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                            Updating...
                          </>
                        ) : (
                          <>Update Choice</>
                        )}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                <Button variant="ghost" size="sm" onClick={() => removeChoiceMutation.mutate(choice.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            {choiceIndex !== event.choices.length - 1 && <Separator className="my-2" />}
          </div>
        ))}
      </div>

      {/* Show empty state if no choices */}
      {event.choices.length === 0 && (
        <div className="flex justify-center items-center h-16 text-gray-500 text-sm border border-dashed border-gray-300 rounded-lg">
          No choices recorded for this event. Click "Add Choice" to add options that were provided to the client.
        </div>
      )}
    </div>
  );
}