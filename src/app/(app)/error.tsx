"use client";

import { useEffect } from "react";

export default function AppError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="card mx-auto max-w-md">
      <h1 className="font-display text-lg font-semibold text-balance">Algo deu errado ao carregar esta página.</h1>
      <p className="mt-1 text-sm text-pretty text-stone-600">Tente de novo. Se continuar, use &quot;Enviar sugestão&quot; para nos avisar.</p>
      {error.digest && <p className="mt-2 font-mono text-xs text-stone-400">código {error.digest}</p>}
      <button className="btn mt-4" onClick={reset}>
        Tentar de novo
      </button>
    </div>
  );
}
