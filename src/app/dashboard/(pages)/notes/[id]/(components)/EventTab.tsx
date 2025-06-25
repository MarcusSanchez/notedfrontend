"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Edit, PlusCircle, Trash2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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
import { MethodType, Note } from "@/proto/note_pb";
import {
  addChoiceToEvent,
  addEvent,
  addMethodToEvent,
  removeChoiceFromEvent,
  removeEvent,
  removeMethodFromEvent,
  updateChoiceInEvent,
  updateEventDescription
} from "@/app/dashboard/(pages)/notes/[id]/actions";
import { cn, fn } from "@/lib/utils";
import { method2text } from "@/lib/tools/enum2text";
import { Textarea } from "@/components/ui/textarea";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { choiceSchema, eventDescriptionSchema } from "@/lib/schemas/schemas";

export function EventTab({ note }: { note: Note }) {
  const queryClient = useQueryClient();
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
      queryClient.invalidateQueries({ queryKey: ['getNote', note.id] });
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
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="flex justify-between items-center text-xl">
          Events
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="font-semibold">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Event
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Add New Event</DialogTitle>
                <DialogDescription>
                  Please provide a description of the event, the methods used, and the choices provided.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-6 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="event-description" className="font-bold">Event Description</Label>
                  <Textarea
                    id="event-description"
                    value={eventDescription}
                    onChange={(e) => setEventDescription(e.target.value)}
                    placeholder="Describe the event..."
                    className="h-24"
                    maxLength={eventDescriptionSchema.max}
                  />
                </div>
                <div className="grid gap-2">
                  <div className="flex justify-between gap-8">
                    <div>
                      <Label className="font-bold">Methods</Label>
                      <p className="text-sm text-muted-foreground">What methods did you use to assist in this event.</p>
                    </div>
                    <Select value="" onValueChange={(value) => addMethod(parseInt(value))}>
                      <SelectTrigger className="w-min my-auto">
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
                  <div className="flex flex-wrap gap-2">
                    {eventMethods.map((method, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center rounded-full bg-secondary px-2.5 py-0.5 text-xs font-semibold text-secondary-foreground"
                      >
                        {method2text(method)}
                        <button
                          type="button"
                          onClick={() => removeMethod(index)}
                          className="ml-1 inline-flex h-4 w-4 items-center justify-center rounded-full bg-secondary-foreground/10 hover:bg-secondary-foreground/20"
                        >
                          <Trash2 className="h-3 w-3" />
                          <span className="sr-only">Remove</span>
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2 items-center">
                  <Checkbox
                    checked={hasChoices}
                    onCheckedChange={(c) => setHasChoices(!!c)}
                  />
                  <Label className="font-bold text-sm cursor-pointer" onClick={() => setHasChoices(c => !c)}>
                    Does this event require choices?
                  </Label>
                </div>
                {hasChoices && (
                  <div className="grid gap-2">
                    <Label className="font-bold">Choices <span className="font-normal text-muted-foreground">(Minimum of 3)</span></Label>
                    {eventChoices.length > 0 && (
                      <div className="h-min w-full rounded-md border py-2 px-4">
                        {eventChoices.map((choice, index) => (
                          <div key={index}>
                            <div key={index} className="flex items-center justify-between">
                              <span className="text-sm">{choice}</span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeChoice(index)}
                                className="h-8 w-8 p-0"
                              >
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Remove</span>
                              </Button>
                            </div>
                            {index !== eventChoices.length - 1 && <Separator className="mt-2" />}
                          </div>
                        ))}
                      </div>
                    )}
                    {eventChoices.length === 0 && (
                      <div className="flex justify-center items-center h-16 mb-[-1rem] text-muted-foreground text-sm">
                        No choices recorded for this event. Please add a choice.
                      </div>
                    )}
                    <Separator className="my-4" />
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
                        maxLength={choiceSchema.max}
                      />
                      <Button variant="outline" onClick={addChoice} size="sm" className="font-bold h-full">
                        <PlusCircle className="h-4 w-4" />
                        Add
                      </Button>
                    </div>
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button
                  type="submit"
                  onClick={() => addEventMutation.mutate()}
                  className="font-bold"
                  disabled={!eventDescription.trim() || eventMethods.length === 0 || (hasChoices && eventChoices.length < 3)}
                >
                  Add Event
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {note.events.length === 0 ? (
          <div className="flex justify-center items-center h-16 text-muted-foreground text-sm">
            No events recorded for this note. Please add an event.
          </div>
        ) : (
          <Accordion
            type="multiple"
            defaultValue={[]}
            className="w-full space-y-4"
          >
            {note.events.map((event, index) => (
              <EventAccordionItem
                key={event.id}
                event={event}
                noteId={note.id}
                index={index}
              />
            ))}
          </Accordion>
        )}
      </CardContent>
    </Card>
  );
}

function EventAccordionItem({ event, noteId, index }: { event: Note['events'][0], noteId: string, index: number }) {
  const qc = useQueryClient();
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
    <AccordionItem value={`item-${index}`} className="border rounded-lg">
      <AccordionTrigger className="px-4 py-2 hover:no-underline">
        <div className="flex justify-between items-center w-full">
          <div className="flex flex-col justify-center">
            <p className="font-bold text-sm">Event Description</p>
            {!editDescription && <span className="font-medium text-left">{event.description}</span>}
          </div>
          <div className="flex items-center space-x-2">
            <span className={cn(buttonVariants({ variant: "ghost", size: "sm" }))} onClick={(e) => {
              e.stopPropagation();
              setEditDescription(true);
            }}>
              <Edit className="h-4 w-4" />
            </span>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <span className={cn(buttonVariants({
                  variant: "ghost",
                  size: "sm"
                }))} onClick={(e) => e.stopPropagation()}>
                  <Trash2 className="h-4 w-4" />
                </span>
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
                  <AlertDialogAction onClick={() => removeEventMutation.mutate()}>Delete</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent className="px-4 py-2">
        {editDescription ? (
          <div className="mb-4">
            <Textarea
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              className="w-full mb-2"
              maxLength={eventDescriptionSchema.max}
            />
            <div className="flex justify-end space-x-2">
              <Button variant="outline" size="sm" onClick={() => setEditDescription(false)}>Cancel</Button>
              <Button size="sm" onClick={() => updateEventMutation.mutate()}>Save</Button>
            </div>
          </div>
        ) : null}
        <MethodsSection event={event} noteId={noteId} />
        <ChoicesSection event={event} noteId={noteId} />
      </AccordionContent>
    </AccordionItem>
  );
}

function MethodsSection({ event, noteId }: { event: Note['events'][0], noteId: string }) {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);

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
    <div className="mb-4">
      <div className="flex justify-between items-center mb-2">
        <h4 className="font-semibold">Methods</h4>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="secondary" size="sm" className="font-bold">
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
            <Select onValueChange={(method) => addMethodMutation.mutate(parseInt(method))}>
              <SelectTrigger>
                <SelectValue placeholder="Select method" />
              </SelectTrigger>
              <SelectContent>
                {filteredMethods.map((method) => (
                  <SelectItem key={method} value={method.toString()}>
                    {method2text(method)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </DialogContent>
        </Dialog>
      </div>
      {event.methods.length === 0 && (
        <div className="flex justify-center items-center h-16 text-muted-foreground text-sm">
          No methods recorded for this event. Please add a method.
        </div>
      )}
      <div className="flex flex-wrap gap-2">
        {event.methods.map((method) => (
          <div key={method.id} className="flex items-center bg-secondary text-secondary-foreground rounded-full px-3 py-1">
            <span className="text-sm">{method2text(method.method)}</span>
            <Button variant="ghost" size="sm" className="ml-2 h-4 w-4 p-0" onClick={() => removeMethodMutation.mutate(method.id)}>
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

function ChoicesSection({ event, noteId }: { event: Note['events'][0], noteId: string }) {
  const qc = useQueryClient()
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState<string | null>(null)
  const [newChoice, setNewChoice] = useState("")
  const [editingChoice, setEditingChoice] = useState<{ id: string, description: string } | null>(null)

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
      setEditDialogOpen(null)
    },
  })

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <h4 className="font-semibold">Choices</h4>
        <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="secondary" size="sm" className="font-bold">
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
              maxLength={choiceSchema.max}
            />
            <DialogFooter>
              <Button className="font-bold" variant="outline" onClick={() => {
                setNewChoice("")
                setAddDialogOpen(false)
              }}>
                Cancel
              </Button>
              <Button className="font-bold" onClick={() => addChoiceMutation.mutate(newChoice)} disabled={!newChoice}>
                Add Choice
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <div className="space-y-2">
        {event.choices.map((choice, i) => (
          <div key={choice.id}>
            <div className="flex items-center justify-between rounded-md p-2">
              <span>{choice.description}</span>
              <div className="flex space-x-2">
                <Dialog open={editDialogOpen === choice.id} onOpenChange={(open) => setEditDialogOpen(open ? choice.id : null)}>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="sm">
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
                      value={editingChoice?.id === choice.id ? editingChoice.description : choice.description}
                      onChange={(e) => setEditingChoice({ id: choice.id, description: e.target.value })}
                      maxLength={choiceSchema.max}
                    />
                    <DialogFooter>
                      <Button
                        className="font-bold"
                        onClick={() => editingChoice && updateChoiceMutation.mutate({
                          choiceId: editingChoice.id,
                          newDescription: editingChoice.description
                        })}
                      >
                        Update Choice
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                <Button variant="ghost" size="sm" onClick={() => removeChoiceMutation.mutate(choice.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            {i !== event.choices.length - 1 && <Separator />}
          </div>
        ))}
        {event.choices.length === 0 && (
          <div className="flex justify-center items-center h-16 text-muted-foreground text-sm">
            No choices recorded for this event. If applicable, please add choices to this event.
          </div>
        )}
      </div>
    </div>
  )
}

