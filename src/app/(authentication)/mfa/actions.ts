"use server";

import { ac } from "@/lib/clients";
import { action, ActionRequest } from "@/lib/utils";
import { ConnectError } from "@connectrpc/connect";
import { getSessionToken } from "@/lib/tools/session-cookies";
import { VerifyMFARequest } from "@/proto/session_pb";

export async function initiateMFA() {
  return action(async () => {
    try {
      return await ac.initiateMFA({ token: getSessionToken() });
    } catch (error) {
      throw ConnectError.from(error);
    }
  });
}

export async function resendMFACode() {
  return action(async () => {
    try {
      return await ac.resendMFACode({ token: getSessionToken() });
    } catch (error) {
      throw ConnectError.from(error);
    }
  });
}

export async function verifyMFA(request: ActionRequest<VerifyMFARequest>) {
  return action(async () => {
    try {
      return await ac.verifyMFA({ ...request, token: getSessionToken() });
    } catch (error) {
      throw ConnectError.from(error);
    }
  });
}

