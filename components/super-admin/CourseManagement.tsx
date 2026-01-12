// components/super-admin/CourseManagement.tsx
"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Plus,
  Trash2,
  X,
  Edit,
  Eye,
  Copy,
  Upload,
  BookOpen,
  Video,
  Clock,
  Users,
  Star,
  MoreVertical,
  CheckCircle,
  XCircle,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import {
  createCourse,
  deleteCourse,
  updateCourse,
  publishCourse,
  unpublishCourse,
  duplicateCourse,
} from "@/app/actions/course-management";

// Define CourseLevel explicitly from LEVELS array
const LEVELS = ["beginner", "intermediate", "advanced", "expert"] as const;
type CourseLevel = (typeof LEVELS)[number]; // This creates a union type: "beginner" | "intermediate" | "advanced" | "expert"

const VISIBILITY_OPTIONS = ["public", "organization", "private"];

// Types
interface ICourseStats {
  totalDuration: number;
  moduleCount: number;
  lessonCount: number;
  enrollmentCount: number;
  avgRating: number;
}

export interface ICourseListItem {
  _id: string;
  title: string;
  slug: string;
  shortDescription?: string;
  thumbnail?: string;
  category?: string;
  level: CourseLevel; // Use the specific CourseLevel type
  status: string;
  isPublished: boolean;
  isFeatured: boolean;
  isMandatory: boolean;
  visibility: string;
  stats: ICourseStats;
  createdAt: string;
  updatedAt: string;
}

export interface CourseKPIs {
  total: number;
  published: number;
  draft: number;
  archived: number;
  totalEnrollments: number;
}

// Define an interface for the data submitted via the form to actions
interface CourseSubmitData {
  title: string;
  shortDescription?: string;
  description?: string;
  category?: string;
  level: CourseLevel; // Should be CourseLevel
  tags?: string[];
  visibility?: string;
  instructorName?: string;
  isMandatory?: boolean;
  isFeatured?: boolean;
  thumbnail?: string;
}

// Upload helper
async function uploadFile(
  file: File,
  type: "video" | "image" | "document",
  folder?: string
): Promise<{ url: string; duration?: number }> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("type", type);
  if (folder) formData.append("folder", folder);

  const response = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });

  const result = await response.json();
  if (!result.success) {
    throw new Error(result.error || "Upload failed");
  }

  return {
    url: result.data.secure_url,
    duration: result.data.duration,
  };
}

