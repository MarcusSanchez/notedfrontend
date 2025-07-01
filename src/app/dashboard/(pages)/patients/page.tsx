"use client";

import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SearchPatients } from './(components)/SearchPatients';
import { CreatePatient } from './(components)/CreatePatient';
import { Search, UserPlus } from 'lucide-react';

export default function PatientManagement() {
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent pb-2">
          Patient Management
        </h1>
        <p className="text-gray-600 text-lg">
          Search existing patients or create new patient records
        </p>
      </div>

      {/* Tabbed Interface */}
      <Tabs defaultValue="search" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger
            value="search"
            className="font-semibold"
          >
            <Search className="w-4 h-4 mr-2" />
            Search Patients
          </TabsTrigger>
          <TabsTrigger
            value="create"
            className="font-semibold"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Create Patient
          </TabsTrigger>
        </TabsList>

        <TabsContent value="search" className="space-y-0">
          <SearchPatients />
        </TabsContent>

        <TabsContent value="create" className="space-y-0">
          <CreatePatient />
        </TabsContent>
      </Tabs>
    </div>

  );
}