"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  CheckCircle2,
  User,
  Stethoscope,
  Building2,
  ArrowRight,
  Eye,
  EyeOff,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { getDashboardForRole } from "@/lib/auth/roles";

type RegisterRole = "patient" | "doctor" | "hospital";

export default function RegisterForm() {
  const router = useRouter();

  const [role, setRole] = useState<RegisterRole>("patient");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const validate = () => {
    const errors: Record<string, string> = {};

    if (!fullName.trim()) {
      errors.fullName = "Full name or organization name is required.";
    }

    if (!email.trim()) {
      errors.email = "Email address is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errors.email = "Please provide a valid email address.";
    }

    if (!password) {
      errors.password = "Password is required.";
    } else if (password.length < 8) {
      errors.password = "Password must be at least 8 characters long.";
    } else if (!/[A-Za-z]/.test(password) || !/[0-9!@#$%^&*]/.test(password)) {
      errors.password =
        "Password must contain letters and at least one number or special symbol.";
    }

    if (password !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match.";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setApiError(null);
    setSuccessMessage(null);

    if (!validate()) {
      return;
    }

    try {
      setLoading(true);
      const supabase = createClient();

      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            full_name: fullName.trim(),
            role,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        setApiError(error.message);
        setLoading(false);
        return;
      }

      // Check if session was returned immediately or email confirmation is required
      if (data.session) {
        if (role === "doctor" || role === "hospital") {
          router.push("/pending");
        } else {
          router.push(getDashboardForRole(role));
        }
        router.refresh();
      } else {
        setSuccessMessage(
          `Registration successful! A verification link has been sent to ${email.trim()}. Please check your inbox and verify your email to continue.`
        );
        setLoading(false);
      }
    } catch (err: unknown) {
      console.error("Registration error:", err);
      const message =
        err instanceof Error
          ? err.message
          : "An unexpected error occurred during registration.";
      setApiError(message);
      setLoading(false);
    }
  };

  if (successMessage) {
    return (
      <div className="rounded-2xl border border-teal-500/30 bg-slate-900/90 p-8 text-center space-y-4">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-500/10 border border-teal-500/30 text-teal-400">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <h2 className="text-xl font-bold text-white">Check Your Email</h2>
        <p className="text-sm leading-relaxed text-slate-300">
          {successMessage}
        </p>
        <div className="pt-4">
          <Link href="/login">
            <Button variant="primary" className="w-full">
              Proceed to Sign In
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {apiError && (
        <div className="flex items-start gap-2.5 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3.5 text-xs text-rose-300">
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-400 mt-0.5" />
          <p className="leading-relaxed">{apiError}</p>
        </div>
      )}

      {/* Role Selector Tabs */}
      <div className="space-y-2">
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
          Select Account Type
        </label>
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => setRole("patient")}
            className={`flex flex-col items-center justify-center rounded-xl border p-3 text-center transition-all cursor-pointer ${
              role === "patient"
                ? "border-teal-500 bg-teal-500/10 text-white"
                : "border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700 hover:text-slate-200"
            }`}
          >
            <User
              className={`h-5 w-5 mb-1.5 ${
                role === "patient" ? "text-teal-400" : "text-slate-400"
              }`}
            />
            <span className="text-xs font-semibold">Patient</span>
          </button>

          <button
            type="button"
            onClick={() => setRole("doctor")}
            className={`flex flex-col items-center justify-center rounded-xl border p-3 text-center transition-all cursor-pointer ${
              role === "doctor"
                ? "border-indigo-500 bg-indigo-500/10 text-white"
                : "border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700 hover:text-slate-200"
            }`}
          >
            <Stethoscope
              className={`h-5 w-5 mb-1.5 ${
                role === "doctor" ? "text-indigo-400" : "text-slate-400"
              }`}
            />
            <span className="text-xs font-semibold">Doctor</span>
          </button>

          <button
            type="button"
            onClick={() => setRole("hospital")}
            className={`flex flex-col items-center justify-center rounded-xl border p-3 text-center transition-all cursor-pointer ${
              role === "hospital"
                ? "border-emerald-500 bg-emerald-500/10 text-white"
                : "border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700 hover:text-slate-200"
            }`}
          >
            <Building2
              className={`h-5 w-5 mb-1.5 ${
                role === "hospital" ? "text-emerald-400" : "text-slate-400"
              }`}
            />
            <span className="text-xs font-semibold">Hospital</span>
          </button>
        </div>

        {role !== "patient" && (
          <p className="text-[11px] text-amber-400/90 bg-amber-500/10 border border-amber-500/20 rounded-lg p-2.5">
            Note: Provider accounts ({role}) require administrative review
            before accessing clinical patient data.
          </p>
        )}
      </div>

      <div>
        <Input
          label={
            role === "hospital" ? "Hospital / Facility Name" : "Full Legal Name"
          }
          placeholder={
            role === "hospital"
              ? "St. Jude Memorial Hospital"
              : role === "doctor"
              ? "Dr. Marcus Vance, MD"
              : "Jane Doe"
          }
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          error={formErrors.fullName}
          disabled={loading}
          required
        />
      </div>

      <div>
        <Input
          label="Email Address"
          type="email"
          placeholder="user@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={formErrors.email}
          disabled={loading}
          required
        />
      </div>

      <div className="space-y-1.5">
        <label
          htmlFor="reg-password"
          className="block text-xs font-semibold uppercase tracking-wider text-slate-300"
        >
          Password
        </label>
        <div className="relative">
          <input
            id="reg-password"
            type={showPassword ? "text" : "password"}
            placeholder="At least 8 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            required
            className={`w-full rounded-lg border bg-slate-900/90 px-3.5 py-2.5 pr-10 text-sm text-slate-100 placeholder:text-slate-500 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 ${
              formErrors.password
                ? "border-rose-500"
                : "border-slate-700/80 hover:border-slate-600"
            }`}
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
        {formErrors.password && (
          <p className="text-xs font-medium text-rose-400">
            {formErrors.password}
          </p>
        )}
      </div>

      <div>
        <Input
          label="Confirm Password"
          type="password"
          placeholder="Repeat your password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          error={formErrors.confirmPassword}
          disabled={loading}
          required
        />
      </div>

      <Button
        type="submit"
        variant="primary"
        className="w-full mt-2"
        isLoading={loading}
      >
        <span>Complete Registration</span>
        <ArrowRight className="h-4 w-4 ml-1" />
      </Button>

      <div className="text-center pt-2">
        <p className="text-xs text-slate-400">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-teal-400 hover:text-teal-300 transition underline underline-offset-4"
          >
            Sign in
          </Link>
        </p>
      </div>
    </form>
  );
}
