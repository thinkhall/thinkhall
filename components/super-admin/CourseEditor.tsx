// components/super-admin/CourseEditor.tsx
"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Plus,
  Trash2,
  Edit,
  X,
  ChevronDown,
  ChevronRight,
  Video,
  FileText,
  Upload,
  GripVertical,
  CheckCircle,
  Loader2,
  PlayCircle,
} from "lucide-react";
import { toast } from "sonner";
import {
  addModule,
  updateModule,
  deleteModule,
  addLesson,
  updateLesson,
  deleteLesson,
  updateCourseSettings,
} from "@/app/actions/course-management";
import { useCloudinaryUpload } from "@/hooks/useCloudinaryUpload";

// Define the allowed lesson types and derive a TypeScript type from them
const LESSON_TYPES = [
  { value: "video", label: "Video", icon: Video },
  { value: "text", label: "Text/Article", icon: FileText },
  { value: "document", label: "Document", icon: FileText },
] as const; // `as const` ensures `value` is literal

// Define LessonType as a union of the `value` properties
type LessonType = (typeof LESSON_TYPES)[number]["value"]; // "video" | "text" | "document"

// Types
interface ILesson {
  _id: string;
  title: string;
  description?: string;
  type: LessonType; // Changed from 'string' to 'LessonType'
  contentUrl?: string;
  contentText?: string;
  documentUrl?: string;
  duration: number;
  order: number;
  isPreview: boolean;
  isRequired: boolean;
  isActive: boolean;
}

interface IModule {
  _id: string;
  title: string;
  description?: string;
  order: number;
  isActive: boolean;
  isLocked: boolean;
  lessons: ILesson[];
  totalDuration: number;
  lessonCount: number;
}

interface ICourseSettings {
  allowSkip: boolean;
  showProgress: boolean;
  requireSequential: boolean;
  certificateEnabled: boolean;
  discussionEnabled: boolean;
  notesEnabled: boolean;
  bookmarksEnabled: boolean;
}

interface ICourse {
  _id: string;
  title: string;
  slug: string;
  thumbnail?: string;
  status: string;
  isPublished: boolean;
  modules: IModule[];
  settings: ICourseSettings;
  stats: {
    totalDuration: number;
    moduleCount: number;
    lessonCount: number;
  };
}

// Define the data structure that LessonModal passes to its onSubmit handler
interface LessonSubmitData {
  title: string;
  description?: string;
  type: LessonType; // This must be LessonType
  contentUrl?: string;
  contentText?: string;
  documentUrl?: string;
  // videoDuration is internal to modal, convert to `duration` before submitting
  duration: number; // Ensure this is always a number
  isPreview: boolean;
  isRequired: boolean;
  // isActive and order might be part of the actual action payloads but are not
  // directly captured by LessonModal's current form state for a generic submission.
  // If `updateLesson` needs them, they'd be implicitly handled as optional fields.
}

