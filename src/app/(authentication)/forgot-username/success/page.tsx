"use client";

import { useUserStore } from "@/lib/state";
import { useRouter } from "next/navigation";
import { Role, Status } from "@/proto/user_pb";
import React, { useState } from "react";
import { SchemaInput } from "@/components/utility/SchemaInput";
import { AuthCard } from "@/app/(authentication)/(components)/AuthCard";
import { emailSchema } from "@/lib/schemas/schemas";
import { Button } from "@/components/ui/button";
import { ErrorText } from "@/components/utility/ErrorText";
import { useMutation } from "@tanstack/react-query";
import { fn, statusFrom } from "@/lib/utils";
import { InitiateResetPasswordResponse } from "@/proto/session_pb";
import { forgotUsername } from "@/app/(authentication)/forgot-username/actions";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function ForgotUsernameSuccess() {
  const router = useRouter();

  return (
    <div className="min-h-[88vh] flex flex-col justify-center items-center gap-2">
      <Card className="w-full max-w-[500px]">
        <CardHeader>
          <CardTitle className="text-2xl">Check your email</CardTitle>
          <CardDescription>We have sent your username to the email you provided.</CardDescription>
        </CardHeader>
        <CardFooter>
          <Button className="w-full font-bold" onClick={() => router.push("/login")}>
            Return to Login Screen
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

