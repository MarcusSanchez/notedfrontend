"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button, buttonVariants } from "@/components/ui/button"
import { useMutation } from "@tanstack/react-query";
import { User } from "@/proto/user_pb";
import { Trash2 } from "lucide-react";
import { cn, fn } from "@/lib/utils";
import { deleteUser } from "@/app/dashboard/(pages)/nurses/[id]/actions";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

export function DeleteAccountAlertDialog({ user }: { user: User }) {
  const router = useRouter();
  const { toast } = useToast();

  const deleteAccountMutation = useMutation({
    mutationKey: ["deleteAccount", user.id],
    mutationFn: fn(() => deleteUser({ userId: user.id })),
    onSuccess: () => {
      router.replace("/dashboard");
      toast({
        title: "Account successfully deleted",
        description: "The following account has been successfully deleted: " + user.name,
      });
    },
  });

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button className="font-bold" variant="destructive" size="sm">
          <Trash2 className="h-4 w-4 mr-2" />
          Delete Account
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete {user.name}&#39;s
            account and remove their data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="font-bold">Cancel</AlertDialogCancel>
          <AlertDialogAction
            className={cn(buttonVariants({ variant: "destructive" }), "font-bold")}
            onClick={() => deleteAccountMutation.mutate()}
          >
            Delete Account
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
