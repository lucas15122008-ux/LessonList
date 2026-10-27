import Image from "next/image";
import Link from "next/link";
import { Logo } from "@/components/logo";
import semana from "../../public/landing/semana.png";
import hoje from "../../public/landing/hoje-celular.png";

const FEATURES = [
  {
    title: "Cronograma da semana",
    text: "Monte a rotina de cada filho, com horário e matéria. Copie a semana de um para o outro e só ajuste o que muda.",
  },
  {
    title: "Matérias e livros",
    text: "Cada filho tem suas matérias e sua estante: o que está lendo, o que quer ler e o que já terminou, com a data.",
  },
  {
    title: "Histórico escolar",
    text: "Notas, projetos, trabalhos e horas de voluntariado guardados por data e matéria, prontos para quando precisar comprovar.",
  },
  {
    title: "Folha para imprimir",
    text: "A semana sai numa folha A4 deitada, com um quadradinho em cada atividade para a criança marcar o que já fez.",
  },
];

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-5">
        <Logo />
        <Link href="/entrar" className="rounded-md px-3 py-2 text-sm font-bold text-brand-700 hover:bg-brand-50">
          Entrar
        </Link>
      </header>

      <main className="flex-1">
        <section className="mx-auto grid w-full max-w-6xl items-center gap-10 px-4 pt-6 pb-16 sm:pt-12 lg:grid-cols-[5fr_7fr] lg:gap-12 lg:pb-24">
          <div>
            <h1 className="font-display text-4xl leading-[1.08] font-semibold tracking-tight text-balance sm:text-5xl">
              A semana de cada filho, num caderno só.
            </h1>
            <p className="mt-5 max-w-md text-lg text-pretty text-stone-700">
              Cronograma, livros e histórico escolar para famílias que fazem homeschool. Abra no celular de manhã ou imprima
              a semana para a geladeira.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3">
              <Link href="/cadastro" className="btn px-5 py-3 text-base">
                Criar conta da família
              </Link>
              <Link href="/entrar" className="text-sm font-bold text-brand-700 underline underline-offset-4 hover:text-brand-600">
                Já tenho conta
              </Link>
            </div>
            <p className="mt-4 text-sm text-stone-600">Grátis enquanto o LessonList está em teste.</p>
          </div>

          <figure className="overflow-hidden rounded-lg border border-stone-300 bg-surface">
            <Image
              src={semana}
              alt="Cronograma da Clara no LessonList, de segunda a quarta, com terça marcada como hoje"
              priority
              sizes="(min-width: 1024px) 680px, 100vw"
              className="h-auto w-full"
            />
          </figure>
        </section>

        <section className="border-y border-stone-300/80 bg-surface">
          <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-14 sm:py-20 lg:grid-cols-[5fr_7fr] lg:gap-12">
            <h2 className="font-display text-3xl font-semibold tracking-tight text-balance">
              Tudo o que hoje fica espalhado em cadernos, planilhas e no grupo da família.
            </h2>
            <dl className="divide-y divide-stone-300">
              {FEATURES.map((f) => (
                <div key={f.title} className="grid gap-1 py-5 first:pt-0 last:pb-0 sm:grid-cols-[13rem_1fr] sm:gap-6">
                  <dt className="font-bold">{f.title}</dt>
                  <dd className="text-pretty text-stone-700">{f.text}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <section className="mx-auto grid w-full max-w-6xl items-center gap-10 px-4 py-16 sm:py-24 md:grid-cols-[1fr_1.4fr]">
          <Image
            src={hoje}
            alt="Tela Hoje no celular, com as atividades do dia de cada filho"
            sizes="(min-width: 768px) 320px, 80vw"
            className="mx-auto h-auto w-full max-w-[300px] rounded-lg border border-stone-300"
          />
          <div className="max-w-lg">
            <h2 className="font-display text-3xl font-semibold tracking-tight text-balance">
              De manhã, uma tela diz o que cada um tem <span className="marker">hoje</span>.
            </h2>
            <p className="mt-4 text-lg text-pretty text-stone-700">
              Sem abrir caderno por caderno. A tela Hoje junta o dia de todos os filhos, em ordem de horário, e cada nome leva
              para a semana completa.
            </p>
          </div>
        </section>

        <section className="bg-brand-700 text-white">
          <div className="mx-auto flex w-full max-w-6xl flex-col items-start gap-6 px-4 py-14 sm:py-16 md:flex-row md:items-end md:justify-between">
            <div className="max-w-xl">
              <h2 className="font-display text-3xl font-semibold tracking-tight text-balance">O LessonList está começando.</h2>
              <p className="mt-3 text-lg text-pretty text-brand-50">
                Uma família homeschooler já usa no dia a dia e cada sugestão vira ajuste. Crie a conta da sua e conte o que
                falta pelo botão &quot;Enviar sugestão&quot;.
              </p>
            </div>
            <Link
              href="/cadastro"
              className="inline-flex shrink-0 items-center rounded-md bg-white px-5 py-3 font-bold text-brand-700 transition-colors hover:bg-brand-50 focus-visible:outline-white"
            >
              Criar conta da família
            </Link>
          </div>
        </section>
      </main>

      <footer className="mx-auto flex w-full max-w-6xl flex-wrap justify-between gap-2 px-4 py-6 text-sm text-stone-600">
        <span>LessonList · para famílias que educam em casa</span>
        <span>By Pegasus</span>
      </footer>
    </div>
  );
}
