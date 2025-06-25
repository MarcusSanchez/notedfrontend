"use server";

import { InitiateResetPasswordRequest } from "@/proto/session_pb";
import { ac } from "@/lib/clients";
import { action, ActionRequest } from "@/lib/utils";
import { ConnectError } from "@connectrpc/connect";

export async function initiateResetPassword(request: ActionRequest<InitiateResetPasswordRequest>) {
  return action(async () => {
    try {
      return await ac.initiateResetPassword(request);
    } catch (error) {
      throw ConnectError.from(error);
    }
  });
}

