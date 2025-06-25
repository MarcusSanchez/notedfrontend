"use client";

import React from "react";
import { CreateNotePatientInformation } from "@/app/dashboard/(pages)/notes/(components)/(CreateNote-Subcomponents)/CreateNotePatientInformation";
import {
  CreateNoteSteps
} from "@/app/dashboard/(pages)/notes/(components)/(CreateNote-Subcomponents)/CreateNoteSteps";
import { CreateNoteEvents } from "@/app/dashboard/(pages)/notes/(components)/(CreateNote-Subcomponents)/CreateNoteEvents";
import {
  CreateNoteAdditionalFields
} from "@/app/dashboard/(pages)/notes/(components)/(CreateNote-Subcomponents)/CreateNoteAdditionalFields";

export function CreateNote() {

  return (
    <div className="flex flex-col gap-4">
      <CreateNotePatientInformation />
      <CreateNoteEvents />
      <CreateNoteSteps />
      <CreateNoteAdditionalFields />
    </div>
  );
}
