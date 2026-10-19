"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/data";
import { COLORS } from "@/lib/labels";

// O RLS do Supabase já impede mexer em dados de outra família; aqui só validamos o formulário.

function text(fd: FormData, key: string) {
  const v = fd.get(key);
  return typeof v === "string" ? v.trim() : "";
}

function optional(fd: FormData, key: string) {
  return text(fd, key) || null;
}

function required(fd: FormData, key: string) {
  const v = text(fd, key);
  if (!v) throw new Error(`Campo obrigatório: ${key}`);
  return v;
}

function check(error: { message: string } | null) {
  if (error) throw new Error(error.message);
}

const studentPath = (id: string) => `/alunos/${id}`;

// ---------- Alunos ----------

export async function createStudent(fd: FormData) {
  const { supabase } = await requireUser();
  const { count } = await supabase.from("students").select("id", { count: "exact", head: true });
  const { data, error } = await supabase
    .from("students")
    .insert({
      name: required(fd, "name"),
      grade: optional(fd, "grade"),
      color: text(fd, "color") || COLORS[(count ?? 0) % COLORS.length],
    })
    .select("id")
    .single();
  check(error);
  revalidatePath("/", "layout");
  redirect(studentPath(data!.id));
}

export async function updateStudent(fd: FormData) {
  const { supabase } = await requireUser();
  const id = required(fd, "id");
  check(
    (
      await supabase
        .from("students")
        .update({ name: required(fd, "name"), grade: optional(fd, "grade"), color: required(fd, "color") })
        .eq("id", id)
    ).error,
  );
  revalidatePath("/", "layout");
}

export async function deleteStudent(fd: FormData) {
  const { supabase } = await requireUser();
  check((await supabase.from("students").delete().eq("id", required(fd, "id"))).error);
  revalidatePath("/", "layout");
  redirect("/painel");
}

// ---------- Matérias ----------

export async function createSubject(fd: FormData) {
  const { supabase } = await requireUser();
  const studentId = required(fd, "student_id");
  check(
    (
      await supabase.from("subjects").insert({
        student_id: studentId,
        name: required(fd, "name"),
        color: text(fd, "color") || COLORS[Math.floor(Math.random() * COLORS.length)],
      })
    ).error,
  );
  revalidatePath(studentPath(studentId), "layout");
}

export async function deleteSubject(fd: FormData) {
  const { supabase } = await requireUser();
  check((await supabase.from("subjects").delete().eq("id", required(fd, "id"))).error);
  revalidatePath(studentPath(required(fd, "student_id")), "layout");
}

// ---------- Cronograma ----------

export async function createScheduleItem(fd: FormData) {
  const { supabase } = await requireUser();
  const studentId = required(fd, "student_id");
  const weekdays = fd.getAll("weekday").map(Number).filter((n) => n >= 0 && n <= 6);
  if (weekdays.length === 0) throw new Error("Escolha pelo menos um dia");
  const subjectId = optional(fd, "subject_id");
  const title = text(fd, "title");
  const base = {
    student_id: studentId,
    subject_id: subjectId,
    start_time: required(fd, "start_time"),
    end_time: required(fd, "end_time"),
    notes: optional(fd, "notes"),
  };

  // Sem título, usa o nome da matéria escolhida.
  let finalTitle = title;
  if (!finalTitle && subjectId) {
    const { data } = await supabase.from("subjects").select("name").eq("id", subjectId).single();
    finalTitle = data?.name ?? "";
  }
  if (!finalTitle) throw new Error("Dê um nome à atividade ou escolha uma matéria");

  check(
    (await supabase.from("schedule_items").insert(weekdays.map((weekday) => ({ ...base, weekday, title: finalTitle }))))
      .error,
  );
  revalidatePath("/", "layout");
}

export async function deleteScheduleItem(fd: FormData) {
  const { supabase } = await requireUser();
  check((await supabase.from("schedule_items").delete().eq("id", required(fd, "id"))).error);
  revalidatePath("/", "layout");
}

// Copia o cronograma de outro aluno (o "modelo"), substituindo o atual.
export async function copySchedule(fd: FormData) {
  const { supabase } = await requireUser();
  const to = required(fd, "student_id");
  const from = required(fd, "from_student_id");
  if (to === from) return;

  const { data: items, error } = await supabase
    .from("schedule_items")
    .select("weekday, start_time, end_time, title, notes")
    .eq("student_id", from);
  check(error);
  check((await supabase.from("schedule_items").delete().eq("student_id", to)).error);
  if (items && items.length > 0) {
    // Matérias são por aluno, então a cópia leva só o nome da atividade.
    check((await supabase.from("schedule_items").insert(items.map((i) => ({ ...i, student_id: to })))).error);
  }
  revalidatePath("/", "layout");
}

// ---------- Livros ----------

export async function createBook(fd: FormData) {
  const { supabase } = await requireUser();
  const studentId = required(fd, "student_id");
  const status = text(fd, "status") || "lendo";
  check(
    (
      await supabase.from("books").insert({
        student_id: studentId,
        subject_id: optional(fd, "subject_id"),
        title: required(fd, "title"),
        author: optional(fd, "author"),
        status,
        finished_on: status === "lido" ? new Date().toISOString().slice(0, 10) : null,
      })
    ).error,
  );
  revalidatePath(studentPath(studentId), "layout");
}

export async function setBookStatus(fd: FormData) {
  const { supabase } = await requireUser();
  const status = required(fd, "status");
  check(
    (
      await supabase
        .from("books")
        .update({ status, finished_on: status === "lido" ? new Date().toISOString().slice(0, 10) : null })
        .eq("id", required(fd, "id"))
    ).error,
  );
  revalidatePath(studentPath(required(fd, "student_id")), "layout");
}

export async function deleteBook(fd: FormData) {
  const { supabase } = await requireUser();
  check((await supabase.from("books").delete().eq("id", required(fd, "id"))).error);
  revalidatePath(studentPath(required(fd, "student_id")), "layout");
}

// ---------- Histórico ----------

export async function createRecord(fd: FormData) {
  const { supabase } = await requireUser();
  const studentId = required(fd, "student_id");
  const hours = text(fd, "hours").replace(",", ".");
  check(
    (
      await supabase.from("records").insert({
        student_id: studentId,
        subject_id: optional(fd, "subject_id"),
        kind: required(fd, "kind"),
        title: required(fd, "title"),
        record_date: text(fd, "record_date") || undefined,
        score: optional(fd, "score"),
        hours: hours ? Number(hours) : null,
        description: optional(fd, "description"),
      })
    ).error,
  );
  revalidatePath(studentPath(studentId), "layout");
}

export async function deleteRecord(fd: FormData) {
  const { supabase } = await requireUser();
  check((await supabase.from("records").delete().eq("id", required(fd, "id"))).error);
  revalidatePath(studentPath(required(fd, "student_id")), "layout");
}

// ---------- Sugestões ----------

export async function sendFeedback(_prev: { sent: boolean }, fd: FormData) {
  const { supabase } = await requireUser();
  check((await supabase.from("feedback").insert({ message: required(fd, "message"), page: optional(fd, "page") })).error);
  return { sent: true };
}
