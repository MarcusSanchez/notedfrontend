"use client";

import { atom, useAtom } from "jotai";
import { Role, Status } from "@/proto/user_pb";
import { signOut as signOutAction } from "@/lib/common-actions";
import { useQueryClient } from "@tanstack/react-query";
import { fn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { GoalProgress, Health, HealthAndSafetyStep, MethodType } from "@/proto/note_pb";

type UserAtom = {
  id: string;
  name: string;
  username: string;
  email: string;
  status: Status;
  isLicensed: boolean;
  role: Role;
  companyId: string;
  loggedIn: boolean;
  mfaVerified: boolean;
};

const defaultUser = (): UserAtom => ({
  id: "",
  name: "",
  username: "",
  email: "",
  status: Status.UnspecifiedStatus,
  role: Role.UnspecifiedRole,
  isLicensed: false,
  companyId: "",
  loggedIn: false,
  mfaVerified: false,
});

const userAtom = atom<UserAtom>(defaultUser());

export function useUserStore() {
  const [user, setUser] = useAtom(userAtom);
  const qc = useQueryClient();
  const { toast } = useToast();

  const saveUser = (user: Omit<UserAtom, "loggedIn">) => setUser({ ...user, loggedIn: true });
  const clearUser = () => setUser(defaultUser());

  const signOut = async (path: string = "/login") => {
    try {
      await fn(() => signOutAction())();
      clearUser();
      qc.clear();
      // we don't use the router here because forcing a reload is the only way to clear bad state such as 'hasSession';
      // using the server to revalidate everything, including the session, is the only way to ensure a clean slate
      window.location.href = path;
    } catch (error: any) {
      console.error("Failed to sign out:", error);
      toast({ title: "Failed to sign out.", description: "Please check your network connection and try again." });
    }
  };

  return { user, clearUser, saveUser, signOut };
}

type EventInput = {
  description: string;
  methods: MethodType[];
  choices: string[];
  hasChoices: boolean;
}

export const defaultEventInput = () => ({
  description: "",
  methods: [] as MethodType[],
  choices: [] as string[],
  hasChoices: false,
} as EventInput);

const defaultNote = () => ({
  patient: {
    id: "",
    firstName: "",
    lastName: "",
    hasMaladaptiveBehaviors: false,
  },
  date: new Date(),
  physicalHealth: Health.UnspecifiedHealth,
  emotionalHealth: Health.UnspecifiedHealth,
  exhibitedBehaviors: false,
  behaviorDescription: "",
  goalId: "",
  goalProgress: GoalProgress.UnspecifiedGoalProgress,
  discussedMonthlyEducation: null as boolean | null,
  additionalInformation: "",
  steps: [] as HealthAndSafetyStep[],
  events: [] as EventInput[],
});

const noteAtom = atom(defaultNote());

export function useNoteStore() {
  const [note, setNote] = useAtom(noteAtom);
  const resetNote = () => setNote(defaultNote());

  return { note, setNote, resetNote };
}

const needsToRefreshAtom = atom(false);

export function useNeedsToRefresh() {
  const [needsToRefresh, setNeedsToRefresh] = useAtom(needsToRefreshAtom);
  const refresh = () => setNeedsToRefresh(true);
  const clear = () => setNeedsToRefresh(false);

  return { needsToRefresh, refresh, clear };
}