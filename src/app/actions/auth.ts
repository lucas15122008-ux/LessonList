"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";

// email volta no estado para o formulário não apagar o que foi digitado depois de um erro.
export type AuthState = { error?: string; message?: string; email?: string };

function translate(message: string) {
  if (/invalid login credentials/i.test(message)) return "E-mail ou senha incorretos.";
  if (/email not confirmed/i.test(message)) return "Confirme seu e-mail antes de entrar. Procure a mensagem na sua caixa de entrada.";
  if (/already registered/i.test(message)) return "Já existe uma conta com esse e-mail. Tente entrar.";
  if (/password/i.test(message)) return "A senha precisa ter pelo menos 6 caracteres.";
  return "Algo deu errado. Tente de novo em instantes.";
}

export async function signIn(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const supabase = await createClient();
  const email = String(formData.get("email") ?? "").trim();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password: String(formData.get("password") ?? ""),
  });
  if (error) return { error: translate(error.message), email };
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
  if (error) return { error: translate(error.message), email };
  // Com confirmação de e-mail ligada no Supabase não vem sessão: avisamos para checar a caixa de entrada.
  if (!data.session) return { message: "Conta criada! Enviamos um e-mail de confirmação. Clique no link para entrar." };
  redirect("/painel");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/entrar");
}
