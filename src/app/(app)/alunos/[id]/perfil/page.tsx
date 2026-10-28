import { deleteStudent, updateStudent } from "@/app/actions/data";
import { ConfirmButton } from "@/components/confirm-button";
import { SubmitButton } from "@/components/submit-button";
import { getStudent } from "@/lib/data";
import { COLORS } from "@/lib/labels";

export default async function ProfilePage({ params }: PageProps<"/alunos/[id]/perfil">) {
  const { id } = await params;
  const student = await getStudent(id);

  return (
    <div className="max-w-md space-y-6">
      <section className="card">
        <h2 className="mb-3 font-display text-lg font-semibold">Dados</h2>
        <form action={updateStudent} className="space-y-3">
          <input type="hidden" name="id" value={id} />
          <div>
            <label className="label" htmlFor="name">
              Nome
            </label>
            <input className="input" id="name" name="name" required maxLength={80} defaultValue={student.name} />
          </div>
          <div>
            <label className="label" htmlFor="grade">
              Série ou idade
            </label>
            <input className="input" id="grade" name="grade" maxLength={40} defaultValue={student.grade ?? ""} />
          </div>
          <fieldset>
            <legend className="label">Cor</legend>
            <div className="flex flex-wrap gap-2">
              {(COLORS.includes(student.color) ? COLORS : [student.color, ...COLORS]).map((c) => (
                <label key={c} className="cursor-pointer">
                  <input type="radio" name="color" value={c} defaultChecked={c === student.color} className="peer sr-only" />
                  <span
                    className="block h-8 w-8 rounded-full ring-offset-2 peer-checked:ring-2 peer-checked:ring-ink peer-focus-visible:ring-2 peer-focus-visible:ring-brand-600"
                    style={{ background: c }}
                    aria-label={c}
                  />
                </label>
              ))}
            </div>
          </fieldset>
          <SubmitButton>Salvar</SubmitButton>
        </form>
      </section>

      <section className="card border-red-200">
        <h2 className="mb-1 font-display text-lg font-semibold text-red-700">Remover {student.name}</h2>
        <p className="mb-3 text-sm text-stone-600">Apaga o cronograma, as matérias, os livros e o histórico. Não dá para desfazer.</p>
        <form action={deleteStudent}>
          <input type="hidden" name="id" value={id} />
          <ConfirmButton
            className="rounded-md bg-red-700 px-4 py-2 text-sm font-bold text-white hover:bg-red-800"
            message={`Apagar ${student.name} e todos os dados? Não dá para desfazer.`}
          >
            Remover aluno
          </ConfirmButton>
        </form>
      </section>
    </div>
  );
}
