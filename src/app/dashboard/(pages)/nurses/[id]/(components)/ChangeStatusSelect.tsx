'use client'

import React, { useState } from "react"
import { Status, User } from "@/proto/user_pb"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { status2text } from "@/lib/tools/enum2text";
import { match } from "ts-pattern";
import { fn } from "@/lib/utils";
import { approveNurse, rejectNurse } from "@/app/dashboard/actions";

export function ChangeStatusSelect({ user }: { user: User }) {
  const qc = useQueryClient();
  const [status, setStatus] = useState(user.status);

  const updateStatusMutation = useMutation({
    mutationFn: fn(async () => {
      if (status === Status.Accepted) {
        return await approveNurse({ nurseId: user.id }, user.name);
      }
      return await rejectNurse({ nurseId: user.id }, user.name);
    }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["getUser", user.id] });
    },
    onError: (error) => error.message = "Failed to update status. Please try again.",
  });

  const changeStatus = (status: string) => {
    const newStatus = match(status)
      .with("Accepted", () => Status.Accepted)
      .with("Pending", () => Status.Pending)
      .with("Rejected", () => Status.Rejected)
      .otherwise(() => Status.UnspecifiedStatus);

    setStatus(newStatus);
    updateStatusMutation.mutate();
  };

  return (
    <Select defaultValue={status2text(status)} value={status2text(status)} onValueChange={changeStatus}>
      <SelectTrigger className="w-[120px] h-8">
        <SelectValue placeholder="Status" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Status</SelectLabel>
          <SelectItem value="Accepted">Accepted</SelectItem>
          <SelectItem value="Rejected">Rejected</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
