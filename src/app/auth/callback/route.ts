import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Fetch user profile to route directly to their specific dashboard
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role, account_status")
          .eq("id", user.id)
          .single();

        if (profile?.account_status === "pending") {
          return NextResponse.redirect(`${origin}/pending`);
        }
        if (profile?.account_status === "suspended") {
          return NextResponse.redirect(`${origin}/suspended`);
        }
        if (profile?.role) {
          return NextResponse.redirect(`${origin}/${profile.role}`);
        }

        // Fallback using user metadata if profile record is still provisioning
        const metaRole = (user.user_metadata?.role as string) || "patient";
        if (metaRole === "doctor" || metaRole === "hospital") {
          return NextResponse.redirect(`${origin}/pending`);
        }
        return NextResponse.redirect(`${origin}/patient`);
      }

      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(
    `${origin}/login?error=Email%20verification%20failed%20or%20link%20expired`
  );
}

