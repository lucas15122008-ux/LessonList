import "server-only";
import { cache } from "react";
import { notFound, redirect } from "next/navigation";
import { createClient } from "./supabase/server";
import type { Book, ScheduleItem, SchoolRecord, Student, Subject } from "./types";

// Lê e valida a sessão uma vez por pedido. Toda página da área logada passa por aqui.
export const requireUser = cache(async () => {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  if (!data?.claims) redirect("/entrar");
  return { supabase, userId: data.claims.sub as string, email: data.claims.email as string | undefined };
});

export const getStudents = cache(async (): Promise<Student[]> => {
  const { supabase } = await requireUser();
  const { data, error } = await supabase.from("students").select("id, name, grade, color").order("created_at");
  if (error) throw error;
  return data;
});

export const getStudent = cache(async (id: string): Promise<Student> => {
  const student = (await getStudents()).find((s) => s.id === id);
  if (!student) notFound();
  return student;
});

export const getSubjects = cache(async (studentId: string): Promise<Subject[]> => {
  const { supabase } = await requireUser();
  const { data, error } = await supabase
    .from("subjects")
    .select("id, student_id, name, color")
    .eq("student_id", studentId)
    .order("name");
  if (error) throw error;
  return data;
});

export async function getSchedule(studentIds: string[]): Promise<ScheduleItem[]> {
  if (studentIds.length === 0) return [];
  const { supabase } = await requireUser();
  const { data, error } = await supabase
    .from("schedule_items")
    .select("id, student_id, subject_id, weekday, start_time, end_time, title, notes")
    .in("student_id", studentIds)
    .order("start_time");
  if (error) throw error;
  return data;
}

export async function getBooks(studentId: string): Promise<Book[]> {
  const { supabase } = await requireUser();
  const { data, error } = await supabase
    .from("books")
    .select("id, student_id, subject_id, title, author, status, finished_on, notes")
    .eq("student_id", studentId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function getRecords(studentId: string): Promise<SchoolRecord[]> {
  const { supabase } = await requireUser();
  const { data, error } = await supabase
    .from("records")
    .select("id, student_id, subject_id, kind, title, record_date, score, hours, description")
    .eq("student_id", studentId)
    .order("record_date", { ascending: false });
  if (error) throw error;
  return data.map((r) => ({ ...r, hours: r.hours === null ? null : Number(r.hours) }));
}
