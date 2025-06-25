"use client";

import { Button } from "@/components/ui/button"
import { SchemaInput } from "@/components/utility/SchemaInput";
import { useState } from "react";
import { passwordSchema, usernameSchema } from "@/lib/schemas/schemas";
import { AuthCard } from "@/app/(authentication)/(components)/AuthCard";
import { useMutation } from "@tanstack/react-query";
import { fn, statusFrom } from "@/lib/utils";
import { signIn } from "@/app/(authentication)/login/actions";
import { Code } from "@connectrpc/connect";
import { Role, Status, User } from "@/proto/user_pb";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/lib/state";
import { ErrorText } from "@/components/utility/ErrorText";
import { match } from "ts-pattern";
import Link from "next/link";

export default function Login() {
  const { user, saveUser } = useUserStore();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();

  const signinMutation = useMutation<{ user?: User, mfaVerified?: boolean }>({
    mutationFn: fn(() => signIn({ username, password })),
    onSuccess: ({ user, mfaVerified }) => {
      saveUser({ ...user!, mfaVerified: mfaVerified! });

      if (!mfaVerified) router.replace("/mfa");
      else if (user!.status === Status.Accepted) router.replace("/dashboard");
      else if (user!.status === Status.Pending) router.replace("/status/pending");
      else if (user!.status === Status.Rejected) router.replace("/status/rejected");
    },
    onError: (error) => {
      const status = statusFrom(error);
      error.message = match(status.code)
        .with(Code.NotFound, () => "Unable to signin, please check your credentials and try again.")
        .with(Code.Unauthenticated, () => "Unable to signin, please check your credentials and try again.")
        .with(Code.ResourceExhausted, () => "You have reached the maximum number of login attempts. Please try again later.")
        .otherwise(() => "Failed to signin, please try again later.");
    },
  });

  const signin = () => {
    const results = [usernameSchema.safeParse(username), passwordSchema.safeParse(password)];
    if (results.some(r => !r.success)) return;
    signinMutation.mutate();
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
      title="Login to your account"
      description="Enter your credentials to access your account."
      content={
        <div className="grid w-full items-center gap-4">
          <SchemaInput value={username} setValue={setUsername} name="username" schema={usernameSchema} forgotUsernameLink />
          <SchemaInput value={password} setValue={setPassword} name="password" schema={passwordSchema} forgotPasswordLink />
        </div>
      }
      footer={
        <div className="flex flex-col gap-4 w-full">
          <Button className="w-full font-bold" onClick={signin} disabled={signinMutation.isPending}>
            Login
          </Button>
          <ErrorText qm={signinMutation} />
        </div>
      }
      outsideContent={
        <Link href="/register" className="flex justify-center">
          <Button size="sm" variant="link" className="font-bold">Don't have an account? Click here to register now.</Button>
        </Link>
      }
    />
  );
}