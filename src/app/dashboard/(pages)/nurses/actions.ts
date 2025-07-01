"use server";

import { action, ActionRequest } from "@/lib/utils";
import { ListUsersRequest } from "@/proto/user_pb";
import { uc } from "@/lib/clients";
import { getSessionToken } from "@/lib/tools/session-cookies";
import { ConnectError } from "@connectrpc/connect";

export async function listUsers(req: ActionRequest<ListUsersRequest>) {
  return action(async () => {
    try {
      return await uc.listUsers({ ...req, token: getSessionToken() });
    } catch (error) {
      const status = ConnectError.from(error);
      throw new ConnectError("Failed to list your company's users. Please try again.", status.code);
    }
  });
}

export async function getUsersStats() {
  return action(async () => {
    try {
      return await uc.getUsersStats({ token: getSessionToken() });
    } catch (error) {
      const status = ConnectError.from(error);
      throw new ConnectError("Failed to get your company's user's stats. Please try again.", status.code);
    }
  });
}