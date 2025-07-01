import React from 'react';
import {
  CreateNotePatientInformation
} from "@/app/dashboard/(pages)/notes/(components)/(CreateNote-Subcomponents)/CreateNotePatientInformation";
import {
  CreateNoteEvents
} from "@/app/dashboard/(pages)/notes/(components)/(CreateNote-Subcomponents)/CreateNoteEvents";
import { CreateNoteSteps } from "@/app/dashboard/(pages)/notes/(components)/(CreateNote-Subcomponents)/CreateNoteSteps";
import {
  CreateNoteAdditionalFields
} from "@/app/dashboard/(pages)/notes/(components)/(CreateNote-Subcomponents)/CreateNoteAdditionalFields";

export function CreateNote() {
  return (
    <div className="space-y-6">
      <CreateNotePatientInformation />
      <CreateNoteEvents />
      <CreateNoteSteps />
      <CreateNoteAdditionalFields />
    </div>
  );
}