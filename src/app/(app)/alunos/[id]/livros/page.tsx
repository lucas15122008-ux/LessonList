import { createBook, createSubject, deleteBook, deleteSubject, setBookStatus } from "@/app/actions/data";
import { ConfirmButton } from "@/components/confirm-button";
import { SubmitButton } from "@/components/submit-button";
import { getBooks, getSubjects } from "@/lib/data";
import { BOOK_STATUS, formatDate } from "@/lib/labels";

export default async function BooksPage({ params }: PageProps<"/alunos/[id]/livros">) {
  const { id } = await params;
  const [subjects, books] = await Promise.all([getSubjects(id), getBooks(id)]);
  const subjectById = new Map(subjects.map((s) => [s.id, s]));

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_2fr]">
      <section className="card h-fit">
        <h2 className="mb-3 font-display text-lg font-semibold">Matérias</h2>
        {subjects.length === 0 ? (
          <p className="mb-3 text-sm text-stone-500">Nenhuma matéria ainda.</p>
        ) : (
          <ul className="mb-4 flex flex-wrap gap-2">
            {subjects.map((s) => (
              <li
                key={s.id}
                className="flex items-center gap-1 rounded-full py-0.5 pl-3 pr-1 text-sm font-bold text-white"
                style={{ background: s.color }}
              >
                {s.name}
                <form action={deleteSubject}>
                  <input type="hidden" name="id" value={s.id} />
                  <input type="hidden" name="student_id" value={id} />
                  <ConfirmButton
                    className="rounded-full px-1.5 text-white/80 hover:bg-white/20 hover:text-white"
                    message={`Remover a matéria "${s.name}"? Livros, notas e atividades dela continuam salvos.`}
                  >
                    ×
                  </ConfirmButton>
                </form>
              </li>
            ))}
          </ul>
        )}
        <form action={createSubject} className="flex gap-2">
          <input type="hidden" name="student_id" value={id} />
          <input className="input" name="name" required maxLength={80} placeholder="Ex.: Matemática" aria-label="Nova matéria" />
          <SubmitButton>Adicionar</SubmitButton>
        </form>
      </section>

      <div className="space-y-6">
        <section className="card">
          <h2 className="mb-3 font-display text-lg font-semibold">Adicionar livro</h2>
          <form action={createBook} className="grid gap-3 sm:grid-cols-2">
            <input type="hidden" name="student_id" value={id} />
            <div className="sm:col-span-2">
              <label className="label" htmlFor="title">
                Título
              </label>
              <input className="input" id="title" name="title" required maxLength={200} />
            </div>
            <div>
              <label className="label" htmlFor="author">
                Autor <span className="font-normal text-stone-500">(opcional)</span>
              </label>
              <input className="input" id="author" name="author" />
            </div>
            <div>
              <label className="label" htmlFor="status">
                Situação
              </label>
              <select className="input" id="status" name="status" defaultValue="lendo">
                {BOOK_STATUS.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
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
            <div className="sm:col-span-2">
              <SubmitButton>Adicionar livro</SubmitButton>
            </div>
          </form>
        </section>

        {BOOK_STATUS.map((status) => {
          const list = books.filter((b) => b.status === status.value);
          if (list.length === 0) return null;
          return (
            <section key={status.value}>
              <h2 className="mb-2 font-display font-semibold">
                {status.label} <span className="font-sans text-sm font-normal text-stone-500">{list.length}</span>
              </h2>
              <ul className="space-y-2">
                {list.map((b) => {
                  const subject = b.subject_id ? subjectById.get(b.subject_id) : undefined;
                  return (
                    <li key={b.id} className="card flex flex-wrap items-center justify-between gap-3 py-3">
                      <div>
                        <p className="font-display font-semibold">{b.title}</p>
                        <p className="text-sm text-stone-500">
                          {[b.author, b.finished_on && `lido em ${formatDate(b.finished_on)}`].filter(Boolean).join(" · ")}
                        </p>
                        {subject && (
                          <span className="chip mt-1 text-white" style={{ background: subject.color }}>
                            {subject.name}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        {BOOK_STATUS.filter((s) => s.value !== b.status).map((s) => (
                          <form key={s.value} action={setBookStatus}>
                            <input type="hidden" name="id" value={b.id} />
                            <input type="hidden" name="student_id" value={id} />
                            <input type="hidden" name="status" value={s.value} />
                            <button className="btn-ghost px-2.5 py-1 text-xs">{s.value === "lido" ? "Terminei" : s.label}</button>
                          </form>
                        ))}
                        <form action={deleteBook}>
                          <input type="hidden" name="id" value={b.id} />
                          <input type="hidden" name="student_id" value={id} />
                          <ConfirmButton message={`Apagar o livro "${b.title}"?`}>Apagar</ConfirmButton>
                        </form>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </section>
          );
        })}
      </div>
    </div>
  );
}
