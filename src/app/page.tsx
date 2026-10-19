import Link from "next/link";
import { Logo } from "@/components/logo";

const FEATURES = [
  {
    icon: "🗓️",
    title: "Cronograma da semana",
    text: "Monte a rotina de cada filho e veja de manhã o que cada um tem para hoje. Copie o cronograma de um filho para o outro e ajuste.",
  },
  {
    icon: "📚",
    title: "Matérias e livros",
    text: "Registre as matérias estudadas e acompanhe os livros que cada um está lendo, quer ler ou já leu.",
  },
  {
    icon: "🎓",
    title: "Histórico escolar",
    text: "Guarde notas, projetos, trabalhos e horas de voluntariado num só lugar, prontos para quando precisar comprovar.",
  },
];

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <header className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-5">
        <Logo />
        <Link href="/entrar" className="btn-ghost">
          Entrar
        </Link>
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 px-4">
        <section className="py-12 text-center sm:py-20">
          <p className="chip mb-4 bg-brand-100 text-brand-700">Para famílias homeschoolers</p>
          <h1 className="mx-auto max-w-2xl text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
            O homeschool da sua família, organizado num só lugar.
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg text-stone-600">
            Cronograma, matérias, livros e histórico escolar de cada filho, do celular ou do computador.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/cadastro" className="btn px-6 py-3 text-base">
              Criar conta grátis
            </Link>
            <Link href="/entrar" className="btn-ghost px-6 py-3 text-base">
              Já tenho conta
            </Link>
          </div>
        </section>

        <section className="grid gap-4 pb-16 sm:grid-cols-3">
          {FEATURES.map((f) => (
            <div key={f.title} className="card">
              <div className="text-3xl" aria-hidden>
                {f.icon}
              </div>
              <h2 className="mt-3 text-lg font-bold">{f.title}</h2>
              <p className="mt-1 text-stone-600">{f.text}</p>
            </div>
          ))}
        </section>
      </main>

      <footer className="py-6 text-center text-sm text-stone-500">LessonList · feito com carinho para famílias homeschoolers</footer>
    </div>
  );
}
