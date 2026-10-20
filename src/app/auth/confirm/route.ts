import type { EmailOtpType } from "@supabase/supabase-js";
import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Link do e-mail de confirmação de cadastro.
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const code = searchParams.get("code");
  const supabase = await createClient();

  let error: { message: string } | null = { message: "link sem token" };
  if (tokenHash && type) {
    ({ error } = await supabase.auth.verifyOtp({ type, token_hash: tokenHash }));
  } else if (code) {
    ({ error } = await supabase.auth.exchangeCodeForSession(code));
  }
  const ok = !error;
  if (error) console.error("[auth:confirm]", error.message);

  const target = request.nextUrl.clone();
  target.search = "";
  target.pathname = ok ? "/painel" : "/entrar";
  if (!ok) target.searchParams.set("erro", "link");
  return NextResponse.redirect(target);
}
