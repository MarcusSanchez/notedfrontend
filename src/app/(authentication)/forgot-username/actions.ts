"use server";

import { ForgotUsernameRequest, InitiateResetPasswordRequest } from "@/proto/session_pb";
import { ac } from "@/lib/clients";
import { action, ActionRequest } from "@/lib/utils";
import { ConnectError } from "@connectrpc/connect";

export async function forgotUsername(request: ActionRequest<ForgotUsernameRequest>) {
  return action(async () => {
    try {
      await ac.forgotUsername(request);
    } catch (error) {
      throw ConnectError.from(error);
    }
  });
}

