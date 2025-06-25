"use client";

import { Button } from "@/components/ui/button"
import { SchemaInput } from "@/components/utility/SchemaInput";
import { companyCodeSchema, emailSchema, nameSchema, passwordSchema, usernameSchema } from "@/lib/schemas/schemas";
import { atom, useAtom } from "jotai";
import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { ErrorText } from "@/components/utility/ErrorText";
import { Company, GetCompanyByCodeResponse } from "@/proto/company_pb";
import { getCompanyByCode, signUp } from "@/app/(authentication)/register/actions";
import { Code } from "@connectrpc/connect";
import { fn, statusFrom } from "@/lib/utils";
import { AuthCard } from "@/app/(authentication)/(components)/AuthCard";
import { useUserStore } from "@/lib/state";
import { useRouter } from "next/navigation";
import { match } from "ts-pattern";
import { Role, Status, User } from "@/proto/user_pb";
import Link from "next/link";

const foundCompanyAtom = atom<Company | null>(null);

export default function Register() {
  const { user, saveUser } = useUserStore();

  const [company, setCompany] = useAtom(foundCompanyAtom);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();

  const signupMutation = useMutation<{ user?: User, mfaVerified?: boolean }>({
    mutationFn: fn(() => signUp({ companyId: company!.id, name: fullName, email, username, password })),
    onSuccess: ({ user, mfaVerified }) => {
      saveUser({ ...user!, mfaVerified: mfaVerified! });

      if (!mfaVerified) {
        router.replace("/mfa");
        return;
      }
      router.replace("/status/pending");
    },
    onError: (error) => {
      const status = statusFrom(error);
      error.message = match(status.code)
        .with(Code.AlreadyExists, () => {
          if (status.rawMessage === "email is already taken") return "The email you have entered already exists.";
          else return "The username you have entered already exists.";
        })
        .with(Code.NotFound, () => "The company you have entered no longer exists.")
        .otherwise(() => "The username you have entered already exists.")
    },
  });

  const signup = () => {
    const schemas = [nameSchema.safeParse(fullName), usernameSchema.safeParse(username), passwordSchema.safeParse(password), emailSchema.safeParse(email)];
    if (schemas.some(s => !s.success)) return;
    signupMutation.mutate();
  }

  if (user.loggedIn) {
    if (!user.mfaVerified) router.replace("/mfa");
    else if (user.role === Role.Admin && user!.status === Status.Accepted) router.replace("/dashboard");
    else if (user!.status === Status.Pending) router.replace("/status/pending");
    else if (user!.status === Status.Rejected) router.replace("/status/rejected");
    else if (user!.role === Role.Nurse) router.replace("/status/not-admin");
    else router.replace("/dashboard");
  }

  if (!company) return <FindCompany />;

  return (
    <AuthCard
      title="Create an account"
      description={
        <>
          Now that we have found your company
          (<span className="text-nowrap italic font-semibold">{company.name}</span>),
          please fill out the form below to register you.
        </>
      }
      content={
        <div className="grid w-full items-center gap-4">
          <SchemaInput value={fullName} setValue={setFullName} name="full name" schema={nameSchema} />
          <SchemaInput value={email} setValue={setEmail} name="email" schema={emailSchema} />
          <SchemaInput value={username} setValue={setUsername} name="username" schema={usernameSchema} />
          <SchemaInput value={password} setValue={setPassword} name="password" schema={passwordSchema} />
        </div>
      }
      footer={
        <div className="flex flex-col gap-4 w-full">
          <Button className="w-full font-bold" onClick={signup} disabled={signupMutation.isPending}>
            Register
          </Button>
          <ErrorText qm={signupMutation} />
        </div>
      }
      outsideContent={
        <Button size="sm" variant="link" className="text-center font-bold" onClick={() => setCompany(null)}>
          Don't recognize this company? Click here.
        </Button>
      }
    />
  );
}

function FindCompany() {
  const [code, setCode] = useState("");
  const [_foundCompany, setFoundCompany] = useAtom(foundCompanyAtom);

  const findCompanyMutation = useMutation<GetCompanyByCodeResponse>({
    mutationFn: fn(() => getCompanyByCode({ code: code.toUpperCase() })),
    onSuccess: ({ company }) => setFoundCompany(company!),
    onError: (error) => {
      const status = statusFrom(error);
      error.message = match(status.code)
        .with(Code.NotFound, () => "The company code you have entered doesn't exist.")
        .otherwise(() => "Failed to retrieve company. Please try again later.");
    },
  });

  const findCompany = () => {
    if (!companyCodeSchema.safeParse(code).success) return;
    findCompanyMutation.mutate();
  };

  return (
    <AuthCard
      title="Find your company"
      description="In order to register, we must first find your company. Please enter your company code below."
      content={
        <SchemaInput value={code} setValue={setCode} name="company code" schema={companyCodeSchema} />
      }
      footer={
        <div className="flex flex-col gap-4 w-full">
          <Button className="w-full font-bold" onClick={findCompany} disabled={findCompanyMutation.isPending}>
            Find Company
          </Button>
          <ErrorText qm={findCompanyMutation} />
        </div>
      }
      outsideContent={
        <Link href="/login" className="flex justify-center">
          <Button size="sm" variant="link" className="font-bold">
            Already have an account? Click here to login.
          </Button>
        </Link>
      }
    />
  );
}