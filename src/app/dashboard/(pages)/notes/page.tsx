"use client";

import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, FileText } from 'lucide-react';
import { SearchNotes } from "@/app/dashboard/(pages)/notes/(components)/SearchNotes";
import { CreateNote } from "@/app/dashboard/(pages)/notes/(components)/CreateNote";

export default function NotesManagement() {
  return (
      <div className="space-y-8">
        {/* Page Header */}
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent pb-2">
            Note Management
          </h1>
          <p className="text-gray-600 text-lg">
            Search existing notes or create new documentation records
          </p>
        </div>

        {/* Tabbed Interface */}
        <Tabs defaultValue="search" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger
              value="search"
              className="font-semibold data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:border-blue-600"
            >
              <Search className="w-4 h-4 mr-2" />
              Search Notes
            </TabsTrigger>
            <TabsTrigger
              value="create"
              className="font-semibold data-[state=active]:bg-green-600 data-[state=active]:text-white data-[state=active]:border-green-600"
            >
              <FileText className="w-4 h-4 mr-2" />
              Create Note
            </TabsTrigger>
          </TabsList>

          <TabsContent value="search" className="space-y-0">
            <SearchNotes />
          </TabsContent>

          <TabsContent value="create" className="space-y-0">
            <CreateNote />
          </TabsContent>
        </Tabs>
      </div>
  );
}