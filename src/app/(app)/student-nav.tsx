"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Student } from "@/lib/types";

// Troca rápida entre "Hoje" e cada filho, marcando onde a família está.
export function StudentNav({ students }: { students: Student[] }) {
  const pathname = usePathname();
  const links = [
    { href: "/painel", label: "Hoje", color: undefined, active: pathname === "/painel" },
    ...students.map((s) => ({
      href: `/alunos/${s.id}`,
      label: s.name,
      color: s.color,
      active: pathname.startsWith(`/alunos/${s.id}`),
    })),
  ];

  return (
    <nav className="mx-auto flex w-full max-w-5xl gap-1 overflow-x-auto px-4" aria-label="Filhos">
      {links.map((l) => (
        <Link
          key={l.href}
          href={l.href}
          aria-current={l.active ? "page" : undefined}
          className={`flex shrink-0 items-center gap-1.5 border-b-2 px-2.5 py-2 text-sm font-bold ${
            l.active ? "border-brand-600 text-ink" : "border-transparent text-stone-500 hover:text-ink"
          }`}
        >
          {l.color && <span className="h-2.5 w-2.5 rounded-full" style={{ background: l.color }} aria-hidden />}
          {l.label}
        </Link>
      ))}
    </nav>
  );
}
