-- LessonList MVP: uma conta por família, vários alunos por família.
-- Toda tabela tem family_id = auth.uid() e RLS garante que cada família só vê os próprios dados.

create table public.students (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  name text not null check (char_length(name) between 1 and 80),
  grade text,
  color text not null default '#6366f1',
  created_at timestamptz not null default now()
);

create table public.subjects (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  student_id uuid not null references public.students (id) on delete cascade,
  name text not null check (char_length(name) between 1 and 80),
  color text not null default '#0ea5e9',
  created_at timestamptz not null default now()
);

create table public.schedule_items (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  student_id uuid not null references public.students (id) on delete cascade,
  subject_id uuid references public.subjects (id) on delete set null,
  weekday smallint not null check (weekday between 0 and 6), -- 0 = domingo
  start_time time not null,
  end_time time not null,
  title text not null check (char_length(title) between 1 and 120),
  notes text,
  created_at timestamptz not null default now(),
  check (end_time > start_time)
);

create table public.books (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  student_id uuid not null references public.students (id) on delete cascade,
  subject_id uuid references public.subjects (id) on delete set null,
  title text not null check (char_length(title) between 1 and 200),
  author text,
  status text not null default 'quero_ler' check (status in ('quero_ler', 'lendo', 'lido')),
  finished_on date,
  notes text,
  created_at timestamptz not null default now()
);

create table public.records (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  student_id uuid not null references public.students (id) on delete cascade,
  subject_id uuid references public.subjects (id) on delete set null,
  kind text not null check (kind in ('nota', 'projeto', 'trabalho', 'voluntariado')),
  title text not null check (char_length(title) between 1 and 200),
  record_date date not null default current_date,
  score text,
  hours numeric(6, 1) check (hours is null or hours >= 0),
  description text,
  created_at timestamptz not null default now()
);

create table public.feedback (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  message text not null check (char_length(message) between 1 and 4000),
  page text,
  created_at timestamptz not null default now()
);

create index on public.students (family_id);
create index on public.subjects (student_id);
create index on public.schedule_items (student_id, weekday, start_time);
create index on public.books (student_id);
create index on public.records (student_id, record_date);

-- Um aluno/matéria referenciado precisa ser da mesma família de quem grava.
create or replace function public.owns_student(sid uuid)
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.students s where s.id = sid and s.family_id = (select auth.uid()));
$$;

create or replace function public.owns_subject(subid uuid)
returns boolean language sql stable security definer set search_path = '' as $$
  select subid is null or exists (select 1 from public.subjects s where s.id = subid and s.family_id = (select auth.uid()));
$$;

alter table public.students enable row level security;
alter table public.subjects enable row level security;
alter table public.schedule_items enable row level security;
alter table public.books enable row level security;
alter table public.records enable row level security;
alter table public.feedback enable row level security;

create policy "familia gerencia seus alunos" on public.students for all to authenticated
  using (family_id = (select auth.uid()))
  with check (family_id = (select auth.uid()));

create policy "familia gerencia suas materias" on public.subjects for all to authenticated
  using (family_id = (select auth.uid()))
  with check (family_id = (select auth.uid()) and public.owns_student(student_id));

create policy "familia gerencia seu cronograma" on public.schedule_items for all to authenticated
  using (family_id = (select auth.uid()))
  with check (family_id = (select auth.uid()) and public.owns_student(student_id) and public.owns_subject(subject_id));

create policy "familia gerencia seus livros" on public.books for all to authenticated
  using (family_id = (select auth.uid()))
  with check (family_id = (select auth.uid()) and public.owns_student(student_id) and public.owns_subject(subject_id));

create policy "familia gerencia seu historico" on public.records for all to authenticated
  using (family_id = (select auth.uid()))
  with check (family_id = (select auth.uid()) and public.owns_student(student_id) and public.owns_subject(subject_id));

-- Sugestões: a família só envia e vê as próprias; quem lê todas é o dono do projeto pelo painel do Supabase.
create policy "familia envia sugestoes" on public.feedback for insert to authenticated
  with check (family_id = (select auth.uid()));
create policy "familia ve suas sugestoes" on public.feedback for select to authenticated
  using (family_id = (select auth.uid()));
