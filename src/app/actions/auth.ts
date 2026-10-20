"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";

// email volta no estado para o formulário não apagar o que foi digitado depois de um erro.
export type AuthState = { error?: string; message?: string; email?: string };

type AuthError = { message: string; code?: string; status?: number };

// Traduz o erro do Supabase e registra o original nos logs da Vercel (Functions/Logs).
function translate(where: string, error: AuthError) {
  console.error(`[auth:${where}]`, error.status, error.code, error.message);
  const { code = "", message } = error;
  if (code === "invalid_credentials") return "E-mail ou senha incorretos.";
  if (code === "email_not_confirmed") return "Confirme seu e-mail antes de entrar. Procure a mensagem na sua caixa de entrada.";
  if (code === "user_already_exists" || code === "email_exists") return "Já existe uma conta com esse e-mail. Tente entrar.";
  if (code === "weak_password") return "A senha precisa ter pelo menos 6 caracteres.";
  if (code === "email_address_invalid") return "Esse e-mail não parece válido. Confira se digitou certo.";
  if (code === "over_email_send_rate_limit" || code === "over_request_rate_limit")
    return "Muitas tentativas seguidas. Espere alguns minutos e tente de novo.";
  if (code === "signup_disabled") return "O cadastro de novas contas está desligado no momento.";
  if (code === "email_address_not_authorized" || /sending confirmation email/i.test(message))
    return "Não conseguimos enviar o e-mail de confirmação. Avise o suporte do LessonList.";
  return `Algo deu errado (${message}). Tente de novo em instantes.`;
}

export async function signIn(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const supabase = await createClient();
  const email = String(formData.get("email") ?? "").trim();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password: String(formData.get("password") ?? ""),
  });
  if (error) return { error: translate("entrar", error), email };
  redirect("/painel");
}

export async function signUp(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const supabase = await createClient();
  const origin = (await headers()).get("origin") ?? "";
  const email = String(formData.get("email") ?? "").trim();
  const { data, error } = await supabase.auth.signUp({
    email,
    password: String(formData.get("password") ?? ""),
    options: {
      emailRedirectTo: `${origin}/auth/confirm`,
      data: { family_name: String(formData.get("family_name") ?? "").trim() },
    },
  });
  if (error) return { error: translate("cadastro", error), email };
  // Com confirmação de e-mail ligada no Supabase não vem sessão: avisamos para checar a caixa de entrada.
  if (!data.session) return { message: "Conta criada! Enviamos um e-mail de confirmação. Clique no link para entrar." };
  redirect("/painel");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/entrar");
}
