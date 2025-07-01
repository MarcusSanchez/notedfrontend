"use client";

import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Note } from "@/proto/note_pb";
import { EventsTab } from "@/app/dashboard/(pages)/notes/[id]/(components)/EventTab";
import { StepsTab } from "@/app/dashboard/(pages)/notes/[id]/(components)/StepTab";
import { NoteInformationTab } from "@/app/dashboard/(pages)/notes/[id]/(components)/NoteInformationTab";
import { Activity, FileText, Shield } from "lucide-react";

export function NoteTabs({ note }: { note: Note }) {
  return (
    <div className="w-full">
      <Tabs defaultValue="information" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger
            value="information"
            className="font-semibold data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            <FileText className="w-4 h-4 mr-2" />
            Note Information
          </TabsTrigger>
          <TabsTrigger
            value="events"
            className="font-semibold data-[state=active]:bg-green-600 data-[state=active]:text-white"
          >
            <Activity className="w-4 h-4 mr-2" />
            Events
          </TabsTrigger>
          <TabsTrigger
            value="steps"
            className="font-semibold data-[state=active]:bg-purple-600 data-[state=active]:text-white"
          >
            <Shield className="w-4 h-4 mr-2" />
            Health and Safety Steps
          </TabsTrigger>
        </TabsList>

        <TabsContent value="information" className="space-y-0">
          <NoteInformationTab note={note} />
        </TabsContent>

        <TabsContent value="events" className="space-y-0">
          <EventsTab note={note} />
        </TabsContent>

        <TabsContent value="steps" className="space-y-0">
          <StepsTab note={note} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
