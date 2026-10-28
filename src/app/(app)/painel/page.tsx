import Link from "next/link";
import { createStudent } from "@/app/actions/data";
import { SubmitButton } from "@/components/submit-button";
import { getSchedule, getStudents } from "@/lib/data";
import { WEEKDAYS, formatDate, formatTime, todayInBrazil } from "@/lib/labels";

export default async function DashboardPage() {
  const students = await getStudents();
  const { weekday, iso } = todayInBrazil();
  const today = (await getSchedule(students.map((s) => s.id))).filter((i) => i.weekday === weekday);
  const dayName = WEEKDAYS.find((d) => d.value === weekday)!.long;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="page-title">
            Hoje é <span className="marker">{dayName.toLowerCase()}</span>
          </h1>
          <p className="mt-1 text-stone-600">
            <span className="tabular-nums">{formatDate(iso).slice(0, 5)}</span> ·{" "}
            {students.length === 0 ? "Comece cadastrando seus filhos." : "Veja o que cada um tem para hoje."}
          </p>
        </div>
        {students.length > 0 && (
          <Link href="/imprimir" className="btn-ghost" target="_blank">
            Imprimir cronogramas
          </Link>
        )}
      </div>

      {students.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2">
          {students.map((s) => {
            const items = today.filter((i) => i.student_id === s.id);
            return (
              <section key={s.id} className="card">
                <div className="mb-2 flex items-center justify-between gap-3">
                  <h2 className="flex items-center gap-2 font-display text-lg font-semibold">
                    <span className="h-3 w-3 rounded-full" style={{ background: s.color }} aria-hidden />
                    {s.name}
                    {s.grade && <span className="font-sans text-sm font-normal text-stone-500">{s.grade}</span>}
                  </h2>
                  <Link href={`/alunos/${s.id}`} className="shrink-0 text-sm font-bold text-brand-700 hover:underline">
                    Ver semana
                  </Link>
                </div>
                {items.length === 0 ? (
                  <p className="text-sm text-stone-500">
                    Nada no cronograma para hoje.{" "}
                    <Link href={`/alunos/${s.id}`} className="font-semibold text-brand-700 underline underline-offset-2">
                      Montar cronograma
                    </Link>
                  </p>
                ) : (
                  <ul className="divide-y divide-dashed divide-stone-300">
                    {items.map((i) => (
                      <li key={i.id} className="flex items-baseline gap-3 py-2">
                        <span className="w-24 shrink-0 text-sm text-stone-500 tabular-nums">
                          {formatTime(i.start_time)}–{formatTime(i.end_time)}
                        </span>
                        <span className="font-semibold">{i.title}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            );
          })}
        </div>
      )}

      <section className="card max-w-md">
        <h2 className="mb-3 font-display text-lg font-semibold">{students.length === 0 ? "Cadastrar primeiro filho" : "Adicionar filho"}</h2>
        <form action={createStudent} className="space-y-3">
          <div>
            <label className="label" htmlFor="name">
              Nome
            </label>
            <input className="input" id="name" name="name" required maxLength={80} />
          </div>
          <div>
            <label className="label" htmlFor="grade">
              Série ou idade <span className="font-normal text-stone-500">(opcional)</span>
            </label>
            <input className="input" id="grade" name="grade" placeholder="Ex.: 6º ano, 12 anos" maxLength={40} />
          </div>
          <SubmitButton>Adicionar</SubmitButton>
        </form>
      </section>
    </div>
  );
}
