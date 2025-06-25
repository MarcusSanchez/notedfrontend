"use client";

import { useUserStore } from "@/lib/state";
import { useRouter } from "next/navigation";
import { Role, Status } from "@/proto/user_pb";
import { useState } from "react";
import { SchemaInput } from "@/components/utility/SchemaInput";
import { AuthCard } from "@/app/(authentication)/(components)/AuthCard";
import { emailSchema } from "@/lib/schemas/schemas";
import { Button } from "@/components/ui/button";
import { ErrorText } from "@/components/utility/ErrorText";
import { useMutation } from "@tanstack/react-query";
import { fn, statusFrom } from "@/lib/utils";
import { InitiateResetPasswordResponse } from "@/proto/session_pb";
import { forgotUsername } from "@/app/(authentication)/forgot-username/actions";

export default function ForgotUsername() {
  const { user } = useUserStore();
  const router = useRouter();

  const [email, setEmail] = useState("");

  const forgotUsernameMu = useMutation({
    mutationFn: fn(() => forgotUsername({ email })),
    mutationKey: ["forgotUsername", email],
    onSuccess: () => {
      router.replace("/forgot-username/success");
    },
  });

  const onClick = () => {
    if (!(emailSchema.schema.safeParse(email).success)) return;
    forgotUsernameMu.mutate();
  };

  if (user.loggedIn) {
    if (!user.mfaVerified) router.replace("/mfa");
    else if (user.role === Role.Admin && user!.status === Status.Accepted) router.replace("/dashboard");
    else if (user!.status === Status.Pending) router.replace("/status/pending");
    else if (user!.status === Status.Rejected) router.replace("/status/rejected");
    else if (user!.role === Role.Nurse) router.replace("/status/not-admin");
    else router.replace("/dashboard");
  }

  return (
    <AuthCard
      title="Forgot Username?"
      description="If you are an administator, please enter your email address to find your username. Otherwise, please contact your administrator."
      content={
        <div className="grid w-full items-center gap-4">
          <SchemaInput value={email} setValue={setEmail} name="email" schema={emailSchema} />
        </div>
      }
      footer={
        <div className="flex flex-col gap-4 w-full">
          <Button className="w-full font-bold" onClick={onClick} disabled={forgotUsernameMu.isPending}>
            Find Username
          </Button>
          <ErrorText qm={forgotUsernameMu} />
        </div>
      }
    />
  );
}

