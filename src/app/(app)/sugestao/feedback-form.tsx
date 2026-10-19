"use client";

import { useActionState } from "react";
import { sendFeedback } from "@/app/actions/data";

export function FeedbackForm() {
  const [state, action, pending] = useActionState(sendFeedback, { sent: false });

  if (state.sent) {
    return (
      <div className="card text-center">
        <div className="text-4xl" aria-hidden>
          💜
        </div>
        <p className="mt-2 font-bold">Obrigado! Sua sugestão foi enviada.</p>
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
