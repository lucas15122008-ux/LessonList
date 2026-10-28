import type { BookStatus, RecordKind } from "./types";

// Semana escolar começando na segunda. O valor é o mesmo de Date.getDay() (0 = domingo).
export const WEEKDAYS = [
  { value: 1, short: "Seg", long: "Segunda" },
  { value: 2, short: "Ter", long: "Terça" },
  { value: 3, short: "Qua", long: "Quarta" },
  { value: 4, short: "Qui", long: "Quinta" },
  { value: 5, short: "Sex", long: "Sexta" },
  { value: 6, short: "Sáb", long: "Sábado" },
  { value: 0, short: "Dom", long: "Domingo" },
] as const;

export const BOOK_STATUS: { value: BookStatus; label: string }[] = [
  { value: "lendo", label: "Lendo" },
  { value: "quero_ler", label: "Quero ler" },
  { value: "lido", label: "Lido" },
];

export const RECORD_KINDS: { value: RecordKind; label: string; plural: string }[] = [
  { value: "nota", label: "Nota", plural: "Notas" },
  { value: "projeto", label: "Projeto", plural: "Projetos" },
  { value: "trabalho", label: "Trabalho", plural: "Trabalhos" },
  { value: "voluntariado", label: "Voluntariado", plural: "Voluntariado" },
];

// Cores de lápis de cor para filhos e matérias. Alunos antigos podem ter cores fora desta lista.
export const COLORS = ["#2f6fa5", "#c03a4e", "#9c6b0c", "#2f7a52", "#b04a72", "#8a5a3c", "#3f7778", "#6d7a2e"];

const TIME_ZONE = "America/Sao_Paulo";

export function todayInBrazil() {
  const now = new Date();
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    weekday: "short",
  }).formatToParts(now);
  const get = (t: string) => parts.find((p) => p.type === t)!.value;
  const weekday = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(get("weekday"));
  return { iso: `${get("year")}-${get("month")}-${get("day")}`, weekday };
}

export function formatTime(t: string) {
  return t.slice(0, 5);
}

export function formatDate(iso: string) {
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}
