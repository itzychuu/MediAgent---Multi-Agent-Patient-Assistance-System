"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { AlertCircle, LogIn, Eye, EyeOff } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { getDashboardForRole } from "@/lib/auth/roles";
import { UserProfile } from "@/types";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect");
  const urlError = searchParams.get("error");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(urlError || null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!email.trim()) {
      setError("Please enter your registered email address.");
      return;
    }

    if (!password) {
      setError("Please enter your password.");
      return;
    }

    try {
      setLoading(true);
      const supabase = createClient();

      const { data: authData, error: authError } =
        await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

      if (authError) {
        if (authError.message.toLowerCase().includes("invalid login credentials")) {
          setError("Incorrect email or password. Please verify and try again.");
        } else if (authError.message.toLowerCase().includes("email not confirmed")) {
          setError(
            "Your email has not been verified yet. Please check your inbox for the confirmation link."
          );
        } else {
          setError(authError.message);
        }
        setLoading(false);
        return;
      }

      if (!authData.user) {
        setError("Unable to locate user session. Please try again.");
        setLoading(false);
        return;
      }

      // Fetch user profile from Supabase
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role, account_status")
        .eq("id", authData.user.id)
        .single();

      if (profileError || !profile) {
        // Fallback to metadata if profile record is still synchronizing
        const userRole = (authData.user.user_metadata?.role as UserProfile["role"]) || "patient";
        router.push(getDashboardForRole(userRole));
        router.refresh();
        return;
      }

      // Check account status
      if (profile.account_status === "suspended") {
        router.push("/suspended");
        router.refresh();
        return;
      }

      if (profile.account_status === "pending") {
        router.push("/pending");
        router.refresh();
        return;
      }

      // If user had requested a specific path and has proper permissions, send there, else role dashboard
      if (redirectPath && redirectPath.startsWith(`/${profile.role}`)) {
        router.push(redirectPath);
      } else {
        router.push(getDashboardForRole(profile.role as UserProfile["role"]));
      }

      router.refresh();
    } catch (err: unknown) {
      console.error("Sign-in failure:", err);
      const message =
        err instanceof Error
          ? err.message
          : "An unexpected error occurred during sign-in. Please try again.";
      setError(message);
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="flex items-start gap-2.5 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3.5 text-xs text-rose-300">
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-400 mt-0.5" />
          <p className="leading-relaxed">{error}</p>
        </div>
      )}

      <div>
        <Input
          label="Email Address"
          type="email"
          placeholder="name@hospital.org"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
          required
        />
      </div>

      <div className="space-y-1.5">
        <label
          htmlFor="password"
          className="block text-xs font-semibold uppercase tracking-wider text-slate-300"
        >
          Password
        </label>
        <div className="relative">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            required
            className="w-full rounded-lg border border-slate-700/80 bg-slate-900/90 px-3.5 py-2.5 pr-10 text-sm text-slate-100 placeholder:text-slate-500 transition-colors focus:border-transparent focus:outline-none focus:ring-2 focus:ring-teal-500 hover:border-slate-600"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      <Button
        type="submit"
        variant="primary"
        className="w-full mt-2"
        isLoading={loading}
      >
        <LogIn className="h-4 w-4 mr-2" />
        Sign In to MediAgent
      </Button>

      <div className="text-center pt-2">
        <p className="text-xs text-slate-400">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="font-semibold text-teal-400 hover:text-teal-300 transition underline underline-offset-4"
          >
            Create an account
          </Link>
        </p>
      </div>
    </form>
  );
}
