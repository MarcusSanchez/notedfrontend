"use server";

import { InitiateResetPasswordRequest } from "@/proto/session_pb";
import { VerifyResetPasswordRequest } from "@/proto/session_pb";
import { ac, uc } from "@/lib/clients";
import { action, ActionRequest } from "@/lib/utils";
import { ConnectError } from "@connectrpc/connect";
import { ChangeUserPasswordWResetTokenRequest } from "@/proto/user_pb";

export async function initiateResetPassword(request: ActionRequest<InitiateResetPasswordRequest>) {
  return action(async () => {
    try {
      return await ac.initiateResetPassword(request);
    } catch (error) {
      throw ConnectError.from(error);
    }
  });
}

export async function verifyResetPassword(request: ActionRequest<VerifyResetPasswordRequest>) {
  return action(async () => {
    try {
      return await ac.verifyResetPassword(request);
    } catch (error) {
      throw ConnectError.from(error);
    }
  });
}

export async function changePasswordWResetToken(request: ActionRequest<ChangeUserPasswordWResetTokenRequest>) {
  return action(async () => {
    try {
      return await uc.changeUserPasswordWResetToken(request);
    } catch (error) {
      throw ConnectError.from(error);
    }
  });
}

