import Link from "next/link";
import { Logo } from "@/components/logo";
import { signOut } from "@/app/actions/auth";
import { getStudents } from "@/lib/data";
import { StudentNav } from "./student-nav";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const students = await getStudents();

  return (
    <div className="flex flex-1 flex-col">
      <header className="sticky top-0 z-10 border-b border-stone-300/80 bg-paper">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-3 px-4 pt-3 pb-2">
          <Logo href="/painel" />
          <nav className="flex items-center gap-1 text-sm font-semibold">
            <Link href="/sugestao" className="rounded-md px-2.5 py-1.5 text-brand-700 hover:bg-brand-50">
              <span className="hidden sm:inline">Enviar sugestão</span>
              <span className="sm:hidden">Sugestão</span>
            </Link>
            <form action={signOut}>
              <button className="rounded-md px-2.5 py-1.5 text-stone-600 hover:bg-stone-200/60">Sair</button>
            </form>
          </nav>
        </div>
        {students.length > 0 && <StudentNav students={students} />}
      </header>
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-6 sm:py-8">{children}</main>
      <footer className="py-4 text-center text-xs text-stone-500">LessonList · By Pegasus</footer>
    </div>
  );
}
