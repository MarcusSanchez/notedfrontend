"use server";

import { action, ActionRequest } from "@/lib/utils";
import { pc } from "@/lib/clients";
import { getSessionToken } from "@/lib/tools/session-cookies";
import { ConnectError } from "@connectrpc/connect";
import { DeletePatientRequest, GetPatientRequest, UpdatePatientRequest } from "@/proto/patient_pb";

export async function getPatient(req: ActionRequest<GetPatientRequest>) {
  return action(async () => {
    try {
      return await pc.getPatient({ ...req, token: getSessionToken() });
    } catch (error) {
      const status = ConnectError.from(error);
      throw new ConnectError("Failed to get patient. Please try again.", status.code);
    }
  });
}

export async function deletePatient(req: ActionRequest<DeletePatientRequest>) {
  return action(async () => {
    try {
      return await pc.deletePatient({ ...req, token: getSessionToken() });
    } catch (error) {
      const status = ConnectError.from(error);
      throw new ConnectError("Failed to delete patient. Please try again.", status.code);
    }
  });
}

export async function updatePatient(req: ActionRequest<UpdatePatientRequest>) {
  return action(async () => {
    try {
      return await pc.updatePatient({ ...req, token: getSessionToken() });
    } catch (error) {
      const status = ConnectError.from(error);
      throw new ConnectError("Failed to update patient. Please try again.", status.code);
    }
  });
}

