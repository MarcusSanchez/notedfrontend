'use client'

import React, { useState } from "react"
import { Status, User } from "@/proto/user_pb"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem, SelectLabel,
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
      qc.invalidateQueries({ queryKey: ["userStats"] });
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
    <div className="flex items-center space-x-3">
      <span className="text-sm font-medium text-gray-700 whitespace-nowrap">Change Status:</span>
      <Select defaultValue={status2text(status)} value={status2text(status)} onValueChange={changeStatus}>
        <SelectTrigger className="w-[140px] border-orange-200 text-orange-600 hover:bg-orange-50">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="Accepted" className="text-green-600">
              Accepted
            </SelectItem>
            <SelectItem value="Rejected" className="text-red-600">
              Rejected
            </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
