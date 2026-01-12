// app/(super-admin)/super-admin/courses/page.tsx
import { Suspense } from "react";
// Import CourseKPIs type directly from CourseManagement to use it for strong typing
import CourseManagement, {
  CourseKPIs,
  ICourseListItem, // Also import ICourseListItem for getAllCourses return type
} from "@/components/super-admin/CourseManagement";
import { getAllCourses, getCourseStats } from "@/app/actions/course-management";

export const metadata = {
  title: "Course Management | Super Admin",
};

// Define a consistent API response structure (if not already done in course-management.ts)
interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

async function CoursesContent() {
  // Assuming getAllCourses and getCourseStats return Promise<APIResponse<...>>
  const [coursesResult, statsResult] = await Promise.all([
    getAllCourses(), // Should return Promise<APIResponse<ICourseListItem[]>>
    getCourseStats(), // Should return Promise<APIResponse<CourseKPIs>>
  ]);

  // Ensure `courses` is an array, providing a default empty array if not successful or data is missing
  const courses: ICourseListItem[] =
    coursesResult.success && coursesResult.data ? coursesResult.data : [];

  // Define a complete default/fallback CourseKPIs object
  const defaultKPIs: CourseKPIs = {
    total: 0,
    published: 0,
    draft: 0,
    archived: 0,
    totalEnrollments: 0,
  };

  // Explicitly type `kpis` as CourseKPIs and ensure it always resolves to that type.
  // We check if `statsResult.success` is true AND `statsResult.data` actually exists.
  // If both are true, we use `statsResult.data`. Otherwise, we use our `defaultKPIs`.
  // We also add an `as CourseKPIs` cast. While ideally not needed if `getCourseStats`
  // is perfectly typed, it acts as a defensive measure to satisfy TypeScript
  // if there's any lingering `any` type or potential type inference issue from the action.
  const kpis: CourseKPIs =
    statsResult.success && statsResult.data
      ? (statsResult.data as CourseKPIs)
      : defaultKPIs;

  return <CourseManagement initialCourses={courses} kpis={kpis} />;
}

export default function CoursesPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Course Management</h1>
        <p className="text-gray-500">
          Create and manage courses for the platform
        </p>
      </div>
      <Suspense
        fallback={
          <div className="animate-pulse space-y-4">
            <div className="grid grid-cols-5 gap-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-24 bg-gray-200 rounded-xl" />
              ))}
            </div>
            <div className="h-96 bg-gray-200 rounded-xl" />
          </div>
        }
      >
        <CoursesContent />
      </Suspense>
    </div>
  );
}
