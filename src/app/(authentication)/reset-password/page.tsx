"use client";

import { challengeIdAtom, maskedEmailAtom, useUserStore } from "@/lib/state";
import { useRouter, useSearchParams } from "next/navigation";
import { Role, Status } from "@/proto/user_pb";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { fn, statusFrom } from "@/lib/utils";
import { VerifyResetPasswordResponse } from "@/proto/session_pb";
import { useAtom } from "jotai";
import { changePasswordWResetToken, verifyResetPassword } from "@/app/(authentication)/reset-password/actions";
import React, { useState } from "react";
import { Loader2, ShieldCheck } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@/components/ui/input-otp";
import { AuthCard } from "@/app/(authentication)/(components)/AuthCard";
import { SchemaInput } from "@/components/utility/SchemaInput";
import { passwordSchema } from "@/lib/schemas/schemas";
import { ErrorText } from "@/components/utility/ErrorText";

export default function ForgotPassword() {
  const { user } = useUserStore();
  const router = useRouter();

  const searchParams = useSearchParams();
  const resetToken = searchParams.get("resetToken");

  const [code, setCode] = useState("");

  const [maskedEmail, setMaskedEmail] = useAtom(maskedEmailAtom);
  const [challengeId, setChallengeId] = useAtom(challengeIdAtom);

  const verifyRPMu = useMutation<VerifyResetPasswordResponse>({
    mutationFn: fn(() => verifyResetPassword({ code: code, challengeId: challengeId! })),
    mutationKey: ["verifyResetPassword", code, challengeId],
    onSuccess: ({ resetToken }) => {
      setTimeout(() => {
        setMaskedEmail(null);
        setChallengeId(null);
      }, 5000); // to avoid race condition in replacing url
      setTimeout(() => router.replace(`/reset-password?resetToken=${resetToken}`), 2000);
    },
    onError: (error) => {
      const status = statusFrom(error);
      error.message = status.rawMessage.slice(0, 1).toUpperCase() + status.rawMessage.slice(1) + ".";
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (code.length === 6) verifyRPMu.mutate()
  }

  const onChange = (newValue: string) => {
    if (isNaN(Number(newValue))) return;
    setCode(newValue);
  }

  if (!resetToken && (!maskedEmail || !challengeId)) router.replace("/forgot-password");

  if (user.loggedIn) {
    if (!user.mfaVerified) router.replace("/mfa");
    else if (user.role === Role.Admin && user!.status === Status.Accepted) router.replace("/dashboard");
    else if (user!.status === Status.Pending) router.replace("/status/pending");
    else if (user!.status === Status.Rejected) router.replace("/status/rejected");
    else if (user!.role === Role.Nurse) router.replace("/status/not-admin");
    else router.replace("/dashboard");
  }

  if (resetToken) return <ChangePassword resetToken={resetToken} />;

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh]">
      <div className="mb-8">
        <ShieldCheck className="h-12 w-12 text-primary" />
      </div>
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Verify Your Email</CardTitle>
          <CardDescription className="text-center">Enter the 6-digit code sent to {maskedEmail}, in order to reset your password.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent>
            <div className="space-y-4 flex flex-col items-center">
              <InputOTP value={code} onChange={onChange} maxLength={6}>
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                </InputOTPGroup>
                <InputOTPSeparator />
                <InputOTPGroup>
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
              {verifyRPMu.isError && (
                <p className="text-red-500 dark:text-mocha-red text-sm">Incorrect code. Please try again.</p>
              )}
              {verifyRPMu.isSuccess && (
                <p className="text-green-500 text-sm">Verification successful! Redirecting...</p>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full" disabled={code.length !== 6 || verifyRPMu.isPending}>
              {verifyRPMu.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Verify
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

function ChangePassword({ resetToken }: { resetToken: string }) {
  const [overrideError, setOverrideError] = useState<string | null>(null);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const router = useRouter();

  const changePasswordMu = useMutation({
    mutationFn: fn(() => changePasswordWResetToken({ newPassword: password, resetToken, })),
    mutationKey: ["changeUserPasswordWResetToken", resetToken, password],
    onSuccess: () => {
      setTimeout(() => router.replace("/login"), 2000);
    },
    onError: (error) => {
      const status = statusFrom(error);
      error.message = status.rawMessage.slice(0, 1).toUpperCase() + status.rawMessage.slice(1) + ".";
    }
  });

  const onClick = () => {
    if (password !== confirmPassword) {
      setOverrideError("Passwords do not match.");
      return;
    }
    if ([password, confirmPassword].some((v) => !passwordSchema.schema.safeParse(v).success)) return;
    setOverrideError(null);
    changePasswordMu.mutate();
  };

  return (
    <AuthCard
      title="Change Password"
      description="Congratulations! You have successfully verified your email. Please enter your new password below."
      content={
        <div className="grid w-full items-center gap-4">
          <SchemaInput value={password} setValue={setPassword} name="new password" schema={passwordSchema} />
          <SchemaInput value={confirmPassword} setValue={setConfirmPassword} name="confirm password" schema={passwordSchema} />
        </div>
      }
      footer={
        <div className="flex flex-col gap-4 w-full">
          {changePasswordMu.isSuccess &&
            <p className="text-green-500 text-sm w-full text-center">Successfully changed password! Redirecting...</p>
          }
          <Button className="w-full font-bold" onClick={onClick} disabled={changePasswordMu.isPending}>
            Change Password
          </Button>
          <ErrorText qm={changePasswordMu} override={overrideError} />
        </div>
      }
    />
  );
}



