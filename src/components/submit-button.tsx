"use client";

import type { ReactNode } from "react";
import { useFormStatus } from "react-dom";

export function SubmitButton({ children, className = "btn" }: { children: ReactNode; className?: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className={className} disabled={pending}>
      {pending ? "Salvando…" : children}
    </button>
  );
}
