import { headers } from "next/headers";
import { createStrictClient } from "@/lib/tools/strict-client";
import { AuthenticationService } from "@/proto/session_connect";
import { UserManagementService } from "@/proto/user_connect";
import { CompanyService } from "@/proto/company_connect";
import { PatientManagementService } from "@/proto/patient_connect";
import { NoteTakingService } from "@/proto/note_connect";
import { createConnectTransport } from "@connectrpc/connect-web";
import { config } from "@/lib/config";

const transport = createConnectTransport({
  baseUrl: config.api.baseUrl,
  interceptors: [
    (next) => async (req) => {
      const headersList = headers();

      const forwardedFor = headersList.get("x-forwarded-for");
      const realIp = headersList.get("x-real-ip");
      const userAgent = headersList.get("user-agent");

      if (forwardedFor) {
        req.header.set("x-forwarded-for", forwardedFor);
      } else if (realIp) {
        req.header.set("x-forwarded-for", realIp);
      }

      if (realIp) req.header.set("x-real-ip", realIp);
      if (userAgent) req.header.set("user-agent", userAgent);

      return await next(req);
    }
  ],
});
export const ac = createStrictClient(AuthenticationService, transport);
export const uc = createStrictClient(UserManagementService, transport);
export const cc = createStrictClient(CompanyService, transport);
export const pc = createStrictClient(PatientManagementService, transport);
export const nc = createStrictClient(NoteTakingService, transport);

