"use client";

import { usePathname, useRouter } from "next/navigation";
import { useNeedsToRefresh, useUserStore } from "@/lib/state";
import { QueryStatus, useMutation, useQueryClient } from "@tanstack/react-query";
import { Role, Status, User } from "@/proto/user_pb";
import { Code } from "@connectrpc/connect";
import { fn, statusFrom } from "@/lib/utils";
import { refreshSession, refreshSessionWithPassword } from "@/lib/common-actions";
import React, { Dispatch, ReactNode, SetStateAction, useEffect, useRef, useState } from "react";
import { AuthCard } from "@/app/(authentication)/(components)/AuthCard";
import { Button } from "@/components/ui/button";
import { SpinnerCard } from "@/components/utility/SpinnerCard";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { SchemaInput } from "@/components/utility/SchemaInput";
import { passwordSchema } from "@/lib/schemas/schemas";
import { RefreshState } from "@/proto/session_pb";

type InitProps = {
  children: ReactNode;
  hasSession: boolean;
};

export default function Init({ children, hasSession }: InitProps) {
  const { user, saveUser } = useUserStore();
  const router = useRouter();
  const { refresh, needsToRefresh } = useNeedsToRefresh();

  const [loaded, setLoaded] = useState(!hasSession);

  const pathname = usePathname();

  const refreshSessionMu = useMutation<{ user?: User, state?: RefreshState, mfaVerified?: boolean }>({
    mutationFn: fn(() => refreshSession()),
    onSuccess: ({ user, state, mfaVerified }) => {
      if (state === RefreshState.RequiresPassword) refresh();
      saveUser({ ...user!, mfaVerified: mfaVerified! });
    },
    onError: (error) => {
      const status = statusFrom(error)
      switch (status.code) {
        case Code.Unauthenticated:
          break;
        case Code.DeadlineExceeded:
          user.loggedIn = true;
          saveUser(user);
          break;
        default:
          error.message = "Failed to authenticate, please try again.";
          break;
      }
    },
    onSettled: () => setLoaded(true),
  });

  const lastRefreshTimeRef = useRef(0);

  useEffect(() => {
    const DEBOUNCE_INTERVAL = 5 * 60 * 1000; // 5 minutes

    const handleFocus = () => {
      const currentTime = Date.now();
      if (hasSession && (currentTime - lastRefreshTimeRef.current > DEBOUNCE_INTERVAL)) {
        refreshSessionMu.mutate();
        lastRefreshTimeRef.current = currentTime;
      }
    };

    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) handleFocus();
    });

    return () => {
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleFocus);
    };
  }, [hasSession]);

  useEffect(() => {
    if (refreshSessionMu.isPending) return;
    if (hasSession && !loaded) {
      refreshSessionMu.mutate();
      return;
    }
    if (refreshSessionMu.isError) return;

    setLoaded(true);
    if (user.mfaVerified && user.role === Role.Nurse) router.replace("/status/not-admin");
    else if (user.mfaVerified && user.status === Status.Pending) router.replace("/status/pending");
    else if (user.mfaVerified && user.status === Status.Rejected) router.replace("/status/rejected");
  }, [refreshSessionMu.status]);

  if (!pathname.startsWith("/dashboard")) return children;

  if (pathname.startsWith("/dashboard") && needsToRefresh) {
    return (
      <>
        {children}
        <div className="fixed inset-0 bg-black/50 backdrop-blur z-[999]" onClick={e => e.stopPropagation()}>
          <RefreshWithPassword setLoaded={setLoaded} />
        </div>
      </>
    );
  }

  if (loaded) return children;

  if (refreshSessionMu.isError) return (
    <AuthCard
      title="Oops! Something went wrong."
      // @ts-expect-error -- rawMessage does in fact exist
      description={refreshSessionMu.error.rawMessage.slice(0, 1).toUpperCase() + refreshSessionMu.error.rawMessage.slice(1) + "."}
      footer={
        <div className="flex flex-col gap-4 w-full">
          <Button className="w-full font-bold" onClick={() => refreshSessionMu.mutate()}>
            Retry
          </Button>
        </div>
      }
    />
  );
  return <SpinnerCard />;
}

type RefreshWithPasswordProps = {
  setLoaded: Dispatch<SetStateAction<boolean>>;
};

function RefreshWithPassword({ setLoaded }: RefreshWithPasswordProps) {
  const { user, saveUser, signOut } = useUserStore();
  const { clear } = useNeedsToRefresh();

  const [password, setPassword] = useState("");

  const qc = useQueryClient();

  const refreshSessionWPasswordMu = useMutation<{ user?: User, mfaVerified?: boolean }>({
    mutationFn: fn(() => refreshSessionWithPassword(password)),
    onSuccess: async ({ user, mfaVerified }) => {
      saveUser({ ...user!, mfaVerified: mfaVerified! });
      clear();
      setLoaded(true);
      await qc.refetchQueries({
        predicate: query => (["error", "pending"] as QueryStatus[]).includes(query.state.status),
        type: "all",
      });
    },
    onError: (error) => {
      const status = statusFrom(error);
      switch (status.code) {
        case Code.Unauthenticated:
          error.message = "Unable to signin, please check your credentials and try again.";
          break;
        default:
          error.message = "Failed to authenticate, please try again.";
          break;
      }
    },
  });

  // temporarily disable scrolling while this is mounted
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto"
    };
  }, []);

  const refreshSessionWPassword = () => {
    if (!passwordSchema.safeParse(password).success) return;
    refreshSessionWPasswordMu.mutate();
  };

  return (
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center"
      onClick={(e) => e.stopPropagation()}
    >
      <Card className="p-6 md:min-w-[450px] lg:min-w-[650px]" onClick={(e) => e.stopPropagation()}>
        <CardTitle className="text-xl">Welcome Back!</CardTitle>
        <CardDescription>
          In order to continue, please reauthenticate
          {user.username.length > 0 && <>
            {" "}for{" "}
            <span className="text-foreground font-bold">@{user.username}</span>
          </>}.
          <br />
          <Button variant="link" size="sm" className="font-semibold text-red-500 dark:text-mocha-red p-0 mt-[-.5rem]" onClick={() => signOut()}>
            Not you? Sign in as a different user.
          </Button>
        </CardDescription>
        <div className="flex flex-col justify-between gap-4 mt-4">
          <SchemaInput
            value={password}
            setValue={setPassword}
            name={"password"}
            schema={passwordSchema}
          />
          <Button
            className="w-full font-bold"
            onClick={refreshSessionWPassword}
          >
            Authenticate
          </Button>
        </div>
      </Card>
    </div>
  );
}
