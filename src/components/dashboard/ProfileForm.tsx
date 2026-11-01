"use client";

import React, { useState, useTransition } from "react";
import { UserProfile } from "@/types";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { RoleBadge, StatusBadge } from "@/components/ui/Badge";
import { updateOwnProfile } from "@/lib/auth/profile-actions";
import { CheckCircle2, AlertCircle, Save, Lock } from "lucide-react";

interface ProfileFormProps {
  profile: UserProfile;
}

export function ProfileForm({ profile }: ProfileFormProps) {
  const [fullName, setFullName] = useState(profile.full_name);
  const [avatarUrl, setAvatarUrl] = useState(profile.avatar_url || "");
  const [isPending, startTransition] = useTransition();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSuccessMessage(null);
    setErrorMessage(null);

    startTransition(async () => {
      try {
        await updateOwnProfile({
          full_name: fullName,
          avatar_url: avatarUrl,
        });
        setSuccessMessage("Your profile has been successfully updated.");
      } catch (err: unknown) {
        setErrorMessage(
          err instanceof Error
            ? err.message
            : "An unexpected error occurred while updating profile."
        );
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {successMessage && (
        <div className="flex items-center gap-2.5 rounded-xl border border-teal-500/30 bg-teal-500/10 p-4 text-xs text-teal-300">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-teal-400" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="flex items-center gap-2.5 rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-xs text-rose-300">
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Editable Fields */}
      <div className="space-y-4">
        <div>
          <Input
            label="Full Name or Facility Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            disabled={isPending}
            required
          />
        </div>

        <div>
          <Input
            label="Avatar Image URL (Optional)"
            placeholder="https://images.example.com/avatar.jpg"
            value={avatarUrl}
            onChange={(e) => setAvatarUrl(e.target.value)}
            disabled={isPending}
            hint="URL pointing to a public profile photo or institution logo"
          />
        </div>
      </div>

      <div className="pt-2">
        <Button
          type="submit"
          variant="primary"
          isLoading={isPending}
          className="w-full sm:w-auto"
        >
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
      </div>

      {/* Read-Only Protected Fields */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5 space-y-4 mt-8">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
          <Lock className="h-4 w-4 text-slate-500" />
          <span>Protected Security Properties</span>
        </div>

        <p className="text-xs text-slate-400">
          The following properties are governed by server-side authorization policies and cannot be modified by the client.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="rounded-lg border border-slate-800/80 bg-slate-950/60 p-3">
            <span className="text-[11px] text-slate-500 block">Registered Email</span>
            <span className="text-xs font-medium text-slate-200">{profile.email}</span>
          </div>

          <div className="rounded-lg border border-slate-800/80 bg-slate-950/60 p-3">
            <span className="text-[11px] text-slate-500 block">Assigned Role</span>
            <div className="mt-1">
              <RoleBadge role={profile.role} />
            </div>
          </div>

          <div className="rounded-lg border border-slate-800/80 bg-slate-950/60 p-3">
            <span className="text-[11px] text-slate-500 block">Account Status</span>
            <div className="mt-1">
              <StatusBadge status={profile.account_status} />
            </div>
          </div>

          <div className="rounded-lg border border-slate-800/80 bg-slate-950/60 p-3">
            <span className="text-[11px] text-slate-500 block">Member Since</span>
            <span className="text-xs font-medium text-slate-200">
              {new Date(profile.created_at).toLocaleDateString()}
            </span>
          </div>
        </div>

        <div className="text-[11px] text-slate-500 font-mono pt-2 border-t border-slate-800/80">
          Unique UUID: {profile.id}
        </div>
      </div>
    </form>
  );
}

export default ProfileForm;
