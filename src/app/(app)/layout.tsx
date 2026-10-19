import Link from "next/link";
import { Logo } from "@/components/logo";
import { signOut } from "@/app/actions/auth";
import { getStudents } from "@/lib/data";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const students = await getStudents();

  return (
    <div className="flex flex-1 flex-col">
      <header className="sticky top-0 z-10 border-b border-stone-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-3 px-4 py-3">
          <Logo href="/painel" />
          <nav className="flex items-center gap-1 text-sm font-semibold">
            <Link href="/sugestao" className="rounded-lg px-2.5 py-1.5 text-brand-700 hover:bg-brand-50">
              💬 <span className="hidden sm:inline">Enviar sugestão</span>
              <span className="sm:hidden">Sugestão</span>
            </Link>
            <form action={signOut}>
              <button className="rounded-lg px-2.5 py-1.5 text-stone-600 hover:bg-stone-100">Sair</button>
            </form>
          </nav>
        </div>
        {students.length > 0 && (
          <div className="mx-auto flex w-full max-w-5xl gap-2 overflow-x-auto px-4 pb-3">
            <Link href="/painel" className="btn-ghost shrink-0 py-1.5">
              🏠 Hoje
            </Link>
            {students.map((s) => (
              <Link key={s.id} href={`/alunos/${s.id}`} className="btn-ghost shrink-0 py-1.5">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: s.color }} aria-hidden />
                {s.name}
              </Link>
            ))}
          </div>
        )}
      </header>
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-6">{children}</main>
    </div>
  );
}
