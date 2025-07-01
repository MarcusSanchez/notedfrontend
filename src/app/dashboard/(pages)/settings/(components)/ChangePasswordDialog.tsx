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
import { useMutation } from "@tanstack/react-query"
import { fn, statusFrom } from "@/lib/utils"
import { passwordSchema } from "@/lib/schemas/schemas";
import { changeUserPassword } from "@/app/dashboard/(pages)/nurses/[id]/actions";
import { useUserStore } from "@/lib/state";
import { AlertCircle, CheckCircle, Eye, EyeOff, Lock } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

export function ChangePasswordDialog() {
  const { user } = useUserStore();

  const [open, setOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const changePasswordMutation = useMutation({
    mutationKey: ["changePassword", user.id],
    mutationFn: fn(() => changeUserPassword({ userId: user.id, newPassword, currentPassword })),
    onSuccess: () => {
      setOpen(false)
      setNewPassword("")
      setConfirmNewPassword("")
    },
    onError: (error) => {
      const status = statusFrom(error);
      setError(status.rawMessage);
    }
  });

  const changePassword = () => {
    if (newPassword !== confirmNewPassword) {
      setError("Passwords do not match");
      return;
    }
    const currentPasswordValid = passwordSchema.safeParse(currentPassword);
    if (!currentPasswordValid.success) {
      setError("Current " + currentPasswordValid.error.errors[0].message);
      return;
    }
    const newPasswordValid = passwordSchema.safeParse(newPassword);
    if (!newPasswordValid.success) {
      setError("New " + newPasswordValid.error.errors[0].message);
      return;
    }

    setError(null);
    changePasswordMutation.mutate();
  };

  const resetForm = () => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmNewPassword('');
    setError(null);
    setShowCurrentPassword(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      resetForm();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="border-blue-200 text-blue-600 hover:bg-blue-50"
        >
          <Lock className="w-4 h-4 mr-2" />
          Change Password
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md min-w-[35vw]">
        <DialogHeader>
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Lock className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold text-gray-900">
                Change Password
              </DialogTitle>
              <DialogDescription className="text-gray-600">
                Update your password to keep your account secure.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Current Password */}
          <div className="space-y-2">
            <Label htmlFor="currentPassword" className="text-sm font-medium text-gray-700">
              Current Password
            </Label>
            <div className="relative">
              <Input
                id="currentPassword"
                type={showCurrentPassword ? 'text' : 'password'}
                placeholder="Enter your current password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="pr-12 border-gray-300 focus:border-blue-400 focus:ring-blue-400/20"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showCurrentPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div className="space-y-2">
            <Label htmlFor="newPassword" className="text-sm font-medium text-gray-700">
              New Password
            </Label>
            <div className="relative">
              <Input
                id="newPassword"
                type={showNewPassword ? 'text' : 'password'}
                placeholder="Enter your new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="pr-12 border-gray-300 focus:border-blue-400 focus:ring-blue-400/20"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showNewPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            <p className="text-xs text-gray-500">
              Password must be at least 8 characters with uppercase, lowercase, and numbers
            </p>
          </div>

          {/* Confirm New Password */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
              Confirm New Password
            </Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm your new password"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                className="pr-12 border-gray-300 focus:border-blue-400 focus:ring-blue-400/20"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Success Indicators */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">Password Security Tips:</p>
                <ul className="space-y-1 text-blue-700">
                  <li>• Use a unique password you haven't used before</li>
                  <li>• Include a mix of letters, numbers, and symbols</li>
                  <li>• Avoid using personal information</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2 pt-6">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={changePasswordMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            onClick={changePassword}
            disabled={changePasswordMutation.isPending || !currentPassword || !newPassword || !confirmNewPassword}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {changePasswordMutation.isPending ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Changing...
              </>
            ) : (
              <>
                <Lock className="w-4 h-4 mr-2" />
                Change Password
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
