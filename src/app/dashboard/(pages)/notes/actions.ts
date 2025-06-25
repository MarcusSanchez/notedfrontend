"use server";

import { action, ActionRequest } from "@/lib/utils";
import { nc, pc } from "@/lib/clients";
import { getSessionToken } from "@/lib/tools/session-cookies";
import { ConnectError } from "@connectrpc/connect";
import { Timestamp } from "@bufbuild/protobuf";
import { ListNursePatientsRequest, ListPatientGoalsRequest } from "@/proto/patient_pb";

type ListNotesActionRequest = {
  afterDate?: string;
  beforeDate?: string;
  patientFirstName?: string;
  patientLastName?: string;
  nurseName?: string;
  page?: number;
  orderByAsc: boolean;
}

export async function listNotes(req: ListNotesActionRequest) {
  return action(async () => {
    try {
      return await nc.listNotes({
        ...req,
        afterDate: req.afterDate ? Timestamp.fromJsonString(req.afterDate) : undefined,
        beforeDate: req.beforeDate ? Timestamp.fromJsonString(req.beforeDate) : undefined,
        token: getSessionToken()
      });
    } catch (error) {
      const status = ConnectError.from(error);
      throw new ConnectError("Failed to list your company's notes. Please try again.", status.code);
    }
  });
}

export async function listNursePatients(req: ActionRequest<ListNursePatientsRequest>) {
  return action(async () => {
    try {
      return await pc.listNursePatients({ ...req, token: getSessionToken() });
    } catch (error) {
      const status = ConnectError.from(error);
      throw new ConnectError("Failed to list your patients. Please try again.", status.code);
    }
  });
}

export async function listPatientGoals(req: ActionRequest<ListPatientGoalsRequest>) {
  return action(async () => {
    try {
      return await pc.listPatientGoals({ ...req, token: getSessionToken() });
    } catch (error) {
      const status = ConnectError.from(error);
      throw new ConnectError("Failed to list this patient's goals. Please try again.", status.code);
    }
  });
}

