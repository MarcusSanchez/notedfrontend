"use server";

import { action, ActionRequest } from "@/lib/utils";
import { pc } from "@/lib/clients";
import { getSessionToken } from "@/lib/tools/session-cookies";
import { ConnectError } from "@connectrpc/connect";
import { CreatePatientRequest, ListNursesNotAssignedToPatientRequest, ListPatientsRequest } from "@/proto/patient_pb";

export async function listPatients(req: ActionRequest<ListPatientsRequest>) {
  return action(async () => {
    try {
      return await pc.listPatients({ ...req, token: getSessionToken() });
    } catch (error) {
      const status = ConnectError.from(error);
      throw new ConnectError("Failed to list your company's patients. Please try again.", status.code);
    }
  });
}

export async function createPatient(req: ActionRequest<CreatePatientRequest>) {
  return action(async () => {
    try {
      return await pc.createPatient({ ...req, token: getSessionToken() });
    } catch (error) {
      const status = ConnectError.from(error);
      throw new ConnectError("Failed to add patient to your company. Please try again.", status.code);
    }
  });
}

export async function listNursesNotAssignedToPatient(req: ActionRequest<ListNursesNotAssignedToPatientRequest>) {
  return action(async () => {
    try {
      return await pc.listNursesNotAssignedToPatient({ ...req, token: getSessionToken() });
    } catch (error) {
      const status = ConnectError.from(error);
      throw new ConnectError("Failed to list nurses not assigned to patient. Please try again.", status.code);
    }
  });
}
