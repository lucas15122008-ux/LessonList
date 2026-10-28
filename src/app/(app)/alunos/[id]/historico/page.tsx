import Link from "next/link";
import { createRecord, deleteRecord } from "@/app/actions/data";
import { ConfirmButton } from "@/components/confirm-button";
import { SubmitButton } from "@/components/submit-button";
import { getRecords, getSubjects } from "@/lib/data";
import { RECORD_KINDS, formatDate, todayInBrazil } from "@/lib/labels";

export default async function RecordsPage({ params, searchParams }: PageProps<"/alunos/[id]/historico">) {
  const { id } = await params;
  const { tipo } = await searchParams;
  const [subjects, records] = await Promise.all([getSubjects(id), getRecords(id)]);
  const subjectById = new Map(subjects.map((s) => [s.id, s]));
  const filter = RECORD_KINDS.find((k) => k.value === tipo)?.value;
  const shown = filter ? records.filter((r) => r.kind === filter) : records;
  const volunteerHours = records.filter((r) => r.kind === "voluntariado").reduce((sum, r) => sum + (r.hours ?? 0), 0);
  const base = `/alunos/${id}/historico`;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {RECORD_KINDS.map((k) => {
          const count = records.filter((r) => r.kind === k.value).length;
          return (
            <div key={k.value} className="card py-3">
              <p className="text-sm font-semibold text-stone-500">{k.plural}</p>
              <p className="font-display text-2xl font-semibold tabular-nums">
                {k.value === "voluntariado" ? `${volunteerHours.toLocaleString("pt-BR")} h` : count}
              </p>
            </div>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_2fr]">
        <section className="card h-fit">
          <h2 className="mb-3 font-display text-lg font-semibold">Registrar</h2>
          <form action={createRecord} className="space-y-3">
            <input type="hidden" name="student_id" value={id} />
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label" htmlFor="kind">
                  Tipo
                </label>
                <select className="input" id="kind" name="kind" defaultValue={filter ?? "nota"}>
                  {RECORD_KINDS.map((k) => (
                    <option key={k.value} value={k.value}>
                      {k.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label" htmlFor="record_date">
                  Data
                </label>
                <input className="input" id="record_date" name="record_date" type="date" defaultValue={todayInBrazil().iso} />
              </div>
            </div>
            <div>
              <label className="label" htmlFor="title">
                Título
              </label>
              <input className="input" id="title" name="title" required maxLength={200} placeholder="Ex.: Prova de frações" />
            </div>
            {subjects.length > 0 && (
              <div>
                <label className="label" htmlFor="subject_id">
                  Matéria <span className="font-normal text-stone-500">(opcional)</span>
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
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label" htmlFor="score">
                  Nota/conceito
                </label>
                <input className="input" id="score" name="score" maxLength={20} placeholder="Ex.: 9,5 ou A" />
              </div>
              <div>
                <label className="label" htmlFor="hours">
                  Horas
                </label>
                <input className="input" id="hours" name="hours" inputMode="decimal" pattern="[0-9]+([.,][0-9])?" placeholder="Ex.: 4" />
              </div>
            </div>
            <div>
              <label className="label" htmlFor="description">
                Descrição <span className="font-normal text-stone-500">(opcional)</span>
              </label>
              <textarea className="input min-h-20" id="description" name="description" />
            </div>
            <SubmitButton>Salvar no histórico</SubmitButton>
          </form>
        </section>

        <section className="space-y-3">
          <div className="flex flex-wrap gap-2">
            <Link href={base} className={`chip ${!filter ? "bg-brand-600 text-white" : "bg-stone-200 text-stone-700"}`}>
              Tudo
            </Link>
            {RECORD_KINDS.map((k) => (
              <Link
                key={k.value}
                href={`${base}?tipo=${k.value}`}
                className={`chip ${filter === k.value ? "bg-brand-600 text-white" : "bg-stone-200 text-stone-700"}`}
              >
                {k.plural}
              </Link>
            ))}
          </div>
          {shown.length === 0 ? (
            <p className="card text-sm text-stone-500">Nada registrado ainda.</p>
          ) : (
            <ul className="space-y-2">
              {shown.map((r) => {
                const subject = r.subject_id ? subjectById.get(r.subject_id) : undefined;
                const kind = RECORD_KINDS.find((k) => k.value === r.kind)!;
                return (
                  <li key={r.id} className="card flex items-start justify-between gap-3 py-3">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="chip bg-stone-100 text-stone-600">{kind.label}</span>
                        {subject && (
                          <span className="chip text-white" style={{ background: subject.color }}>
                            {subject.name}
                          </span>
                        )}
                        <span className="text-xs text-stone-500">{formatDate(r.record_date)}</span>
                      </div>
                      <p className="mt-1 font-display font-semibold">{r.title}</p>
                      {r.description && <p className="text-sm text-stone-600">{r.description}</p>}
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-1">
                      {r.score && <span className="font-display text-xl font-semibold text-brand-700 tabular-nums">{r.score}</span>}
                      {r.hours !== null && <span className="text-sm font-bold text-stone-600">{r.hours.toLocaleString("pt-BR")} h</span>}
                      <form action={deleteRecord}>
                        <input type="hidden" name="id" value={r.id} />
                        <input type="hidden" name="student_id" value={id} />
                        <ConfirmButton message={`Apagar "${r.title}" do histórico?`}>Apagar</ConfirmButton>
                      </form>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
