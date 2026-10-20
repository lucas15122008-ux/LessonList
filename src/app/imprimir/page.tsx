import type { Metadata } from "next";
import Link from "next/link";
import { getSchedule, getStudents, getSubjects } from "@/lib/data";
import { WEEKDAYS, formatTime } from "@/lib/labels";
import { PrintButton } from "./print-button";

export const metadata: Metadata = { title: "Cronograma semanal · LessonList" };

// Folha A4 deitada com a semana de cada aluno. Sem ?aluno= imprime todos, um por página.
export default async function PrintPage({ searchParams }: PageProps<"/imprimir">) {
  const { aluno } = await searchParams;
  const all = await getStudents();
  const students = aluno ? all.filter((s) => s.id === aluno) : all;
  const items = await getSchedule(students.map((s) => s.id));
  const subjectsByStudent = new Map(await Promise.all(students.map(async (s) => [s.id, await getSubjects(s.id)] as const)));
  const back = aluno ? `/alunos/${aluno}` : "/painel";

  return (
    <div className="print-sheet mx-auto w-full max-w-6xl px-4 py-6 print:p-0">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 print:hidden">
        <Link href={back} className="btn-ghost">
          ← Voltar
        </Link>
        <p className="text-sm text-stone-600">Dica: escolha &quot;Paisagem&quot; nas opções de impressão.</p>
        <PrintButton />
      </div>

      {students.length === 0 && <p className="card">Nenhum aluno cadastrado ainda.</p>}

      {students.map((s, idx) => {
        const mine = items.filter((i) => i.student_id === s.id);
        const hasWeekend = mine.some((i) => i.weekday === 0 || i.weekday === 6);
        const days = WEEKDAYS.filter((d) => hasWeekend || (d.value !== 0 && d.value !== 6));
        const color = new Map((subjectsByStudent.get(s.id) ?? []).map((sub) => [sub.id, sub.color]));
        return (
          <section key={s.id} className={`mb-10 print:mb-0 ${idx > 0 ? "print:break-before-page" : ""}`}>
            <header className="mb-3 flex items-end justify-between border-b-2 pb-2" style={{ borderColor: s.color }}>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-stone-500">Cronograma semanal</p>
                <h1 className="text-2xl font-extrabold">
                  {s.name}
                  {s.grade && <span className="ml-2 text-base font-semibold text-stone-500">{s.grade}</span>}
                </h1>
              </div>
              <p className="text-sm text-stone-500">Semana de ____/____ a ____/____</p>
            </header>

            <table className="w-full table-fixed border-collapse text-sm">
              <thead>
                <tr>
                  {days.map((d) => (
                    <th key={d.value} className="border border-stone-300 bg-stone-100 px-2 py-1.5 text-left font-extrabold">
                      {d.long}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  {days.map((d) => {
                    const dayItems = mine.filter((i) => i.weekday === d.value);
                    return (
                      <td key={d.value} className="h-96 border border-stone-300 p-1.5 align-top print:h-[150mm]">
                        <ul className="space-y-1.5">
                          {dayItems.map((i) => (
                            <li
                              key={i.id}
                              className="break-inside-avoid border-l-4 pl-1.5"
                              style={{ borderColor: (i.subject_id && color.get(i.subject_id)) || s.color }}
                            >
                              <div className="flex items-start gap-1">
                                <span className="mt-0.5 inline-block h-3 w-3 shrink-0 rounded-sm border border-stone-400" aria-hidden />
                                <div>
                                  <div className="text-[11px] text-stone-500">
                                    {formatTime(i.start_time)}–{formatTime(i.end_time)}
                                  </div>
                                  <div className="font-bold leading-tight">{i.title}</div>
                                  {i.notes && <div className="text-[11px] leading-tight text-stone-600">{i.notes}</div>}
                                </div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </td>
                    );
                  })}
                </tr>
              </tbody>
            </table>

            <footer className="mt-2 flex justify-between text-[10px] text-stone-400">
              <span>LessonList</span>
              <span>By Pegasus</span>
            </footer>
          </section>
        );
      })}
    </div>
  );
}