export default function CourseEditor({ course }: { course: ICourse }) {
  const [modules, setModules] = useState<IModule[]>(course.modules);
  const [expandedModules, setExpandedModules] = useState<Set<string>>(
    new Set()
  );
  const [isLoading, setIsLoading] = useState(false);
  const [showModuleModal, setShowModuleModal] = useState(false);
  const [editingModule, setEditingModule] = useState<IModule | null>(null);
  const [showLessonModal, setShowLessonModal] = useState<string | null>(null);
  const [editingLesson, setEditingLesson] = useState<{
    moduleId: string;
    lesson: ILesson;
  } | null>(null);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const router = useRouter();

  const toggleModule = (moduleId: string) => {
    const newExpanded = new Set(expandedModules);
    if (newExpanded.has(moduleId)) {
      newExpanded.delete(moduleId);
    } else {
      newExpanded.add(moduleId);
    }
    setExpandedModules(newExpanded);
  };

  const handleAddModule = async (data: {
    title: string;
    description?: string;
  }) => {
    setIsLoading(true);
    const result = await addModule(course._id, data);
    setIsLoading(false);
    if (result.success) {
      toast.success(result.message);
      setShowModuleModal(false);
      router.refresh();
    } else {
      toast.error(result.error || "Failed to add module");
    }
  };

  const handleUpdateModule = async (data: {
    title?: string;
    description?: string;
    isActive?: boolean;
    isLocked?: boolean;
  }) => {
    if (!editingModule) return;
    setIsLoading(true);
    const result = await updateModule(course._id, editingModule._id, data);
    setIsLoading(false);
    if (result.success) {
      toast.success(result.message);
      setEditingModule(null);
      router.refresh();
    } else {
      toast.error(result.error || "Failed to update module");
    }
  };

  const handleDeleteModule = async (moduleId: string) => {
    if (!confirm("Delete this module and all its lessons?")) return;
    setIsLoading(true);
    const result = await deleteModule(course._id, moduleId);
    setIsLoading(false);
    if (result.success) {
      toast.success(result.message);
      router.refresh();
    } else {
      toast.error(result.error || "Failed to delete module");
    }
  };

  // Changed data parameter to LessonSubmitData
  const handleAddLesson = async (data: LessonSubmitData) => {
    if (!showLessonModal) return;
    setIsLoading(true);
    // Note: If addLesson action expects `order` or `isActive` directly,
    // you might need to add them to LessonSubmitData and pass them here.
    const result = await addLesson(course._id, showLessonModal, data);
    setIsLoading(false);
    if (result.success) {
      toast.success(result.message);
      setShowLessonModal(null);
      router.refresh();
    } else {
      toast.error(result.error || "Failed to add lesson");
    }
  };

  // Changed data parameter to LessonSubmitData
  const handleUpdateLesson = async (data: LessonSubmitData) => {
    if (!editingLesson) return;
    setIsLoading(true);
    // Note: If updateLesson action expects `isActive` directly,
    // you might need to add it to LessonSubmitData and pass it here.
    const result = await updateLesson(
      course._id,
      editingLesson.moduleId,
      editingLesson.lesson._id,
      data
    );
    setIsLoading(false);
    if (result.success) {
      toast.success(result.message);
      setEditingLesson(null);
      router.refresh();
    } else {
      toast.error(result.error || "Failed to update lesson");
    }
  };

  const handleDeleteLesson = async (moduleId: string, lessonId: string) => {
    if (!confirm("Delete this lesson?")) return;
    setIsLoading(true);
    const result = await deleteLesson(course._id, moduleId, lessonId);
    setIsLoading(false);
    if (result.success) {
      toast.success(result.message);
      router.refresh();
    } else {
      toast.error(result.error || "Failed to delete lesson");
    }
  };

  const handleUpdateSettings = async (settings: Partial<ICourseSettings>) => {
    setIsLoading(true);
    const result = await updateCourseSettings(course._id, settings);
    setIsLoading(false);
    if (result.success) {
      toast.success(result.message);
      setShowSettingsModal(false);
      router.refresh();
    } else {
      toast.error(result.error || "Failed to update settings");
    }
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/super-admin/courses")}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-xl font-bold">{course.title}</h1>
              <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                <span>{course.stats.moduleCount} modules</span>
                <span>{course.stats.lessonCount} lessons</span>
                <span>{Math.floor(course.stats.totalDuration / 60)} min</span>
                <span
                  className={`px-2 py-0.5 rounded text-xs ${
                    course.isPublished
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {course.status}
                </span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowSettingsModal(true)}
              className="px-4 py-2 border rounded-lg hover:bg-gray-50 text-sm"
            >
              Settings
            </button>
            <button
              onClick={() => setShowModuleModal(true)}
              className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 text-sm flex items-center gap-2"
            >
              <Plus className="h-4 w-4" /> Add Module
            </button>
          </div>
        </div>
      </div>

      {/* Modules List */}
      <div className="space-y-4">
        {modules.length === 0 ? (
          <div className="bg-white rounded-xl border p-12 text-center">
            <div className="text-gray-400 mb-4">
              <Video className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium mb-2">No modules yet</h3>
            <p className="text-gray-500 mb-4">
              Start building your course by adding the first module
            </p>
            <button
              onClick={() => setShowModuleModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Add First Module
            </button>
          </div>
        ) : (
          modules.map((module, moduleIndex) => (
            <div
              key={module._id}
              className="bg-white rounded-xl border overflow-hidden"
            >
              {/* Module Header */}
              <div
                className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50"
                onClick={() => toggleModule(module._id)}
              >
                <div className="flex items-center gap-3">
                  <GripVertical className="h-5 w-5 text-gray-400 cursor-grab" />
                  {expandedModules.has(module._id) ? (
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  ) : (
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  )}
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">
                        Module {moduleIndex + 1}
                      </span>
                      <h3 className="font-medium">{module.title}</h3>
                      {!module.isActive && (
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                          Inactive
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-500 mt-0.5">
                      {module.lessons.length} lessons •{" "}
                      {Math.floor(module.totalDuration / 60)} min
                    </div>
                  </div>
                </div>
                <div
                  className="flex items-center gap-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => setShowLessonModal(module._id)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                    title="Add Lesson"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setEditingModule(module)}
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded"
                    title="Edit Module"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteModule(module._id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded"
                    title="Delete Module"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Lessons */}
              {expandedModules.has(module._id) && (
                <div className="border-t bg-gray-50">
                  {module.lessons.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                      <p>No lessons in this module</p>
                      <button
                        onClick={() => setShowLessonModal(module._id)}
                        className="mt-2 text-blue-600 hover:underline text-sm"
                      >
                        Add first lesson
                      </button>
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-200">
                      {module.lessons.map((lesson, lessonIndex) => (
                        <div
                          key={lesson._id}
                          className="p-4 flex items-center justify-between hover:bg-gray-100"
                        >
                          <div className="flex items-center gap-3">
                            <GripVertical className="h-4 w-4 text-gray-400 cursor-grab" />
                            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm">
                              {lessonIndex + 1}
                            </div>
                            {lesson.type === "video" ? (
                              <Video className="h-4 w-4 text-blue-600" />
                            ) : (
                              <FileText className="h-4 w-4 text-green-600" />
                            )}
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-sm">
                                  {lesson.title}
                                </span>
                                {lesson.isPreview && (
                                  <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded">
                                    Preview
                                  </span>
                                )}
                                {!lesson.isActive && (
                                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                                    Inactive
                                  </span>
                                )}
                              </div>
                              <div className="text-xs text-gray-500 mt-0.5">
                                {lesson.type} •{" "}
                                {formatDuration(lesson.duration)}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {lesson.contentUrl && (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            )}
                            <button
                              onClick={() =>
                                setEditingLesson({
                                  moduleId: module._id,
                                  lesson,
                                })
                              }
                              className="p-2 text-gray-600 hover:bg-gray-200 rounded"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() =>
                                handleDeleteLesson(module._id, lesson._id)
                              }
                              className="p-2 text-red-600 hover:bg-red-100 rounded"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Module Modal */}
      {(showModuleModal || editingModule) && (
        <ModuleModal
          module={editingModule}
          onClose={() => {
            setShowModuleModal(false);
            setEditingModule(null);
          }}
          onSubmit={editingModule ? handleUpdateModule : handleAddModule}
          isLoading={isLoading}
        />
      )}

      {/* Lesson Modal */}
      {(showLessonModal || editingLesson) && (
        <LessonModal
          lesson={editingLesson?.lesson}
          onClose={() => {
            setShowLessonModal(null);
            setEditingLesson(null);
          }}
          onSubmit={editingLesson ? handleUpdateLesson : handleAddLesson}
          isLoading={isLoading}
        />
      )}

      {/* Settings Modal */}
      {showSettingsModal && (
        <SettingsModal
          settings={course.settings}
          onClose={() => setShowSettingsModal(false)}
          onSubmit={handleUpdateSettings}
          isLoading={isLoading}
        />
      )}
    </div>
  );
}

// Module Modal (No changes needed)
function ModuleModal({
  module,
  onClose,
  onSubmit,
  isLoading,
}: {
  module?: IModule | null;
  onClose: () => void;
  onSubmit: (data: {
    title: string;
    description?: string;
    isActive?: boolean;
    isLocked?: boolean;
  }) => void;
  isLoading: boolean;
}) {
  const [title, setTitle] = useState(module?.title || "");
  const [description, setDescription] = useState(module?.description || "");
  const [isActive, setIsActive] = useState(module?.isActive ?? true);
  const [isLocked, setIsLocked] = useState(module?.isLocked ?? false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }
    onSubmit({ title, description, isActive, isLocked });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
        <div className="px-6 py-4 border-b flex justify-between items-center">
          <h3 className="font-bold">{module ? "Edit Module" : "Add Module"}</h3>
          <button onClick={onClose}>
            <X className="h-5 w-5 text-gray-400" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Title *</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full mt-1 px-3 py-2 border rounded-md"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full mt-1 px-3 py-2 border rounded-md"
            />
          </div>
          {module && (
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                />
                <span className="text-sm">Active</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={isLocked}
                  onChange={(e) => setIsLocked(e.target.checked)}
                />
                <span className="text-sm">Locked</span>
              </label>
            </div>
          )}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 border rounded-lg"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
              {isLoading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Lesson Modal with Video Upload
function LessonModal({
  lesson,
  onClose,
  onSubmit,
  isLoading: parentLoading,
}: {
  lesson?: ILesson;
  onClose: () => void;
  onSubmit: (data: LessonSubmitData) => void; // Changed to LessonSubmitData
  isLoading: boolean;
}) {
  const [title, setTitle] = useState(lesson?.title || "");
  const [description, setDescription] = useState(lesson?.description || "");
  const [lessonType, setLessonType] = useState<LessonType>(
    lesson?.type || "video"
  ); // Explicitly type state
  const [contentText, setContentText] = useState(lesson?.contentText || "");
  const [contentUrl, setContentUrl] = useState(lesson?.contentUrl || "");
  const [documentUrl, setDocumentUrl] = useState(lesson?.documentUrl || "");
  const [duration, setDuration] = useState(lesson?.duration || 0);
  const [videoDuration, setVideoDuration] = useState<number | undefined>();
  const [isPreview, setIsPreview] = useState(lesson?.isPreview || false);
  const [isRequired, setIsRequired] = useState(lesson?.isRequired !== false);

  const { upload, uploading, progress } = useCloudinaryUpload();
  const videoRef = useRef<HTMLInputElement>(null);
  const documentRef = useRef<HTMLInputElement>(null);

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      toast.loading("Uploading video...", { id: "video-upload" });
      const result = await upload(file, {
        type: "video",
        folder: "courses/videos",
      });
      setContentUrl(result.url);
      if (result.duration) {
        setVideoDuration(result.duration);
        setDuration(Math.round(result.duration));
      }
      toast.success("Video uploaded successfully", { id: "video-upload" });
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to upload video",
        {
          id: "video-upload",
        }
      );
    }
  };

  const handleDocumentUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      toast.loading("Uploading document...", { id: "doc-upload" });
      const result = await upload(file, {
        type: "document",
        folder: "courses/documents",
      });
      setDocumentUrl(result.url);
      toast.success("Document uploaded successfully", { id: "doc-upload" });
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to upload document",
        {
          id: "doc-upload",
        }
      );
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }

    // Ensure `duration` is always a number (e.g., fallback to 0)
    const finalDuration = duration !== undefined ? duration : 0;

    onSubmit({
      title,
      description,
      type: lessonType,
      contentUrl: lessonType === "video" ? contentUrl : undefined,
      contentText: lessonType === "text" ? contentText : undefined,
      documentUrl: lessonType === "document" ? documentUrl : undefined,
      // Removed videoDuration as a direct submit field if it's meant to set `duration`
      duration: finalDuration,
      isPreview,
      isRequired,
    });
  };

  const isLoading = parentLoading || uploading;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b flex justify-between items-center">
          <h3 className="font-bold">{lesson ? "Edit Lesson" : "Add Lesson"}</h3>
          <button onClick={onClose} disabled={isLoading}>
            <X className="h-5 w-5 text-gray-400" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Title *</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              disabled={isLoading}
              className="w-full mt-1 px-3 py-2 border rounded-md disabled:bg-gray-100"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Type</label>
            <select
              value={lessonType}
              onChange={(e) => setLessonType(e.target.value as LessonType)} // Cast to LessonType
              disabled={isLoading}
              className="w-full mt-1 px-3 py-2 border rounded-md disabled:bg-gray-100"
            >
              {LESSON_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {lessonType === "video" && (
            <div>
              <label className="text-sm font-medium text-gray-700">Video</label>
              {contentUrl && !uploading ? (
                <div className="mt-2 relative bg-gray-900 rounded-lg overflow-hidden">
                  <video
                    controls
                    src={contentUrl}
                    className="w-full max-h-64 object-contain"
                  >
                    Your browser does not support the video tag.
                  </video>
                  <button
                    type="button"
                    onClick={() => {
                      setContentUrl(""); // Clear the URL to allow re-upload
                      if (videoRef.current) videoRef.current.value = ""; // Clear file input
                    }}
                    className="absolute top-2 right-2 p-1 bg-black/50 text-white rounded-full hover:bg-black/70"
                    title="Remove video"
                  >
                    <X className="h-4 w-4" />
                  </button>
                  <p className="text-xs text-gray-400 p-2">
                    Current video preview
                  </p>
                </div>
              ) : (
                <div
                  onClick={() => !isLoading && videoRef.current?.click()}
                  className={`mt-1 border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-gray-400 transition ${
                    isLoading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {uploading ? (
                    <div className="space-y-2">
                      <Loader2 className="h-8 w-8 mx-auto text-blue-600 animate-spin" />
                      <p className="text-sm text-gray-600">
                        Uploading... {progress}%
                      </p>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  ) : (
                    <>
                      <Upload className="h-8 w-8 mx-auto text-gray-400" />
                      <p className="mt-2 text-sm text-gray-500">
                        {contentUrl
                          ? "Click to replace video"
                          : "Click to upload video"}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        Supports files up to 500MB
                      </p>
                      {contentUrl && (
                        <p className="text-xs text-green-600 mt-1 flex items-center justify-center gap-1">
                          <CheckCircle className="h-3 w-3" /> Video uploaded
                        </p>
                      )}
                    </>
                  )}
                </div>
              )}
              <input
                ref={videoRef}
                type="file"
                accept="video/*"
                onChange={handleVideoUpload}
                className="hidden"
                disabled={isLoading}
              />
            </div>
          )}

          {lessonType === "text" && (
            <div>
              <label className="text-sm font-medium text-gray-700">
                Content
              </label>
              <textarea
                value={contentText}
                onChange={(e) => setContentText(e.target.value)}
                rows={6}
                disabled={isLoading}
                className="w-full mt-1 px-3 py-2 border rounded-md disabled:bg-gray-100"
              />
            </div>
          )}

          {lessonType === "document" && (
            <div>
              <label className="text-sm font-medium text-gray-700">
                Document
              </label>
              {documentUrl && !uploading ? (
                <div className="mt-2 p-4 border rounded-lg flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-gray-600" />
                    <a
                      href={documentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline text-sm"
                    >
                      View Current Document
                    </a>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setDocumentUrl("");
                      if (documentRef.current) documentRef.current.value = "";
                    }}
                    className="p-1 text-gray-600 hover:bg-gray-100 rounded-full"
                    title="Remove document"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => !isLoading && documentRef.current?.click()}
                  className={`mt-1 border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-gray-400 transition ${
                    isLoading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {uploading ? (
                    <div className="space-y-2">
                      <Loader2 className="h-8 w-8 mx-auto text-blue-600 animate-spin" />
                      <p className="text-sm text-gray-600">
                        Uploading... {progress}%
                      </p>
                    </div>
                  ) : (
                    <>
                      <FileText className="h-8 w-8 mx-auto text-gray-400" />
                      <p className="mt-2 text-sm text-gray-500">
                        {documentUrl
                          ? "Click to replace document"
                          : "Click to upload document"}
                      </p>
                      {documentUrl && (
                        <p className="text-xs text-green-600 mt-1 flex items-center justify-center gap-1">
                          <CheckCircle className="h-3 w-3" /> Document uploaded
                        </p>
                      )}
                    </>
                  )}
                </div>
              )}
              <input
                ref={documentRef}
                type="file"
                accept=".pdf,.doc,.docx,.ppt,.pptx"
                onChange={handleDocumentUpload}
                className="hidden"
                disabled={isLoading}
              />
            </div>
          )}

          <div>
            <label className="text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              disabled={isLoading}
              className="w-full mt-1 px-3 py-2 border rounded-md disabled:bg-gray-100"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              Duration (seconds)
            </label>
            <input
              type="number"
              min="0"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              disabled={isLoading}
              className="w-full mt-1 px-3 py-2 border rounded-md disabled:bg-gray-100"
            />
          </div>

          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={isPreview}
                onChange={(e) => setIsPreview(e.target.checked)}
                disabled={isLoading}
              />
              <span className="text-sm">Free Preview</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={isRequired}
                onChange={(e) => setIsRequired(e.target.checked)}
                disabled={isLoading}
              />
              <span className="text-sm">Required</span>
            </label>
          </div>

          <div className="flex gap-3 pt-4">
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
              className="flex-1 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {parentLoading && <Loader2 className="h-4 w-4 animate-spin" />}
              {parentLoading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Settings Modal (No changes needed)
function SettingsModal({
  settings,
  onClose,
  onSubmit,
  isLoading,
}: {
  settings: ICourseSettings;
  onClose: () => void;
  onSubmit: (settings: Partial<ICourseSettings>) => void;
  isLoading: boolean;
}) {
  const [localSettings, setLocalSettings] = useState(settings);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(localSettings);
  };

  const settingsConfig = [
    { key: "allowSkip", label: "Allow Skip Lessons" },
    { key: "showProgress", label: "Show Progress Bar" },
    { key: "requireSequential", label: "Require Sequential Order" },
    { key: "certificateEnabled", label: "Enable Certificate" },
    { key: "discussionEnabled", label: "Enable Discussion" },
    { key: "notesEnabled", label: "Enable Notes" },
    { key: "bookmarksEnabled", label: "Enable Bookmarks" },
  ] as const;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
        <div className="px-6 py-4 border-b flex justify-between items-center">
          <h3 className="font-bold">Course Settings</h3>
          <button onClick={onClose}>
            <X className="h-5 w-5 text-gray-400" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {settingsConfig.map(({ key, label }) => (
            <label key={key} className="flex items-center justify-between">
              <span className="text-sm">{label}</span>
              <input
                type="checkbox"
                checked={localSettings[key]}
                onChange={(e) =>
                  setLocalSettings((prev) => ({
                    ...prev,
                    [key]: e.target.checked,
                  }))
                }
                className="rounded"
              />
            </label>
          ))}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 border rounded-lg"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
              {isLoading ? "Saving..." : "Save Settings"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
