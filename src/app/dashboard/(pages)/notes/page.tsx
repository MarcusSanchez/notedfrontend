"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React from "react";
import { SearchNotes } from "@/app/dashboard/(pages)/notes/(components)/SearchNotes";
import { CreateNote } from "@/app/dashboard/(pages)/notes/(components)/CreateNote";
import { DashboardContainer } from "@/app/dashboard/(components)/DashboardContainer";

export default function NoteManagement() {
  return (
    <DashboardContainer>
      <h1 className="w-min text-nowrap bg-background text-3xl font-bold mb-4">Note Management</h1>
      <Tabs defaultValue="search">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger className="font-bold" value="search">Search Notes</TabsTrigger>
          <TabsTrigger className="font-bold" value="create">Create Note</TabsTrigger>
        </TabsList>
        <TabsContent value="search"><SearchNotes /></TabsContent>
        <TabsContent value="create"><CreateNote /></TabsContent>
      </Tabs>
    </DashboardContainer>
  );
}
