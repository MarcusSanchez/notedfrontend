import { cookies, headers } from "next/headers";
import { Session } from "@/proto/session_pb";
import { Code, ConnectError } from "@connectrpc/connect";

export function setSessionCookie(session?: Session) {
  cookies().set("session-token", session!.token, {
    sameSite: "lax",
    expires: session!.expiresAt!.toDate(),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  });
  cookies().set("has-session", "true", {
    sameSite: "lax",
    expires: session!.expiresAt!.toDate(),
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
  });
}

export function getSessionToken() {
  const token = cookies().get("session-token");
  if (!token) throw new ConnectError("No session token found.", Code.Unauthenticated);
  return token.value;
}

export function getIPAddress() {
  let ip = headers().get("x-real-ip");
  const forwardedFor = headers().get("x-forwarded-for");
  if (!ip && forwardedFor) {
    ip = forwardedFor.split(",").at(0) ?? null;
  }
  return ip ?? "Unknown";
}

