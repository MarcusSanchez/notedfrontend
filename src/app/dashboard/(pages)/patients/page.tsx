"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React from "react";
import { SearchPatients } from "@/app/dashboard/(pages)/patients/(components)/SearchPatients";
import { CreatePatient } from "@/app/dashboard/(pages)/patients/(components)/CreatePatient";
import { DashboardContainer } from "@/app/dashboard/(components)/DashboardContainer";

export default function PatientManagement() {
  return (
    <DashboardContainer>
      <h1 className="w-min text-nowrap bg-background text-3xl font-bold mb-4">Patient Management</h1>
      <Tabs defaultValue="search">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger className="font-bold" value="search">Search Patients</TabsTrigger>
          <TabsTrigger className="font-bold" value="create">Create Patient</TabsTrigger>
        </TabsList>
        <TabsContent value="search"><SearchPatients /></TabsContent>
        <TabsContent value="create"><CreatePatient /></TabsContent>
      </Tabs>
    </DashboardContainer>
  );
}
