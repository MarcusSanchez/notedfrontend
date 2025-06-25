'use client'

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { SchemaInputSm } from "@/components/utility/SchemaInput"
import { LockKeyhole } from "lucide-react"
import { User } from "@/proto/user_pb"
import { useMutation } from "@tanstack/react-query"
import { fn } from "@/lib/utils"
import { ErrorText } from "@/components/utility/ErrorText"
import { passwordSchema } from "@/lib/schemas/schemas";
import { changeUserPassword } from "@/app/dashboard/(pages)/nurses/[id]/actions";

export function ChangePasswordDialog({ user }: { user: User }) {
  const [open, setOpen] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const [overrideError, setOverrideError] = useState<string | null>(null);

  const changePasswordMutation = useMutation({
    mutationKey: ["changePassword", user.id],
    mutationFn: fn(() => changeUserPassword({ userId: user.id, newPassword })),
    onSuccess: () => {
      setOpen(false)
      setNewPassword("")
      setConfirmNewPassword("")
    },
    onError: (error) => error.message = "Failed to change password. Please try again.",
  });

  const changePassword = () => {
    if (newPassword !== confirmNewPassword) {
      setOverrideError("Passwords do not match");
      return;
    }
    if (!passwordSchema.safeParse(newPassword).success) return;
    setOverrideError(null);
    changePasswordMutation.mutate();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="font-bold" size="sm">
          <LockKeyhole className="h-4 w-4 mr-2" />
          Change Password
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Change Password</DialogTitle>
          <DialogDescription>
            Change {user.name}&#39;s password here. Click save when you&#39;re done.
          </DialogDescription>
          <div className="flex flex-col pt-2 gap-3">
            <SchemaInputSm
              value={newPassword}
              setValue={setNewPassword}
              name="new password"
              schema={passwordSchema}
            />
            <SchemaInputSm
              value={confirmNewPassword}
              setValue={setConfirmNewPassword}
              name="confirmed new password"
              schema={passwordSchema}
            />
          </div>
          <ErrorText qm={changePasswordMutation} override={overrideError} />
        </DialogHeader>
        <DialogFooter className="gap-2">
          <Button className="font-bold" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button className="font-bold" onClick={changePassword}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}