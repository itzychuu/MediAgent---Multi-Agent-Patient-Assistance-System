import { redirectIfAuthenticated } from "@/lib/auth/authorization";
import RegisterForm from "@/components/auth/RegisterForm";

export const dynamic = "force-dynamic";

export default async function RegisterPage() {
  await redirectIfAuthenticated();

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
          Create an account
        </h1>
        <p className="text-sm text-slate-400">
          Join MediAgent as a patient, healthcare provider, or hospital facility.
        </p>
      </div>

      <RegisterForm />
    </div>
  );
}
