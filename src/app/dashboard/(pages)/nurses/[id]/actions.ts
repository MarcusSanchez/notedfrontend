"use server";

import { action, ActionRequest } from "@/lib/utils";
import { ChangeUserPasswordRequest, DeleteUserRequest, GetUserRequest, UpdateUserRequest } from "@/proto/user_pb";
import { pc, uc } from "@/lib/clients";
import { getSessionToken } from "@/lib/tools/session-cookies";
import { ConnectError } from "@connectrpc/connect";
import {
  AddDiagnosisRequest, AddGoalRequest,
  AddServiceRequest,
  AssignPatientToNurseRequest,
  ListPatientsNotAssignedToNurseRequest,
  RemoveDiagnosisRequest, RemoveGoalRequest,
  RemoveServiceRequest,
  UnassignPatientToNurseRequest, UpdateGoalRequest
} from "@/proto/patient_pb";

export async function getUser(req: ActionRequest<GetUserRequest>) {
  return action(async () => {
    try {
      return await uc.getUser({ ...req, token: getSessionToken() });
    } catch (error) {
      const status = ConnectError.from(error);
      throw new ConnectError("Failed to get user. Please try again.", status.code);
    }
  });
}

export async function listPatientsNotAssignedToNurse(req: ActionRequest<ListPatientsNotAssignedToNurseRequest>) {
  return action(async () => {
    try {
      return await pc.listPatientsNotAssignedToNurse({ ...req, token: getSessionToken() });
    } catch (error) {
      const status = ConnectError.from(error);
      throw new ConnectError("Failed to list patients not assigned to nurse. Please try again.", status.code);
    }
  });
}

export async function assignPatientToNurse(req: ActionRequest<AssignPatientToNurseRequest>) {
  return action(async () => {
    try {
      return await pc.assignPatientToNurse({ ...req, token: getSessionToken() });
    } catch (error) {
      const status = ConnectError.from(error);
      throw new ConnectError("Failed to assign patient to nurse. Please try again.", status.code);
    }
  });
}

export async function unassignPatientToNurse(req: ActionRequest<UnassignPatientToNurseRequest>) {
  return action(async () => {
    try {
      return await pc.unassignPatientFromNurse({ ...req, token: getSessionToken() });
    } catch (error) {
      const status = ConnectError.from(error);
      throw new ConnectError("Failed to unassign patient to nurse. Please try again.", status.code);
    }
  });
}

export async function updateUser(req: ActionRequest<UpdateUserRequest>) {
  return action(async () => {
    try {
      return await uc.updateUser({ ...req, token: getSessionToken() });
    } catch (error) {
      const status = ConnectError.from(error);
      throw new ConnectError("Failed to update user. Please try again.", status.code);
    }
  });
}

export async function changeUserPassword(req: ActionRequest<ChangeUserPasswordRequest>) {
  return action(async () => {
    try {
      return await uc.changeUserPassword({ ...req, token: getSessionToken() });
    } catch (error) {
      throw ConnectError.from(error);
    }
  });
}

export async function deleteUser(req: ActionRequest<DeleteUserRequest>) {
  return action(async () => {
    try {
      return await uc.deleteUser({ ...req, token: getSessionToken() });
    } catch (error) {
      const status = ConnectError.from(error);
      throw new ConnectError("Failed to delete user. Please try again.", status.code);
    }
  });
}

export async function addGoal(req: ActionRequest<AddGoalRequest>) {
  return action(async () => {
    try {
      return await pc.addGoal({ ...req, token: getSessionToken() });
    } catch (error) {
      const status = ConnectError.from(error);
      throw new ConnectError("Failed to add goal. Please try again.", status.code);
    }
  });
}

export async function updateGoal(req: ActionRequest<UpdateGoalRequest>) {
  return action(async () => {
    try {
      return await pc.updateGoal({ ...req, token: getSessionToken() });
    } catch (error) {
      const status = ConnectError.from(error);
      throw new ConnectError("Failed to update goal. Please try again.", status.code);
    }
  });
}

export async function removeGoal(req: ActionRequest<RemoveGoalRequest>) {
  return action(async () => {
    try {
      return await pc.removeGoal({ ...req, token: getSessionToken() });
    } catch (error) {
      const status = ConnectError.from(error);
      throw new ConnectError("Failed to remove goal. Please try again.", status.code);
    }
  });
}

export async function addDiagnosis(req: ActionRequest<AddDiagnosisRequest>) {
  return action(async () => {
    try {
      return await pc.addDiagnosis({ ...req, token: getSessionToken() });
    } catch (error) {
      const status = ConnectError.from(error);
      throw new ConnectError("Failed to add diagnosis. Please try again.", status.code);
    }
  });
}

export async function removeDiagnosis(req: ActionRequest<RemoveDiagnosisRequest>) {
  return action(async () => {
    try {
      return await pc.removeDiagnosis({ ...req, token: getSessionToken() });
    } catch (error) {
      const status = ConnectError.from(error);
      throw new ConnectError("Failed to remove diagnosis. Please try again.", status.code);
    }
  });
}

export async function addService(req: ActionRequest<AddServiceRequest>) {
  return action(async () => {
    try {
      return await pc.addService({ ...req, token: getSessionToken() });
    } catch (error) {
      const status = ConnectError.from(error);
      throw new ConnectError("Failed to add service. Please try again.", status.code);
    }
  });
}

export async function removeService(req: ActionRequest<RemoveServiceRequest>) {
  return action(async () => {
    try {
      return await pc.removeService({ ...req, token: getSessionToken() });
    } catch (error) {
      const status = ConnectError.from(error);
      throw new ConnectError("Failed to remove diagnosis. Please try again.", status.code);
    }
  });
}

