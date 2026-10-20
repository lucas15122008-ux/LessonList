import Link from "next/link";
import { copySchedule, createScheduleItem, deleteScheduleItem, updateScheduleItem } from "@/app/actions/data";
import { ConfirmButton } from "@/components/confirm-button";
import { SubmitButton } from "@/components/submit-button";
import { getSchedule, getStudent, getStudents, getSubjects } from "@/lib/data";
import { WEEKDAYS, formatTime, todayInBrazil } from "@/lib/labels";
import type { ScheduleItem, Subject } from "@/lib/types";

export default async function SchedulePage({ params, searchParams }: PageProps<"/alunos/[id]">) {
  const { id } = await params;
  const { editar } = await searchParams;
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
  const editing = items.find((i) => i.id === editar);
  const base = `/alunos/${id}`;

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Link href={`/imprimir?aluno=${id}`} className="btn-ghost" target="_blank">
          🖨️ Imprimir cronograma
        </Link>
      </div>

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
                      className={`rounded-xl border-l-4 px-2.5 py-1.5 ${i.id === editing?.id ? "bg-brand-50 ring-2 ring-brand-500" : "bg-stone-50"}`}
                      style={{ borderColor: (i.subject_id && subjectColor.get(i.subject_id)) || student.color }}
                    >
                      <div className="font-mono text-xs text-stone-500">
                        {formatTime(i.start_time)}–{formatTime(i.end_time)}
                      </div>
                      <div className="text-sm font-bold">{i.title}</div>
                      {i.notes && <p className="text-xs text-stone-500">{i.notes}</p>}
                      <div className="mt-1 flex justify-end gap-1">
                        <Link
                          href={`${base}?editar=${i.id}#editar`}
                          scroll={false}
                          className="rounded-lg px-2 py-1 text-xs font-semibold text-brand-700 hover:bg-brand-100"
                          aria-label={`Editar ${i.title} de ${d.long.toLowerCase()}`}
                        >
                          ✎ Editar
                        </Link>
                        <form action={deleteScheduleItem}>
                          <input type="hidden" name="id" value={i.id} />
                          <ConfirmButton message={`Remover "${i.title}" de ${d.long.toLowerCase()}?`}>Remover</ConfirmButton>
                        </form>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          );
        })}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {editing ? (
          <EditForm key={editing.id} item={editing} subjects={subjects} cancelHref={base} />
        ) : (
          <AddForm studentId={id} subjects={subjects} />
        )}

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

function SubjectSelect({ subjects, defaultValue = "" }: { subjects: Subject[]; defaultValue?: string }) {
  if (subjects.length === 0) return null;
  return (
    <div>
      <label className="label" htmlFor="subject_id">
        Matéria
      </label>
      <select className="input" id="subject_id" name="subject_id" defaultValue={defaultValue}>
        <option value="">Nenhuma</option>
        {subjects.map((s) => (
          <option key={s.id} value={s.id}>
            {s.name}
          </option>
        ))}
      </select>
    </div>
  );
}

function TimeAndNotes({ item }: { item?: ScheduleItem }) {
  return (
    <>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="label" htmlFor="start_time">
            Início
          </label>
          <input
            className="input"
            id="start_time"
            name="start_time"
            type="time"
            required
            defaultValue={item ? formatTime(item.start_time) : "08:00"}
          />
        </div>
        <div>
          <label className="label" htmlFor="end_time">
            Fim
          </label>
          <input
            className="input"
            id="end_time"
            name="end_time"
            type="time"
            required
            defaultValue={item ? formatTime(item.end_time) : "09:00"}
          />
        </div>
      </div>
      <div>
        <label className="label" htmlFor="notes">
          Observação <span className="font-normal text-stone-500">(opcional)</span>
        </label>
        <input className="input" id="notes" name="notes" placeholder="Ex.: capítulo 3 do livro" defaultValue={item?.notes ?? ""} />
      </div>
    </>
  );
}

function AddForm({ studentId, subjects }: { studentId: string; subjects: Subject[] }) {
  return (
    <section className="card">
      <h2 className="mb-3 text-lg font-bold">Adicionar atividade</h2>
      <form action={createScheduleItem} className="space-y-3">
        <input type="hidden" name="student_id" value={studentId} />
        <SubjectSelect subjects={subjects} />
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
        <TimeAndNotes />
        <SubmitButton>Adicionar ao cronograma</SubmitButton>
      </form>
    </section>
  );
}

function EditForm({ item, subjects, cancelHref }: { item: ScheduleItem; subjects: Subject[]; cancelHref: string }) {
  return (
    <section id="editar" className="card scroll-mt-32 border-brand-500 ring-2 ring-brand-100">
      <h2 className="mb-3 text-lg font-bold">Editar atividade</h2>
      <form action={updateScheduleItem} className="space-y-3">
        <input type="hidden" name="id" value={item.id} />
        <input type="hidden" name="student_id" value={item.student_id} />
        <SubjectSelect subjects={subjects} defaultValue={item.subject_id ?? ""} />
        <div>
          <label className="label" htmlFor="title">
            Atividade
          </label>
          <input className="input" id="title" name="title" maxLength={120} required defaultValue={item.title} />
        </div>
        <fieldset>
          <legend className="label">Dia</legend>
          <div className="flex flex-wrap gap-2">
            {WEEKDAYS.map((d) => (
              <label key={d.value} className="cursor-pointer">
                <input
                  type="radio"
                  name="weekday"
                  value={d.value}
                  defaultChecked={d.value === item.weekday}
                  className="peer sr-only"
                />
                <span className="inline-block rounded-lg border border-stone-300 px-2.5 py-1 text-sm font-semibold peer-checked:border-brand-600 peer-checked:bg-brand-600 peer-checked:text-white peer-focus-visible:ring-2 peer-focus-visible:ring-brand-500">
                  {d.short}
                </span>
              </label>
            ))}
          </div>
        </fieldset>
        <TimeAndNotes item={item} />
        <div className="flex gap-2">
          <SubmitButton>Salvar alterações</SubmitButton>
          <Link href={cancelHref} scroll={false} className="btn-ghost">
            Cancelar
          </Link>
        </div>
      </form>
    </section>
  );
}
