"use client";

import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Note } from "@/proto/note_pb";
import { EventTab } from "@/app/dashboard/(pages)/notes/[id]/(components)/EventTab";
import { StepTab } from "@/app/dashboard/(pages)/notes/[id]/(components)/StepTab";
import { NoteInformationTab } from "@/app/dashboard/(pages)/notes/[id]/(components)/NoteInformationTab";

export function NoteTabs({ note }: { note: Note }) {
  const tabs = [
    {
      label: "Note Information",
      value: "note-information",
      content: <NoteInformationTab note={note} />
    },
    {
      label: "Events",
      value: "events",
      content: <EventTab note={note} />
    },
    {
      label: "Health and Safety Steps",
      value: "steps",
      content: <StepTab note={note} />
    },
  ];

  return (
    <Tabs defaultValue="note-information" className="mt-4">
      <TabsList>
        {tabs.map((tab) => (
          <TabsTrigger
            className="w-full max-sm:px-2 text-xs sm:text-sm"
            key={tab.value}
            value={tab.value}
          >
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {tabs.map((tab) => (
        <TabsContent key={tab.value} value={tab.value}>
          {tab.content}
        </TabsContent>
      ))}
    </Tabs>
  );
}
