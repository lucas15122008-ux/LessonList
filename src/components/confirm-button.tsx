"use client";

import type { ReactNode } from "react";

// Botão de envio que pede confirmação antes de apagar algo.
export function ConfirmButton({
  message,
  children,
  className = "btn-danger",
}: {
  message: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <button
      type="submit"
      className={className}
      onClick={(e) => {
        if (!confirm(message)) e.preventDefault();
      }}
    >
      {children}
    </button>
  );
}
