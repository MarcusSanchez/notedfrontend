"use server";

import { cc, uc } from "@/lib/clients";
import { action, ActionRequest } from "@/lib/utils";
import { getSessionToken } from "@/lib/tools/session-cookies";
import { ConnectError } from "@connectrpc/connect";
import { ApproveNurseRequest, RejectNurseRequest } from "@/proto/user_pb";

export async function getCompanyStats() {
  return action(async () => {
    try {
      return await cc.getCompanyStats({ token: getSessionToken() });
    } catch (error) {
      const status = ConnectError.from(error);
      throw new ConnectError("We couldn't load your company's stats. Please try again later.", status.code);
    }
  });
}

export async function getEstimatedSubscriptionCost() {
  return action(async() => {
    try {
      return await cc.getEstimatedSubscriptionCost({ token: getSessionToken() });
    } catch (error) {
      const status = ConnectError.from(error);
      throw new ConnectError("We couldn't load your company's estimated billing. Please try again later.", status.code);
    }

  });
}

export async function listPendingNurses() {
  return action(async () => {
    try {
      return await uc.listPendingNurses({ token: getSessionToken() });
    } catch (error) {
      const status = ConnectError.from(error);
      throw new ConnectError("We couldn't load your company's pending nurses. Please try again later.", status.code);
    }
  });
}

export async function approveNurse(request: ActionRequest<ApproveNurseRequest>, nurseName: string) {
  return action(async () => {
    try {
      return await uc.approveNurse({ ...request, token: getSessionToken() });
    } catch (error) {
      const status = ConnectError.from(error);
      throw new ConnectError(`We couldn't approve ${nurseName}. Please try again later.`, status.code);
    }
  });
}

export async function rejectNurse(request: ActionRequest<RejectNurseRequest>, nurseName: string) {
  return action(async () => {
    try {
      return await uc.rejectNurse({ ...request, token: getSessionToken() });
    } catch (error) {
      const status = ConnectError.from(error);
      throw new ConnectError(`We couldn't reject ${nurseName}. Please try again later.`, status.code);
    }
  });
}

