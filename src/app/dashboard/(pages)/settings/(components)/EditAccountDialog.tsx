"use client";

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
import { DialogBody } from "next/dist/client/components/react-dev-overlay/internal/components/Dialog";
import { nameSchema, usernameSchema } from "@/lib/schemas/schemas";
import { Edit } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { fn } from "@/lib/utils";
import { ErrorText } from "@/components/utility/ErrorText";
import { updateUser } from "@/app/dashboard/(pages)/nurses/[id]/actions";
import { useUserStore } from "@/lib/state";

export function EditAccountDialog() {
  const { user } = useUserStore();

  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState(user.username);
  const [name, setName] = useState(user.name);

  const editAccountMutation = useMutation({
    mutationFn: fn(() => updateUser({ userId: user.id, username, name })),
    onSuccess: () => {
      setOpen(false);
      // the stored user is retrieved via the server on render, therefore to show an updated user we need to force a reload
      window.location.href = "/dashboard/settings";
    },
    onError: (error) => error.message = "Failed to edit account. Please try again.",
  });

  const editAccount = () => {
    const schemas = [nameSchema.safeParse(name), usernameSchema.safeParse(username)];
    if (schemas.some(s => !s.success)) return;
    editAccountMutation.mutate();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary" className="font-bold" size="sm">
          <Edit className="h-4 w-4 mr-2" />
          Edit Account
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit account</DialogTitle>
          <DialogDescription>
            Make changes to your account here. Click save when you&#39;re done.
          </DialogDescription>
        </DialogHeader>
        <DialogBody>
          <div className="flex flex-col pt-2 gap-3">
            <SchemaInputSm value={name} setValue={setName} name="name" schema={nameSchema} />
            <SchemaInputSm value={username} setValue={setUsername} name="username" schema={usernameSchema} />
          </div>
          <ErrorText qm={editAccountMutation} />
        </DialogBody>
        <DialogFooter className="gap-2">
          <Button className="font-bold" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button className="font-bold" onClick={editAccount}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
