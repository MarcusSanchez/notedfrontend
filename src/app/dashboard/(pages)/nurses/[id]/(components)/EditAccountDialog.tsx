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
import { nameSchema, usernameSchema } from "@/lib/schemas/schemas";
import { CheckCircle, AlertCircle, Edit, User as UserIcon } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { fn } from "@/lib/utils";
import { updateUser } from "@/app/dashboard/(pages)/nurses/[id]/actions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User } from "@/proto/user_pb";

export function EditAccountDialog({ user }: { user: User }) {
  const qc = useQueryClient();

  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState(user.username);
  const [name, setName] = useState(user.name);
  const [error, setError] = useState<string | null>(null);

  const editAccountMutation = useMutation({
    mutationFn: fn(() => updateUser({ userId: user.id, username, name })),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["getUser", user.id] });
      setOpen(false);
    },
    onError: () => setError("Failed to edit account. Please try again."),
  });

  const editAccount = () => {
    const schemas = [nameSchema.safeParse(name), usernameSchema.safeParse(username)];
    for (const schema of schemas) {
      if (!schema.success) {
        setError(schema.error.errors[0].message);
        return;
      }
    }
    editAccountMutation.mutate();
  };

  const resetForm = () => {
    setName(user.name);
    setUsername(user.username);
    setError(null);
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      resetForm();
    }
  };

  const hasChanges = name.trim() !== user.name || username.trim() !== user.username;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="border-green-200 text-green-600 hover:bg-green-50"
        >
          <Edit className="w-4 h-4 mr-2" />
          Edit Account
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md min-w-[35vw]">
        <DialogHeader>
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <UserIcon className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold text-gray-900">
                Edit Account
              </DialogTitle>
              <DialogDescription className="text-gray-600">
                Make changes to their account information. Click save when you're done.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Name Field */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium text-gray-700">
              Full Name
            </Label>
            <div className="relative">
              <Input
                id="name"
                type="text"
                placeholder="Enter their full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="pl-12 border-gray-300 focus:border-green-400 focus:ring-green-400/20"
              />
              <UserIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
            <p className="text-xs text-gray-500">
              Their full name as it appears on official documents
            </p>
          </div>

          {/* Username Field */}
          <div className="space-y-2">
            <Label htmlFor="username" className="text-sm font-medium text-gray-700">
              Username
            </Label>
            <div className="relative">
              <Input
                id="username"
                type="text"
                placeholder="Enter their username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="pl-12 border-gray-300 focus:border-green-400 focus:ring-green-400/20"
              />
              <UserIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
            <p className="text-xs text-gray-500">
              Username can only contain letters, numbers
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Changes Indicator */}
          {hasChanges && !error && (
            <div className="flex items-center space-x-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0" />
              <p className="text-sm text-blue-700">Changes detected and ready to save</p>
            </div>
          )}

          {/* Info Box */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
              <div className="text-sm text-green-800">
                <p className="font-medium mb-1">Account Information Guidelines:</p>
                <ul className="space-y-1 text-green-700">
                  <li>• Use their real name for professional identification</li>
                  <li>• Choose a username that's easy to remember</li>
                  <li>• Changes will be reflected across the platform</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2 pt-6">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={editAccountMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            onClick={editAccount}
            disabled={editAccountMutation.isPending || !hasChanges || !name.trim() || !username.trim()}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            {editAccountMutation.isPending ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Saving...
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}