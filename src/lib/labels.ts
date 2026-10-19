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

export const COLORS = ["#6366f1", "#ec4899", "#f59e0b", "#10b981", "#0ea5e9", "#ef4444", "#8b5cf6", "#14b8a6"];

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
