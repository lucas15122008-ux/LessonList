import Link from "next/link";

export function Logo({ href = "/" }: { href?: string }) {
  return (
    <Link href={href} className="flex items-center gap-1.5 font-display text-xl font-semibold tracking-tight text-ink">
      <svg viewBox="0 0 24 24" className="h-5 w-5 text-brand-600" fill="none" aria-hidden>
        <rect x="2.5" y="2.5" width="19" height="19" rx="3" stroke="currentColor" strokeWidth="2" />
        <path d="M7 12.5l3.2 3.2L17 8.5" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      LessonList
    </Link>
  );
}
