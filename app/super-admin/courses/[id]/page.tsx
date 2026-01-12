// app/(super-admin)/super-admin/courses/[id]/page.tsx
import { notFound } from "next/navigation";
import CourseEditor from "@/components/super-admin/CourseEditor";
import { getCourseById } from "@/app/actions/course-management";

export const metadata = {
  title: "Edit Course | Super Admin",
};

interface PageProps {
  params: Promise<{ id: string }>; // lowercase 'id' to match [id] folder, and Promise for Next.js 15
}

export default async function CourseEditorPage({ params }: PageProps) {
  const { id } = await params; // Await params in Next.js 15

  const result = await getCourseById(id);

  if (!result.success || !result.data) {
    notFound();
  }

  return (
    <div className="p-6">
      <CourseEditor course={result.data} />
    </div>
  );
}
