export type Student = {
  id: string;
  name: string;
  grade: string | null;
  color: string;
};

export type Subject = {
  id: string;
  student_id: string;
  name: string;
  color: string;
};

export type ScheduleItem = {
  id: string;
  student_id: string;
  subject_id: string | null;
  weekday: number;
  start_time: string;
  end_time: string;
  title: string;
  notes: string | null;
};

export type BookStatus = "quero_ler" | "lendo" | "lido";

export type Book = {
  id: string;
  student_id: string;
  subject_id: string | null;
  title: string;
  author: string | null;
  status: BookStatus;
  finished_on: string | null;
  notes: string | null;
};

export type RecordKind = "nota" | "projeto" | "trabalho" | "voluntariado";

export type SchoolRecord = {
  id: string;
  student_id: string;
  subject_id: string | null;
  kind: RecordKind;
  title: string;
  record_date: string;
  score: string | null;
  hours: number | null;
  description: string | null;
};
