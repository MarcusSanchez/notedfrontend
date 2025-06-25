"use client";

import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
  SelectValue,
} from "@/components/ui/select";
import { Edit, PlusCircle, Trash2 } from 'lucide-react';
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
import { Textarea } from "@/components/ui/textarea";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { method2text } from "@/lib/tools/enum2text";
import { MethodType } from "@/proto/note_pb";
import { defaultEventInput, useNoteStore } from "@/lib/state";
import { cn } from "@/lib/utils";
import { choiceSchema, eventDescriptionSchema } from "@/lib/schemas/schemas";

export function CreateNoteEvents() {
  const { note, setNote } = useNoteStore();
  const [open, setOpen] = useState(false);
  const [event, setEvent] = useState(() => defaultEventInput());
  const [newChoice, setNewChoice] = useState('');

  const addEvent = () => {
    if (event.description.trim()) {
      setNote(n => ({
        ...n,
        events: [...n.events, {
          ...event,
          choices: event.hasChoices ? event.choices.filter(c => c.trim()) : []
        }]
      }));
      setOpen(false);
      setEvent(defaultEventInput());
      setNewChoice('');
    }
  };

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex flex-col md:flex-row justify-between gap-2">
          <div className="flex flex-col gap-1">
            <CardTitle>Events</CardTitle>
            <CardDescription>
              What events occurred during this session? Please list at least one event.
            </CardDescription>
          </div>
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
                    value={event.description}
                    onChange={(e) => setEvent(n => ({ ...n, description: e.target.value }))}
                    placeholder="Describe the event..."
                    className="h-24"
                    maxLength={eventDescriptionSchema.max}
                  />
                </div>
                <div className="grid gap-2">
                  <div className="flex justify-between items-center gap-8">
                    <div>
                      <Label className="font-bold">Methods</Label>
                      <p className="text-sm text-muted-foreground">What methods did you use to assist in this event.</p>
                    </div>
                    <Select value="" onValueChange={(value) => setEvent(prev => ({
                      ...prev,
                      methods: [...prev.methods, parseInt(value) as MethodType]
                    }))}>
                      <SelectTrigger className="w-min md:w-[40%] my-auto">
                        <SelectValue placeholder="Select Method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Choose a method</SelectLabel>
                          {[
                            MethodType.VerbalPrompt,
                            MethodType.VisualQueue,
                            MethodType.Gesture,
                            MethodType.PhysicalPrompt,
                            MethodType.Shadowing,
                            MethodType.HandOverHand,
                            MethodType.TotalAssist,
                          ].filter(method => !event.methods.includes(method)).map((method) => (
                            <SelectItem key={method} value={method.toString()}>
                              {method2text(method)}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {event.methods.map((method, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center rounded-full bg-secondary px-2.5 py-0.5 text-xs font-semibold text-secondary-foreground"
                      >
                        {method2text(method)}
                        <button
                          type="button"
                          onClick={() => setEvent(prev => ({
                            ...prev,
                            methods: prev.methods.filter((_, i) => i !== index)
                          }))}
                          className="ml-1 inline-flex h-4 w-4 items-center justify-center rounded-full hover:bg-secondary-foreground/20"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2 items-center">
                  <Checkbox
                    checked={event.hasChoices}
                    onCheckedChange={(checked) => setEvent(n => ({
                      ...n,
                      hasChoices: !!checked
                    }))}
                  />
                  <Label
                    className="font-bold text-sm cursor-pointer"
                    onClick={() => setEvent(n => ({ ...n, hasChoices: !n.hasChoices }))}
                  >
                    Does this event require choices?
                  </Label>
                </div>
                {event.hasChoices && (
                  <div className="grid gap-2">
                    <Label className="font-bold">Choices <span className="font-normal text-muted-foreground">(Minimum of 3)</span></Label>
                    {event.choices.length > 0 && (
                      <div className="h-min w-full rounded-md border border-muted-foreground py-2 px-4">
                        {event.choices.map((choice, index) => (
                          <div key={index}>
                            <div className="flex items-center justify-between">
                              <span className="text-sm">{choice}</span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setEvent(prev => ({
                                  ...prev,
                                  choices: prev.choices.filter((_, i) => i !== index)
                                }))}
                                className="h-8 w-8 p-0"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                            {index !== event.choices.length - 1 && <Separator className="mt-2" />}
                          </div>
                        ))}
                      </div>
                    )}
                    {event.choices.length === 0 && (
                      <div className="flex justify-center items-center h-16 mb-[-1rem] text-muted-foreground text-sm">
                        No choices recorded for this event. If applicable, please add choices to this event.
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
                            if (newChoice.trim()) {
                              setEvent(prev => ({ ...prev, choices: [...prev.choices, newChoice.trim()] }));
                              setNewChoice('');
                            }
                          }
                        }}
                        maxLength={choiceSchema.max}
                      />
                      <Button
                        variant="outline"
                        onClick={() => {
                          if (newChoice.trim()) {
                            setEvent(prev => ({ ...prev, choices: [...prev.choices, newChoice.trim()] }));
                            setNewChoice('');
                          }
                        }}
                        size="sm"
                        className="font-bold h-full"
                      >
                        <PlusCircle className="h-4 w-4" />
                        Add
                      </Button>
                    </div>
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button
                  onClick={addEvent}
                  className="font-bold"
                  disabled={!event.description.trim() || event.methods.length === 0 || (event.hasChoices && event.choices.length < 3)}
                >
                  Add Event
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {note.events.length === 0 ? (
          <div className="flex justify-center items-center h-32 text-muted-foreground text-sm">
            Please add at least one event in order to create the note.
          </div>
        ) : (
          <Accordion
            type="multiple"
            defaultValue={note.events.map((_, index) => `item-${index}`)}
            className="w-full space-y-4"
          >
            {note.events.map((event, index) => (
              <EventAccordionItem
                key={index}
                event={event}
                index={index}
              />
            ))}
          </Accordion>
        )}
      </CardContent>
    </Card>
  );
}

function EventAccordionItem({ event, index }: { event: ReturnType<typeof defaultEventInput>, index: number }) {
  const { setNote } = useNoteStore();
  const [editDescription, setEditDescription] = useState(false);
  const [newDescription, setNewDescription] = useState(event.description);

  const updateEventDescription = () => {
    setNote(n => ({
      ...n,
      events: n.events.map((e, i) => i === index ? { ...e, description: newDescription } : e)
    }));
    setEditDescription(false);
  };

  const removeEvent = () => {
    setNote(n => ({
      ...n,
      events: n.events.filter((_, i) => i !== index)
    }));
  };

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
                  <AlertDialogCancel className="font-bold">Cancel</AlertDialogCancel>
                  <AlertDialogAction className="font-bold" onClick={removeEvent}>Delete</AlertDialogAction>
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
              <Button size="sm" onClick={updateEventDescription}>Save</Button>
            </div>
          </div>
        ) : null}
        <MethodsSection event={event} index={index} />
        <ChoicesSection event={event} index={index} />
      </AccordionContent>
    </AccordionItem>
  );
}

function MethodsSection({ event, index }: { event: ReturnType<typeof defaultEventInput>, index: number }) {
  const { setNote } = useNoteStore();
  const [open, setOpen] = useState(false);

  const addMethod = (method: MethodType) => {
    setNote(n => ({
      ...n,
      events: n.events.map((e, i) => i === index ? { ...e, methods: [...e.methods, method] } : e)
    }));
    setOpen(false);
  };

  const removeMethod = (methodIndex: number) => {
    setNote(n => ({
      ...n,
      events: n.events.map((e, i) => i === index ? {
        ...e,
        methods: e.methods.filter((_, mi) => mi !== methodIndex)
      } : e)
    }));
  };

  const filteredMethods = [
    MethodType.VerbalPrompt,
    MethodType.VisualQueue,
    MethodType.Gesture,
    MethodType.PhysicalPrompt,
    MethodType.Shadowing,
    MethodType.HandOverHand,
    MethodType.TotalAssist,
  ].filter((method) => !event.methods.includes(method));

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
            <Select onValueChange={(method) => addMethod(parseInt(method) as MethodType)}>
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
      <div className="flex flex-wrap gap-2">
        {event.methods.map((method, methodIndex) => (
          <div key={methodIndex} className="flex items-center bg-secondary text-secondary-foreground rounded-full px-3 py-1">
            <span className="text-sm">{method2text(method)}</span>
            <Button variant="ghost" size="sm" className="ml-2 h-4 w-4 p-0" onClick={() => removeMethod(methodIndex)}>
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

function ChoicesSection({ event, index }: { event: ReturnType<typeof defaultEventInput>, index: number }) {
  const { setNote } = useNoteStore();
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [newChoice, setNewChoice] = useState("");
  const [editingChoice, setEditingChoice] = useState<{ index: number, description: string } | null>(null);

  const addChoice = () => {
    if (newChoice.trim()) {
      setNote(n => ({
        ...n,
        events: n.events.map((e, i) => i === index ? {
          ...e,
          hasChoices: true,
          choices: [...e.choices, newChoice.trim()]
        } : e)
      }));
      setNewChoice("");
      setAddDialogOpen(false);
    }
  };

  const removeChoice = (choiceIndex: number) => {
    setNote(n => ({
      ...n,
      events: n.events.map((e, i) => i === index ? {
        ...e,
        choices: e.choices.filter((_, ci) => ci !== choiceIndex)
      } : e)
    }));
  };

  const updateChoice = () => {
    if (editingChoice) {
      setNote(n => ({
        ...n,
        events: n.events.map((e, i) => i === index ? {
          ...e,
          choices: e.choices.map((c, ci) => ci === editingChoice.index ? editingChoice.description : c)
        } : e)
      }));
      setEditingChoice(null);
      setEditDialogOpen(false);
    }
  };

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
                setNewChoice("");
                setAddDialogOpen(false);
              }}>
                Cancel
              </Button>
              <Button className="font-bold" onClick={addChoice} disabled={!newChoice.trim()}>
                Add Choice
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <div className="space-y-2">
        {event.choices.map((choice, choiceIndex) => (
          <div key={choiceIndex}>
            <div className="flex items-center justify-between rounded-md p-2">
              <span>{choice}</span>
              <div className="flex space-x-2">
                <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="sm" onClick={() => setEditingChoice({
                      index: choiceIndex,
                      description: choice
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
                      maxLength={choiceSchema.max}
                    />
                    <DialogFooter>
                      <Button
                        className="font-bold"
                        onClick={updateChoice}
                      >
                        Update Choice
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                <Button variant="ghost" size="sm" onClick={() => removeChoice(choiceIndex)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            {choiceIndex !== event.choices.length - 1 && <Separator />}
          </div>
        ))}
        {event.choices.length === 0 && (
          <div className="flex justify-center items-center h-32 text-muted-foreground text-sm">
            No choices recorded for this event. If applicable, please add choices to this event.
          </div>
        )}
      </div>
    </div>
  );
}
