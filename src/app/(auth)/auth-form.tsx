"use client";

import Link from "next/link";
import { useActionState } from "react";
import { signIn, signUp, type AuthState } from "@/app/actions/auth";

export function AuthForm({ mode, notice }: { mode: "entrar" | "cadastro"; notice?: string }) {
  const isSignUp = mode === "cadastro";
  const [state, action, pending] = useActionState<AuthState, FormData>(isSignUp ? signUp : signIn, {});

  if (state.message) {
    return (
      <div>
        <p className="font-display text-lg font-semibold">Confira seu e-mail</p>
        <p className="mt-1 text-pretty text-stone-700">{state.message}</p>
      </div>
    );
  }

  return (
    <form action={action} className="space-y-4">
      <h1 className="font-display text-2xl font-semibold tracking-tight">{isSignUp ? "Criar conta da família" : "Entrar"}</h1>
      {notice && <p className="rounded-md bg-amber-50 p-3 text-sm text-amber-800">{notice}</p>}
      {isSignUp && (
        <div>
          <label className="label" htmlFor="family_name">
            Seu nome
          </label>
          <input className="input" id="family_name" name="family_name" autoComplete="name" />
        </div>
      )}
      <div>
        <label className="label" htmlFor="email">
          E-mail
        </label>
        <input className="input" id="email" name="email" type="email" required autoComplete="email" defaultValue={state.email} />
      </div>
      <div>
        <label className="label" htmlFor="password">
          Senha
        </label>
        <input
          className="input"
          id="password"
          name="password"
          type="password"
          required
          minLength={6}
          autoComplete={isSignUp ? "new-password" : "current-password"}
        />
      </div>
      {state.error && (
        <p className="rounded-md bg-red-50 p-3 text-sm text-red-700" role="alert">
          {state.error}
        </p>
      )}
      <button className="btn w-full py-2.5" disabled={pending}>
        {pending ? "Aguarde…" : isSignUp ? "Criar conta" : "Entrar"}
      </button>
      <p className="text-center text-sm text-stone-600">
        {isSignUp ? (
          <>
            Já tem conta?{" "}
            <Link href="/entrar" className="font-bold text-brand-700 underline-offset-2 hover:underline">
              Entrar
            </Link>
          </>
        ) : (
          <>
            Ainda não tem conta?{" "}
            <Link href="/cadastro" className="font-bold text-brand-700 underline-offset-2 hover:underline">
              Criar conta
            </Link>
          </>
        )}
      </p>
    </form>
  );
}
