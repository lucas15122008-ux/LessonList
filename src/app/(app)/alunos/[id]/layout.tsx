import { getStudent } from "@/lib/data";
import { StudentTabs } from "./tabs";

export default async function StudentLayout({ children, params }: LayoutProps<"/alunos/[id]">) {
  const { id } = await params;
  const student = await getStudent(id);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="page-title flex items-center gap-2.5">
          <span className="h-3.5 w-3.5 shrink-0 rounded-full" style={{ background: student.color }} aria-hidden />
          {student.name}
        </h1>
        {student.grade && <p className="mt-0.5 text-stone-600">{student.grade}</p>}
      </div>
      <StudentTabs studentId={student.id} />
      {children}
    </div>
  );
}
