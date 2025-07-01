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
  X
} from 'lucide-react';
import { defaultEventInput, useNoteStore } from '@/lib/state';
import { MethodType } from "@/proto/note_pb";
import { method2text } from "@/lib/tools/enum2text";

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
    <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader className="border-b border-gray-100">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <Edit className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <CardTitle className="text-xl font-semibold text-gray-900">
                Events
              </CardTitle>
              <CardDescription className="text-gray-600">
                What events occurred during this session? Please list at least one event.
              </CardDescription>
            </div>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="border-orange-200 text-orange-600 hover:bg-orange-50">
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
                    value={event.description}
                    onChange={(e) => setEvent(n => ({ ...n, description: e.target.value }))}
                    placeholder="Describe the event..."
                    className="min-h-[100px] border-gray-300 focus:border-blue-400 focus:ring-blue-400/20"
                    maxLength={500}
                  />
                  <p className="text-xs text-gray-500">
                    {event.description.length}/500 characters
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
                        if (!event.methods.includes(methodType)) {
                          setEvent(prev => ({
                            ...prev,
                            methods: [...prev.methods, methodType]
                          }));
                        }
                      }}
                    >
                      <SelectTrigger className="w-[200px] focus:border-blue-400 focus:ring-blue-400/20">
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

                  {/* Selected Methods */}
                  <div className="flex flex-wrap gap-2">
                    {event.methods.map((method, index) => (
                      <div
                        key={index}
                        className="inline-flex items-center rounded-full bg-blue-100 text-blue-800 px-3 py-1 text-sm font-medium border border-blue-200"
                      >
                        {method2text(method)}
                        <button
                          type="button"
                          onClick={() => setEvent(prev => ({
                            ...prev,
                            methods: prev.methods.filter((_, i) => i !== index)
                          }))}
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
                      checked={event.hasChoices}
                      onCheckedChange={(checked) => setEvent(n => ({
                        ...n,
                        hasChoices: !!checked,
                        choices: !!checked ? n.choices : []
                      }))}
                    />
                    <Label
                      className="text-sm font-semibold cursor-pointer text-gray-700"
                      onClick={() => setEvent(n => ({
                        ...n,
                        hasChoices: !n.hasChoices,
                        choices: !n.hasChoices ? n.choices : []
                      }))}
                    >
                      Does this event require choices?
                    </Label>
                  </div>

                  {event.hasChoices && (
                    <div className="space-y-3">
                      <Label className="text-sm font-semibold text-gray-700">
                        Choices <span className="font-normal text-gray-500">(Minimum of 3)</span>
                      </Label>

                      {/* Existing Choices */}
                      {event.choices.length > 0 && (
                        <div className="border border-gray-200 rounded-lg p-3 space-y-2">
                          {event.choices.map((choice, index) => (
                            <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                              <span className="text-sm text-gray-900">{choice}</span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setEvent(prev => ({
                                  ...prev,
                                  choices: prev.choices.filter((_, i) => i !== index)
                                }))}
                                className="h-6 w-6 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}

                      {event.choices.length === 0 && (
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
                              if (newChoice.trim()) {
                                setEvent(prev => ({
                                  ...prev,
                                  choices: [...prev.choices, newChoice.trim()]
                                }));
                                setNewChoice('');
                              }
                            }
                          }}
                          className="border-gray-300 focus:border-blue-400 focus:ring-blue-400/20"
                          maxLength={100}
                        />
                        <Button
                          variant="outline"
                          onClick={() => {
                            if (newChoice.trim()) {
                              setEvent(prev => ({
                                ...prev,
                                choices: [...prev.choices, newChoice.trim()]
                              }));
                              setNewChoice('');
                            }
                          }}
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
                    setEvent(defaultEventInput());
                    setNewChoice('');
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={addEvent}
                  disabled={
                    !event.description.trim() ||
                    event.methods.length === 0 ||
                    (event.hasChoices && event.choices.length < 3)
                  }
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Add Event
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>

      <CardContent className="pt-6">
        {note.events.length === 0 ? (
          <div className="flex justify-center items-center h-32 text-gray-500 text-sm border border-dashed border-gray-300 rounded-lg">
            Please add at least one event in order to create the note.
          </div>
        ) : (
          <div className="space-y-4">
            {note.events.map((event, index) => (
              <EventAccordionItem
                key={index}
                event={event}
                index={index}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function EventAccordionItem({ event, index }: { event: ReturnType<typeof defaultEventInput>; index: number; }) {
  const [isExpanded, setIsExpanded] = useState(true);

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
                  onClick={removeEvent}
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
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={updateEventDescription}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Save
                </Button>
              </div>
            </div>
          )}

          {/* Methods */}
          <MethodsSection event={event} index={index} />

          {/* Choices */}
          {event.hasChoices && (
            <ChoicesSection event={event} index={index} />
          )}
        </div>
      )}
    </div>
  );
}

function MethodsSection({ event, index }: { event: ReturnType<typeof defaultEventInput>; index: number }) {
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
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {event.methods.map((method, methodIndex) => (
          <div key={methodIndex} className="inline-flex items-center rounded-full bg-blue-100 text-blue-800 px-3 py-1 text-sm font-medium border border-blue-200">
            <span>{method2text(method)}</span>
            <Button variant="ghost" size="sm" className="ml-2 h-4 w-4 p-0" onClick={() => removeMethod(methodIndex)}>
              <X className="h-3 w-3" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

function ChoicesSection({ event, index }: { event: ReturnType<typeof defaultEventInput>; index: number }) {
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
              <Button onClick={addChoice} disabled={!newChoice.trim()}>
                Add Choice
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <div className="space-y-2">
        {event.choices.map((choice, choiceIndex) => (
          <div key={choiceIndex}>
            <div className="flex items-center justify-between p-2 bg-gray-50 border border-gray-300 rounded-md">
              <span className="text-sm text-gray-900">{choice}</span>
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
                      maxLength={100}
                    />
                    <DialogFooter>
                      <Button onClick={updateChoice}>
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
            {choiceIndex !== event.choices.length - 1 && <Separator className="my-2" />}
          </div>
        ))}
        {event.choices.length === 0 && (
          <div className="flex justify-center items-center h-16 text-gray-500 border-gray-300 text-sm border border-dashed rounded-lg">
            No choices recorded for this event. If applicable, please add choices to this event.
          </div>
        )}
      </div>
    </div>
  );
}