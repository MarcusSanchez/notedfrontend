"use server";

import { action, ActionRequest } from "@/lib/utils";
import { cc } from "@/lib/clients";
import { ConnectError } from "@connectrpc/connect";
import { GetCompanyByIDRequest } from "@/proto/company_pb";
import { getSessionToken } from "@/lib/tools/session-cookies";

export async function getCompanyByID(req: ActionRequest<GetCompanyByIDRequest>) {
  return action(async () => {
    try {
      return await cc.getCompanyByID({ ...req });
    } catch (error) {
      const status = ConnectError.from(error);
      throw new ConnectError("Failed to retrieve your company. Please try again.", status.code);
    }
  });
}

export async function getCompanyBilling() {
  return action(async() => {
    try {
      return await cc.getCompanyBilling({ token: getSessionToken() });
    } catch (error) {
      const status = ConnectError.from(error);
      throw new ConnectError("Failed to retrieve your company billing information. Please try again.", status.code);
    }
  });
}

export async function createCheckoutSession() {
  return action(async () => {
    try {
      return await cc.createCheckoutSession({ token: getSessionToken() });
    } catch (error) {
      const status = ConnectError.from(error);
      throw new ConnectError("Failed to create a checkout session. Please try again.", status.code);
    }
  });
}

export async function createBillingPortalSession() {
  return action(async () => {
    try {
      return await cc.createBillingPortalSession({ token: getSessionToken() });
    } catch (error) {
      const status = ConnectError.from(error);
      throw new ConnectError("Failed to create a billing portal session. Please try again.", status.code);
    }
  });
}
