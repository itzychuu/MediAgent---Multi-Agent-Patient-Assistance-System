import { redirectIfAuthenticated } from "@/lib/auth/authorization";
import LoginForm from "@/components/auth/LoginForm";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  await redirectIfAuthenticated();

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
          Welcome back
        </h1>
        <p className="text-sm text-slate-400">
          Enter your credentials to access your MediAgent portal.
        </p>
      </div>

      <LoginForm />
    </div>
  );
}
