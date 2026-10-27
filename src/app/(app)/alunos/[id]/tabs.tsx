"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function StudentTabs({ studentId }: { studentId: string }) {
  const pathname = usePathname();
  const base = `/alunos/${studentId}`;
  const tabs = [
    { href: base, label: "Cronograma" },
    { href: `${base}/livros`, label: "Matérias e livros" },
    { href: `${base}/historico`, label: "Histórico" },
    { href: `${base}/perfil`, label: "Perfil" },
  ];
  return (
    <nav className="flex gap-1 overflow-x-auto border-b border-stone-300/80">
      {tabs.map((t) => {
        const active = pathname === t.href;
        return (
          <Link
            key={t.href}
            href={t.href}
            aria-current={active ? "page" : undefined}
            className={`-mb-px shrink-0 border-b-2 px-3 py-2 text-sm font-bold ${
              active ? "border-brand-600 text-brand-700" : "border-transparent text-stone-500 hover:text-ink"
            }`}
          >
            {t.label}
          </Link>
        );
      })}
    </nav>
  );
}
