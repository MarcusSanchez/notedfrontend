"use server";

import { ac, cc } from "@/lib/clients";
import { action, ActionRequest } from "@/lib/utils";
import { GetCompanyByCodeRequest } from "@/proto/company_pb";
import { SignUpRequest } from "@/proto/session_pb";
import { setSessionCookie } from "@/lib/tools/session-cookies";
import { Code, ConnectError } from "@connectrpc/connect";
import { match } from "ts-pattern";

export async function signUp(request: ActionRequest<SignUpRequest>) {
  return action(async () => {
    try {
      const { user, session } = await ac.signUp(request);
      setSessionCookie(session);

      return { user };
    } catch (error) {
      const status = ConnectError.from(error);
      const message = match(status.code)
        .with(Code.AlreadyExists, () => status.rawMessage)
        .with(Code.NotFound, () => "The company you have entered no longer exists.")
        .otherwise(() => "The username you have entered already exists.");
      throw new ConnectError(message, status.code);
    }
  });
}

export async function getCompanyByCode(request: ActionRequest<GetCompanyByCodeRequest>) {
  return action(() => {
    try {
      return cc.getCompanyByCode(request)
    } catch (error) {
      const status = ConnectError.from(error);
      const message = match(status.code)
        .with(Code.NotFound, () => "The company you have entered no longer exists.")
        .otherwise(() => "The company you have entered no longer exists.");
      throw new ConnectError(message, status.code);
    }
  })
}

