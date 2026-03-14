"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";
import { api } from "@/convex/_generated/api";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { AlertTriangle, Loader2 } from "lucide-react";

const profileSchema = z.object({
  name: z.string().min(1, "Name is required"),
});

type ProfileForm = z.infer<typeof profileSchema>;

export default function SettingsPage() {
  const router = useRouter();
  const { signOut } = useAuthActions();
  const currentUser = useQuery(api.users.getCurrentUser);
  const updateProfile = useMutation(api.users.updateProfile);
  const deleteCurrentUser = useMutation(api.users.deleteCurrentUser);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [confirmEmail, setConfirmEmail] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    values: { name: currentUser?.name ?? "" },
  });

  const userEmail = currentUser?.email ?? "";
  const canConfirm =
    userEmail.length > 0 && confirmEmail.trim().toLowerCase() === userEmail.toLowerCase();

  async function onSubmit(data: ProfileForm) {
    try {
      await updateProfile({ name: data.name });
      toast.success("Profile updated");
    } catch {
      toast.error("Failed to update profile");
    }
  }

  async function handleDeleteAccount() {
    if (!canConfirm) return;
    setIsDeleting(true);
    try {
      await deleteCurrentUser({});
      await signOut();
      toast.success("Account deleted");
      router.push("/");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete account");
      setIsDeleting(false);
    }
  }

  return (
    <div className="container mx-auto max-w-3xl px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Account Settings</h1>
        <p className="mt-1 text-muted-foreground">Manage your account and profile.</p>
      </div>

      {/* Profile */}
      <section className="mb-8 rounded-xl border bg-card p-6">
        <h2 className="mb-4 text-lg font-semibold">Profile</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="name">Display name</Label>
            <Input id="name" {...register("name")} />
            {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label>Email</Label>
            <Input value={userEmail} readOnly className="bg-muted" />
            <p className="text-xs text-muted-foreground">Email cannot be changed here.</p>
          </div>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save changes
          </Button>
        </form>
      </section>

      {/* Danger zone */}
      <section className="rounded-xl border border-destructive/40 bg-destructive/5 p-6">
        <div className="flex items-start gap-3">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-destructive">Danger Zone</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Permanently delete your account and all associated data. This cannot be undone.
            </p>
            <Button
              variant="destructive"
              size="sm"
              className="mt-4"
              onClick={() => {
                setConfirmEmail("");
                setDeleteOpen(true);
              }}
            >
              Delete my account
            </Button>
          </div>
        </div>
      </section>

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-destructive">Delete account</DialogTitle>
            <DialogDescription>
              This will permanently delete your account and all data. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <Label htmlFor="confirm-email">Type your email to confirm</Label>
            <p className="rounded-md bg-muted px-3 py-1.5 font-mono text-sm">{userEmail}</p>
            <Input
              id="confirm-email"
              type="email"
              value={confirmEmail}
              onChange={e => setConfirmEmail(e.target.value)}
              placeholder={userEmail}
              autoComplete="off"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteOpen(false)} disabled={isDeleting}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              disabled={!canConfirm || isDeleting}
              onClick={handleDeleteAccount}
            >
              {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isDeleting ? "Deleting..." : "Delete permanently"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
