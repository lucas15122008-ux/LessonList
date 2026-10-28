"use client";

import { useActionState } from "react";
import { sendFeedback } from "@/app/actions/data";

export function FeedbackForm() {
  const [state, action, pending] = useActionState(sendFeedback, { sent: false });

  if (state.sent) {
    return (
      <div className="card">
        <p className="font-display text-lg font-semibold">Obrigado! Sua sugestão foi enviada.</p>
        <p className="mt-1 text-sm text-stone-600">A gente lê todas. Se tiver outra ideia, é só voltar aqui.</p>
      </div>
    );
  }

  return (
    <form action={action} className="card space-y-3">
      <label className="label" htmlFor="message">
        Sua sugestão
      </label>
      <textarea className="input min-h-40" id="message" name="message" required maxLength={4000} />
      <button className="btn" disabled={pending}>
        {pending ? "Enviando…" : "Enviar"}
      </button>
    </form>
  );
}
