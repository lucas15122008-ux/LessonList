import { getStudent } from "@/lib/data";
import { StudentTabs } from "./tabs";

export default async function StudentLayout({ children, params }: LayoutProps<"/alunos/[id]">) {
  const { id } = await params;
  const student = await getStudent(id);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-extrabold">
          <span className="h-4 w-4 rounded-full" style={{ background: student.color }} aria-hidden />
          {student.name}
        </h1>
        {student.grade && <p className="text-stone-600">{student.grade}</p>}
      </div>
      <StudentTabs studentId={student.id} />
      {children}
    </div>
  );
}
