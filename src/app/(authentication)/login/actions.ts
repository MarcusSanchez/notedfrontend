"use server";

import { SignInRequest } from "@/proto/session_pb";
import { ac } from "@/lib/clients";
import { action, ActionRequest } from "@/lib/utils";
import { setSessionCookie } from "@/lib/tools/session-cookies";
import { Code, ConnectError } from "@connectrpc/connect";
import { match } from "ts-pattern";

export async function signIn(request: ActionRequest<SignInRequest>) {
  return action(async () => {
    try {
      const { user, session } = await ac.signIn(request);
      setSessionCookie(session);

      return { user, mfaVerified: session?.mfaVerified };
    } catch (error) {
      const status = ConnectError.from(error);
      const message = match(status.code)
        .with(Code.NotFound, () => "Unable to signin, please check your credentials and try again.")
        .with(Code.Unauthenticated, () => "Unable to signin, please check your credentials and try again.")
        .with(Code.ResourceExhausted, () => "You have reached the maximum number of login attempts. Please try again later.")
        .otherwise(() => "Failed to signin, please try again later.");
      throw new ConnectError(message, status.code);
    }
  });
}

