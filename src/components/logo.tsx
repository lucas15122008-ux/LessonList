import Link from "next/link";

export function Logo({ href = "/" }: { href?: string }) {
  return (
    <Link href={href} className="flex items-center gap-2 text-lg font-extrabold tracking-tight text-brand-700">
      <span className="grid h-8 w-8 place-items-center rounded-xl bg-brand-600 text-white" aria-hidden>
        ✓
      </span>
      LessonList
    </Link>
  );
}
