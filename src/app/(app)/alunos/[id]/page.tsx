import { copySchedule, createScheduleItem, deleteScheduleItem } from "@/app/actions/data";
import { ConfirmButton } from "@/components/confirm-button";
import { SubmitButton } from "@/components/submit-button";
import { getSchedule, getStudent, getStudents, getSubjects } from "@/lib/data";
import { WEEKDAYS, formatTime, todayInBrazil } from "@/lib/labels";

export default async function SchedulePage({ params }: PageProps<"/alunos/[id]">) {
  const { id } = await params;
  const [student, students, subjects, items] = await Promise.all([
    getStudent(id),
    getStudents(),
    getSubjects(id),
    getSchedule([id]),
  ]);
  const others = students.filter((s) => s.id !== id);
  const subjectColor = new Map(subjects.map((s) => [s.id, s.color]));
  const { weekday: today } = todayInBrazil();
  const hasWeekend = items.some((i) => i.weekday === 0 || i.weekday === 6);
  const days = WEEKDAYS.filter((d) => hasWeekend || (d.value !== 0 && d.value !== 6));

  return (
    <div className="space-y-6">
      <div className={`grid gap-3 ${hasWeekend ? "lg:grid-cols-7" : "lg:grid-cols-5"} sm:grid-cols-2`}>
        {days.map((d) => {
          const dayItems = items.filter((i) => i.weekday === d.value);
          return (
            <section
              key={d.value}
              className={`rounded-2xl border bg-white p-3 ${d.value === today ? "border-brand-500 ring-2 ring-brand-100" : "border-stone-200"}`}
            >
              <h2 className="mb-2 flex items-center justify-between text-sm font-extrabold uppercase tracking-wide text-stone-500">
                {d.long}
                {d.value === today && <span className="chip bg-brand-100 normal-case text-brand-700">hoje</span>}
              </h2>
              {dayItems.length === 0 ? (
                <p className="text-sm text-stone-400">Livre</p>
              ) : (
                <ul className="space-y-2">
                  {dayItems.map((i) => (
                    <li
                      key={i.id}
                      className="group rounded-xl border-l-4 bg-stone-50 px-2.5 py-1.5"
                      style={{ borderColor: (i.subject_id && subjectColor.get(i.subject_id)) || student.color }}
                    >
                      <div className="font-mono text-xs text-stone-500">
                        {formatTime(i.start_time)}–{formatTime(i.end_time)}
                      </div>
                      <div className="flex items-start justify-between gap-1">
                        <span className="text-sm font-bold">{i.title}</span>
                        <form action={deleteScheduleItem}>
                          <input type="hidden" name="id" value={i.id} />
                          <ConfirmButton message={`Remover "${i.title}" de ${d.long.toLowerCase()}?`}>×</ConfirmButton>
                        </form>
                      </div>
                      {i.notes && <p className="text-xs text-stone-500">{i.notes}</p>}
                    </li>
                  ))}
                </ul>
              )}
            </section>
          );
        })}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <section className="card">
          <h2 className="mb-3 text-lg font-bold">Adicionar atividade</h2>
          <form action={createScheduleItem} className="space-y-3">
            <input type="hidden" name="student_id" value={id} />
            {subjects.length > 0 && (
              <div>
                <label className="label" htmlFor="subject_id">
                  Matéria
                </label>
                <select className="input" id="subject_id" name="subject_id" defaultValue="">
                  <option value="">Nenhuma</option>
                  {subjects.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <div>
              <label className="label" htmlFor="title">
                Atividade{" "}
                {subjects.length > 0 && <span className="font-normal text-stone-500">(se vazio, usa o nome da matéria)</span>}
              </label>
              <input
                className="input"
                id="title"
                name="title"
                maxLength={120}
                required={subjects.length === 0}
                placeholder="Ex.: Matemática, Leitura, Educação física"
              />
            </div>
            <fieldset>
              <legend className="label">Dias</legend>
              <div className="flex flex-wrap gap-2">
                {WEEKDAYS.map((d) => (
                  <label key={d.value} className="cursor-pointer">
                    <input type="checkbox" name="weekday" value={d.value} className="peer sr-only" />
                    <span className="inline-block rounded-lg border border-stone-300 px-2.5 py-1 text-sm font-semibold peer-checked:border-brand-600 peer-checked:bg-brand-600 peer-checked:text-white peer-focus-visible:ring-2 peer-focus-visible:ring-brand-500">
                      {d.short}
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label" htmlFor="start_time">
                  Início
                </label>
                <input className="input" id="start_time" name="start_time" type="time" required defaultValue="08:00" />
              </div>
              <div>
                <label className="label" htmlFor="end_time">
                  Fim
                </label>
                <input className="input" id="end_time" name="end_time" type="time" required defaultValue="09:00" />
              </div>
            </div>
            <div>
              <label className="label" htmlFor="notes">
                Observação <span className="font-normal text-stone-500">(opcional)</span>
              </label>
              <input className="input" id="notes" name="notes" placeholder="Ex.: capítulo 3 do livro" />
            </div>
            <SubmitButton>Adicionar ao cronograma</SubmitButton>
          </form>
        </section>

        {others.length > 0 && (
          <section className="card h-fit">
            <h2 className="mb-1 text-lg font-bold">Usar cronograma de outro filho</h2>
            <p className="mb-3 text-sm text-stone-600">
              Copia a semana inteira como modelo e depois você ajusta. O cronograma atual de {student.name} será substituído.
            </p>
            <form action={copySchedule} className="flex flex-wrap gap-2">
              <input type="hidden" name="student_id" value={id} />
              <select className="input flex-1" name="from_student_id" aria-label="Copiar de">
                {others.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
              <ConfirmButton className="btn-ghost" message={`Substituir o cronograma de ${student.name}?`}>
                Copiar
              </ConfirmButton>
            </form>
          </section>
        )}
      </div>
    </div>
  );
}