export default function CourseManagement({
  initialCourses,
  kpis,
}: {
  initialCourses: ICourseListItem[];
  kpis: CourseKPIs;
}) {
  const [courses, setCourses] = useState(initialCourses);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState<ICourseListItem | null>(
    null
  );
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const router = useRouter();

  const filteredCourses = courses.filter((c) => {
    const matchesSearch =
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.category?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Now, handleCreate directly accepts CourseSubmitData
  const handleCreate = async (data: CourseSubmitData) => {
    setIsLoading(true);
    const result = await createCourse(data); // `data` type now matches `createCourse` expected input
    setIsLoading(false);
    if (result.success) {
      toast.success(result.message);
      setShowCreateModal(false);
      router.refresh();
    } else {
      toast.error(result.error || "Failed to create course");
    }
  };

  // handleUpdate also directly accepts CourseSubmitData.
  // Assuming `updateCourse`'s second parameter is compatible with `CourseSubmitData`.
  const handleUpdate = async (data: CourseSubmitData) => {
    if (!showEditModal) return;
    setIsLoading(true);
    const result = await updateCourse(showEditModal._id, data);
    setIsLoading(false);
    if (result.success) {
      toast.success(result.message);
      setShowEditModal(null);
      router.refresh();
    } else {
      toast.error(result.error || "Failed to update course");
    }
  };

  const handleDelete = async (courseId: string) => {
    if (
      !confirm(
        "Are you sure? This will permanently delete the course and all its content."
      )
    )
      return;
    setIsLoading(true);
    const result = await deleteCourse(courseId);
    setIsLoading(false);
    if (result.success) {
      toast.success(result.message);
      setCourses(courses.filter((c) => c._id !== courseId));
      router.refresh();
    } else {
      toast.error(result.error || "Failed to delete course");
    }
  };

  const handlePublish = async (courseId: string) => {
    setIsLoading(true);
    const result = await publishCourse(courseId);
    setIsLoading(false);
    if (result.success) {
      toast.success(result.message);
      router.refresh();
    } else {
      toast.error(result.error || "Failed to publish course");
    }
    setActiveDropdown(null);
  };

  const handleUnpublish = async (courseId: string) => {
    setIsLoading(true);
    const result = await unpublishCourse(courseId);
    setIsLoading(false);
    if (result.success) {
      toast.success(result.message);
      router.refresh();
    } else {
      toast.error(result.error || "Failed to unpublish course");
    }
    setActiveDropdown(null);
  };

  const handleDuplicate = async (courseId: string) => {
    setIsLoading(true);
    const result = await duplicateCourse(courseId);
    setIsLoading(false);
    if (result.success) {
      toast.success(result.message);
      router.refresh();
    } else {
      toast.error(result.error || "Failed to duplicate course");
    }
    setActiveDropdown(null);
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const getStatusBadge = (status: string, isPublished: boolean) => {
    if (isPublished && status === "published") {
      return (
        <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">
          Published
        </span>
      );
    }
    const colors: Record<string, string> = {
      draft: "bg-gray-100 text-gray-700",
      review: "bg-yellow-100 text-yellow-700",
      archived: "bg-red-100 text-red-700",
    };
    return (
      <span
        className={`${
          colors[status] || colors.draft
        } px-2 py-1 rounded text-xs capitalize`}
      >
        {status}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-xl border p-4">
          <div className="text-2xl font-bold">{kpis.total}</div>
          <div className="text-sm text-gray-500">Total Courses</div>
        </div>
        <div className="bg-white rounded-xl border p-4">
          <div className="text-2xl font-bold text-green-600">
            {kpis.published}
          </div>
          <div className="text-sm text-gray-500">Published</div>
        </div>
        <div className="bg-white rounded-xl border p-4">
          <div className="text-2xl font-bold text-gray-600">{kpis.draft}</div>
          <div className="text-sm text-gray-500">Drafts</div>
        </div>
        <div className="bg-white rounded-xl border p-4">
          <div className="text-2xl font-bold text-red-600">{kpis.archived}</div>
          <div className="text-sm text-gray-500">Archived</div>
        </div>
        <div className="bg-white rounded-xl border p-4">
          <div className="text-2xl font-bold text-blue-600">
            {kpis.totalEnrollments}
          </div>
          <div className="text-sm text-gray-500">Total Enrollments</div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-xl border shadow-sm">
        <div className="p-4 border-b flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
          <div className="flex gap-3 flex-wrap">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search courses..."
                className="w-64 pl-10 pr-4 py-2 rounded-lg border text-sm"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-lg border text-sm"
            >
              <option value="all">All Status</option>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800"
          >
            <Plus className="h-4 w-4" />
            Create Course
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-500 font-medium">
              <tr>
                <th className="px-6 py-3">Course</th>
                <th className="px-6 py-3">Category</th>
                <th className="px-6 py-3">Level</th>
                <th className="px-6 py-3">Content</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Stats</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredCourses.map((course) => (
                <tr key={course._id} className="hover:bg-gray-50/50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {course.thumbnail ? (
                        <img
                          src={course.thumbnail}
                          alt={course.title}
                          className="w-16 h-10 object-cover rounded"
                        />
                      ) : (
                        <div className="w-16 h-10 bg-gray-200 rounded flex items-center justify-center">
                          <BookOpen className="h-5 w-5 text-gray-400" />
                        </div>
                      )}
                      <div>
                        <div className="font-medium line-clamp-1">
                          {course.title}
                        </div>
                        <div className="flex gap-1">
                          {course.isMandatory && (
                            <span className="text-xs text-orange-600">
                              Mandatory
                            </span>
                          )}
                          {course.isFeatured && (
                            <span className="text-xs text-purple-600">
                              Featured
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {course.category || "-"}
                  </td>
                  <td className="px-6 py-4">
                    <span className="capitalize">{course.level}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4 text-gray-600 text-xs">
                      <span className="flex items-center gap-1">
                        <BookOpen className="h-3 w-3" />
                        {course.stats.moduleCount} modules
                      </span>
                      <span className="flex items-center gap-1">
                        <Video className="h-3 w-3" />
                        {course.stats.lessonCount} lessons
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatDuration(course.stats.totalDuration)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(course.status, course.isPublished)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3 text-xs text-gray-600">
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {course.stats.enrollmentCount}
                      </span>
                      <span className="flex items-center gap-1">
                        <Star className="h-3 w-3" />
                        {course.stats.avgRating.toFixed(1)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2 relative">
                      <button
                        onClick={() =>
                          router.push(`/super-admin/courses/${course._id}`)
                        }
                        className="p-2 text-indigo-600 hover:bg-indigo-50 rounded"
                        title="Edit Content"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setShowEditModal(course)}
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded"
                        title="Edit Details"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <div className="relative">
                        <button
                          onClick={() =>
                            setActiveDropdown(
                              activeDropdown === course._id ? null : course._id
                            )
                          }
                          className="p-2 text-gray-600 hover:bg-gray-100 rounded"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </button>
                        {activeDropdown === course._id && (
                          <div className="absolute right-0 top-full mt-1 w-48 bg-white border rounded-lg shadow-lg z-10">
                            {course.isPublished ? (
                              <button
                                onClick={() => handleUnpublish(course._id)}
                                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                              >
                                <XCircle className="h-4 w-4" /> Unpublish
                              </button>
                            ) : (
                              <button
                                onClick={() => handlePublish(course._id)}
                                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                              >
                                <CheckCircle className="h-4 w-4" /> Publish
                              </button>
                            )}
                            <button
                              onClick={() => handleDuplicate(course._id)}
                              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                            >
                              <Copy className="h-4 w-4" /> Duplicate
                            </button>
                            <button
                              onClick={() => handleDelete(course._id)}
                              className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                            >
                              <Trash2 className="h-4 w-4" /> Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredCourses.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-500">
                    No courses found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <CourseModal
          title="Create Course"
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreate}
          isLoading={isLoading}
        />
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <CourseModal
          title="Edit Course"
          course={showEditModal}
          onClose={() => setShowEditModal(null)}
          onSubmit={handleUpdate}
          isLoading={isLoading}
        />
      )}

      {activeDropdown && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setActiveDropdown(null)}
        />
      )}
    </div>
  );
}

// Course Modal with proper state management
function CourseModal({
  title,
  course,
  onClose,
  onSubmit,
  isLoading: parentLoading,
}: {
  title: string;
  course?: ICourseListItem;
  onClose: () => void;
  onSubmit: (data: CourseSubmitData) => void; // Use CourseSubmitData here
  isLoading: boolean;
}) {
  // Define CourseFormState to manage string for tags input and CourseLevel for level
  interface CourseFormState {
    title: string;
    shortDescription: string;
    description: string;
    category: string;
    level: CourseLevel; // Use CourseLevel here
    tags: string; // Tags are managed as a comma-separated string in the form
    visibility: string;
    instructorName: string;
    isMandatory: boolean;
    isFeatured: boolean;
  }

  const [formData, setFormData] = useState<CourseFormState>({
    title: course?.title || "",
    shortDescription: course?.shortDescription || "",
    description: "", // Assuming description is not part of ICourseListItem directly but could be in the form
    category: course?.category || "",
    level: (course?.level || "beginner") as CourseLevel, // Ensure it's CourseLevel
    tags: "", // Assuming tags are not part of ICourseListItem directly or need transformation
    visibility: course?.visibility || "organization",
    instructorName: "", // Assuming instructorName is not part of ICourseListItem directly
    isMandatory: course?.isMandatory || false,
    isFeatured: course?.isFeatured || false,
  });
  const [thumbnail, setThumbnail] = useState<string | null>(
    course?.thumbnail || null
  );
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(
    course?.thumbnail || null
  );
  const [uploading, setUploading] = useState(false);
  const thumbnailRef = useRef<HTMLInputElement>(null);

  const handleThumbnailChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Preview
    const reader = new FileReader();
    reader.onload = (e) => setThumbnailPreview(e.target?.result as string);
    reader.readAsDataURL(file);

    // Upload
    setUploading(true);
    try {
      const result = await uploadFile(file, "image", "courses/thumbnails");
      setThumbnail(result.url);
      toast.success("Thumbnail uploaded");
    } catch (error) {
      toast.error("Failed to upload thumbnail");
      setThumbnailPreview(course?.thumbnail || null);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast.error("Title is required");
      return;
    }

    // Transform formData to CourseSubmitData before submitting
    const dataToSubmit: CourseSubmitData = {
      ...formData,
      tags: formData.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      thumbnail: thumbnail || undefined,
    };
    onSubmit(dataToSubmit);
  };

  const isLoading = parentLoading || uploading;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b flex justify-between items-center bg-gray-50">
          <h3 className="font-bold text-lg">{title}</h3>
          <button onClick={onClose} disabled={isLoading}>
            <X className="h-5 w-5 text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Thumbnail Upload */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Thumbnail
            </label>
            <div
              onClick={() => !isLoading && thumbnailRef.current?.click()}
              className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:border-gray-400 transition ${
                isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {uploading ? (
                <div className="py-8">
                  <Loader2 className="h-8 w-8 mx-auto text-blue-600 animate-spin" />
                  <p className="mt-2 text-sm text-gray-500">Uploading...</p>
                </div>
              ) : thumbnailPreview ? (
                <img
                  src={thumbnailPreview}
                  alt="Thumbnail"
                  className="w-full h-40 object-cover rounded"
                />
              ) : (
                <div className="py-8">
                  <Upload className="h-8 w-8 mx-auto text-gray-400" />
                  <p className="mt-2 text-sm text-gray-500">
                    Click to upload thumbnail
                  </p>
                </div>
              )}
            </div>
            <input
              ref={thumbnailRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleThumbnailChange}
              disabled={isLoading}
            />
          </div>

          {/* Title */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Title *</label>
            <input
              value={formData.title}
              onChange={(e) =>
                setFormData((p) => ({ ...p, title: e.target.value }))
              }
              required
              disabled={isLoading}
              placeholder="Course title"
              className="w-full px-3 py-2 border rounded-md disabled:bg-gray-100"
            />
          </div>

          {/* Short Description */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">
              Short Description
            </label>
            <input
              value={formData.shortDescription}
              onChange={(e) =>
                setFormData((p) => ({ ...p, shortDescription: e.target.value }))
              }
              disabled={isLoading}
              placeholder="Brief description (max 300 chars)"
              maxLength={300}
              className="w-full px-3 py-2 border rounded-md disabled:bg-gray-100"
            />
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">
              Full Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData((p) => ({ ...p, description: e.target.value }))
              }
              disabled={isLoading}
              rows={4}
              placeholder="Detailed course description"
              className="w-full px-3 py-2 border rounded-md disabled:bg-gray-100"
            />
          </div>

          {/* Category & Level */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">
                Category
              </label>
              <input
                value={formData.category}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, category: e.target.value }))
                }
                disabled={isLoading}
                placeholder="e.g., Programming, Design"
                className="w-full px-3 py-2 border rounded-md disabled:bg-gray-100"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Level</label>
              <select
                value={formData.level}
                onChange={
                  (e) =>
                    setFormData((p) => ({
                      ...p,
                      level: e.target.value as CourseLevel,
                    })) // Cast value to CourseLevel
                }
                disabled={isLoading}
                className="w-full px-3 py-2 border rounded-md disabled:bg-gray-100"
              >
                {LEVELS.map((level) => (
                  <option key={level} value={level}>
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Tags</label>
            <input
              value={formData.tags}
              onChange={(e) =>
                setFormData((p) => ({ ...p, tags: e.target.value }))
              }
              disabled={isLoading}
              placeholder="Comma separated tags"
              className="w-full px-3 py-2 border rounded-md disabled:bg-gray-100"
            />
          </div>

          {/* Instructor & Visibility */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">
                Instructor Name
              </label>
              <input
                value={formData.instructorName}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, instructorName: e.target.value }))
                }
                disabled={isLoading}
                placeholder="Instructor name"
                className="w-full px-3 py-2 border rounded-md disabled:bg-gray-100"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">
                Visibility
              </label>
              <select
                value={formData.visibility}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, visibility: e.target.value }))
                }
                disabled={isLoading}
                className="w-full px-3 py-2 border rounded-md disabled:bg-gray-100"
              >
                {VISIBILITY_OPTIONS.map((v) => (
                  <option key={v} value={v}>
                    {v.charAt(0).toUpperCase() + v.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Flags */}
          <div className="flex gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isMandatory}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, isMandatory: e.target.checked }))
                }
                disabled={isLoading}
                className="rounded"
              />
              <span className="text-sm">Mandatory</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isFeatured}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, isFeatured: e.target.checked }))
                }
                disabled={isLoading}
                className="rounded"
              />
              <span className="text-sm">Featured</span>
            </label>
          </div>

          {/* Actions */}
          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 border rounded-lg hover:bg-gray-50"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {parentLoading && <Loader2 className="h-4 w-4 animate-spin" />}
              {parentLoading ? "Saving..." : course ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
