"use server";

import { action } from "@/lib/utils";
import { ac } from "@/lib/clients";
import { getSessionToken, setSessionCookie } from "@/lib/tools/session-cookies";
import { cookies } from "next/headers";
import { ConnectError } from "@connectrpc/connect";

export async function signOut() {
  return action(async () => {
    await ac.signOut({ token: getSessionToken() });
    cookies().delete("session-token");
    cookies().delete("has-session");
  });
}

export async function refreshSession() {
  return action(async () => {
    try {
      const { user, session, state } = await ac.refreshSession({ token: getSessionToken() });
      setSessionCookie(session);
      return { user, state, mfaVerified: session?.mfaVerified };
    } catch (error) {
      const status = ConnectError.from(error);
      if (status.rawMessage === "session not found") {
        cookies().delete("session-token");
        cookies().delete("has-session");
      }
      throw error;
    }
  });
}

export async function refreshSessionWithPassword(password: string) {
  return action(async () => {
    try {
      const { user, session, state } = await ac.refreshSession({ token: getSessionToken(), password });
      setSessionCookie(session);
      return { user, state, mfaVerified: session?.mfaVerified };
    } catch (error) {
      const status = ConnectError.from(error);
      if (status.rawMessage === "session not found") {
        cookies().delete("session-token");
        cookies().delete("has-session");
      }
      throw error;
    }
  });
}