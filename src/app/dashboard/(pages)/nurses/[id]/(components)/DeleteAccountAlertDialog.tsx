"use client";

import { Button } from "@/components/ui/button"
import { useMutation } from "@tanstack/react-query";
import { User } from "@/proto/user_pb";
import { AlertTriangle, CheckCircle, Shield, Trash2 } from "lucide-react";
import { cn, fn } from "@/lib/utils";
import { deleteUser } from "@/app/dashboard/(pages)/nurses/[id]/actions";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogTrigger,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogFooter
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

export function DeleteAccountAlertDialog({ user }: { user: User }) {
  const router = useRouter();
  const { toast } = useToast();

  const [open, setOpen] = useState(false);
  const [confirmationText, setConfirmationText] = useState('');
  const [error, setError] = useState<string | null>(null);

  const expectedConfirmation = 'DELETE';
  const isConfirmationValid = confirmationText.trim().toUpperCase() === expectedConfirmation;

  const deleteAccountMutation = useMutation({
    mutationKey: ["deleteAccount", user.id],
    mutationFn: fn(() => deleteUser({ userId: user.id })),
    onSuccess: () => {
      router.replace("/dashboard/nurses");
      toast({
        title: "Account successfully deleted",
        description: "The following account has been successfully deleted: " + user.name,
      });
    },
  });

  const resetForm = () => {
    setConfirmationText('');
    setError(null);
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      resetForm();
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogTrigger asChild>
        <Button
          variant="outline"
          className="border-red-200 text-red-600 hover:bg-red-50"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Delete Account
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="sm:max-w-md min-w-[35vw]">
        <AlertDialogHeader>
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <AlertDialogTitle className="text-xl font-bold text-gray-900">
                Delete Account
              </AlertDialogTitle>
              <AlertDialogDescription className="text-gray-600">
                This action cannot be undone. This will permanently delete the account.
              </AlertDialogDescription>
            </div>
          </div>
        </AlertDialogHeader>

        <div className="space-y-6">
          {/* Warning Section */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-red-800">
                <p className="font-medium mb-2">This will permanently delete:</p>
                <ul className="space-y-1 text-red-700">
                  <li>• <strong>{user.name}'s</strong> account and profile</li>
                  <li>• All associated patient assignments</li>
                  <li>• All notes and documentation history</li>
                  <li>• Access to the CareNotes platform</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Account Information */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <Shield className="w-5 h-5 text-gray-600" />
              <div className="text-sm text-gray-800">
                <p className="font-medium">Account to be deleted:</p>
                <p className="text-gray-700 mt-1">{user.name}</p>
              </div>
            </div>
          </div>

          {/* Confirmation Input */}
          <div className="space-y-2">
            <Label htmlFor="confirmation" className="text-sm font-medium text-gray-700">
              Type "DELETE" to confirm
            </Label>
            <Input
              id="confirmation"
              type="text"
              placeholder="Type DELETE to confirm"
              value={confirmationText}
              onChange={(e) => setConfirmationText(e.target.value)}
              className="border-gray-300 focus:border-red-400 focus:ring-red-400/20"
            />
            <p className="text-xs text-gray-500">
              This confirmation is required to prevent accidental deletions
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Security Notice */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">Security Notice:</p>
                <ul className="space-y-1 text-blue-700">
                  <li>• This action requires administrator privileges</li>
                  <li>• All data will be permanently removed from our servers</li>
                  <li>• The user will be immediately logged out</li>
                  <li>• This action is logged for security purposes</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <AlertDialogFooter className="gap-2 pt-6">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={deleteAccountMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            onClick={() => deleteAccountMutation.mutate()}
            disabled={deleteAccountMutation.isPending || !isConfirmationValid}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            {deleteAccountMutation.isPending ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Account
              </>
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}