import Link from "next/link";
import { createStudent } from "@/app/actions/data";
import { SubmitButton } from "@/components/submit-button";
import { getSchedule, getStudents } from "@/lib/data";
import { WEEKDAYS, formatTime, todayInBrazil } from "@/lib/labels";

export default async function DashboardPage() {
  const students = await getStudents();
  const { weekday } = todayInBrazil();
  const today = (await getSchedule(students.map((s) => s.id))).filter((i) => i.weekday === weekday);
  const dayName = WEEKDAYS.find((d) => d.value === weekday)!.long;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold">Hoje é {dayName.toLowerCase()}</h1>
        <p className="text-stone-600">
          {students.length === 0 ? "Comece cadastrando seus filhos." : "Veja o que cada um tem para hoje."}
        </p>
      </div>

      {students.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2">
          {students.map((s) => {
            const items = today.filter((i) => i.student_id === s.id);
            return (
              <section key={s.id} className="card">
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="flex items-center gap-2 text-lg font-bold">
                    <span className="h-3 w-3 rounded-full" style={{ background: s.color }} aria-hidden />
                    {s.name}
                    {s.grade && <span className="text-sm font-semibold text-stone-500">· {s.grade}</span>}
                  </h2>
                  <Link href={`/alunos/${s.id}`} className="text-sm font-bold text-brand-600">
                    Abrir →
                  </Link>
                </div>
                {items.length === 0 ? (
                  <p className="text-sm text-stone-500">
                    Nada no cronograma para hoje.{" "}
                    <Link href={`/alunos/${s.id}`} className="font-semibold text-brand-600">
                      Montar cronograma
                    </Link>
                  </p>
                ) : (
                  <ul className="space-y-2">
                    {items.map((i) => (
                      <li key={i.id} className="flex items-baseline gap-3 rounded-xl bg-stone-50 px-3 py-2">
                        <span className="w-24 shrink-0 font-mono text-sm text-stone-500">
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
        <h2 className="mb-3 text-lg font-bold">{students.length === 0 ? "Cadastrar primeiro filho" : "Adicionar filho"}</h2>
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
