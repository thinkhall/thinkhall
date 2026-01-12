// app/actions/course-management.ts
"use server";

import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import mongoose, { Types } from "mongoose";
import { connectDB } from "@/lib/db";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Course, {
  ICourse,
  IModule,
  ILesson,
  CourseLevel,
  CourseStatus,
  LessonType,
} from "@/models/Course";
import { deleteFromCloudinary, getPublicIdFromUrl } from "@/lib/cloudinary";

// ============================================
// HELPERS
// ============================================

async function checkSuperAdmin() {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== "super_admin") {
    throw new Error("Unauthorized: Super Admin access required");
  }
  return session;
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return Object.values(error.errors)
        .map((err) => err.message)
        .join(", ");
    }
    return error.message;
  }
  return String(error);
}

function generateSlug(text: string, addSuffix = false): string {
  let slug = text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .substring(0, 100);

  if (addSuffix) {
    slug = `${slug}-${Date.now().toString(36)}`;
  }
  return slug;
}

function serializeCourse(course: ICourse) {
  const obj = course.toObject ? course.toObject() : course;
  return JSON.parse(JSON.stringify(obj));
}

// ============================================
// COURSE CRUD
// ============================================

export async function getAllCourses(options?: {
  status?: CourseStatus;
  organizationId?: string;
  limit?: number;
  skip?: number;
}) {
  await checkSuperAdmin();
  await connectDB();

  try {
    const query: Record<string, unknown> = {};
    if (options?.status) query.status = options.status;
    if (options?.organizationId)
      query.organizationId = new Types.ObjectId(options.organizationId);

    const courses = await Course.find(query)
      .sort({ createdAt: -1 })
      .skip(options?.skip || 0)
      .limit(options?.limit || 50)
      .lean();

    const total = await Course.countDocuments(query);

    return {
      success: true,
      data: JSON.parse(JSON.stringify(courses)),
      total,
    };
  } catch (error) {
    console.error("Get All Courses Error:", error);
    return { success: false, error: getErrorMessage(error), data: [] };
  }
}

export async function getCourseById(courseId: string) {
  await checkSuperAdmin();
  await connectDB();

  try {
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return { success: false, error: "Invalid course ID" };
    }

    const course = await Course.findById(courseId).lean();
    if (!course) {
      return { success: false, error: "Course not found" };
    }

    return { success: true, data: JSON.parse(JSON.stringify(course)) };
  } catch (error) {
    console.error("Get Course Error:", error);
    return { success: false, error: getErrorMessage(error) };
  }
}

// Create course with pre-uploaded media URLs
export async function createCourse(data: {
  title: string;
  shortDescription?: string;
  description?: string;
  category?: string;
  subCategory?: string;
  level?: CourseLevel;
  tags?: string[];
  visibility?: string;
  organizationId?: string;
  instructorName?: string;
  instructorBio?: string;
  isMandatory?: boolean;
  isFeatured?: boolean;
  thumbnail?: string; // Pre-uploaded URL
  previewVideoUrl?: string; // Pre-uploaded URL
}) {
  await checkSuperAdmin();
  await connectDB();

  try {
    const courseData = {
      title: data.title.trim(),
      slug: generateSlug(data.title, true),
      shortDescription: data.shortDescription?.trim(),
      description: data.description?.trim(),
      thumbnail: data.thumbnail,
      previewVideoUrl: data.previewVideoUrl,
      category: data.category?.trim(),
      subCategory: data.subCategory?.trim(),
      tags: data.tags || [],
      level: data.level || "beginner",
      visibility: data.visibility || "organization",
      organizationId: data.organizationId
        ? new Types.ObjectId(data.organizationId)
        : undefined,
      instructorName: data.instructorName?.trim(),
      instructorBio: data.instructorBio?.trim(),
      isMandatory: data.isMandatory || false,
      isFeatured: data.isFeatured || false,
      status: "draft" as CourseStatus,
      isPublished: false,
      modules: [],
      settings: {
        allowSkip: false,
        showProgress: true,
        requireSequential: true,
        certificateEnabled: true,
        discussionEnabled: false,
        notesEnabled: true,
        bookmarksEnabled: true,
      },
      pricing: { isFree: true },
      stats: {
        totalDuration: 0,
        moduleCount: 0,
        lessonCount: 0,
        enrollmentCount: 0,
        completionCount: 0,
        avgRating: 0,
        ratingCount: 0,
        avgCompletionTime: 0,
      },
    };

    const course = await Course.create(courseData);

    revalidatePath("/super-admin/courses");
    return {
      success: true,
      message: "Course created successfully",
      data: serializeCourse(course),
    };
  } catch (error) {
    console.error("Create Course Error:", error);
    return { success: false, error: getErrorMessage(error) };
  }
}

export async function updateCourse(
  courseId: string,
  data: {
    title?: string;
    shortDescription?: string;
    description?: string;
    category?: string;
    subCategory?: string;
    level?: CourseLevel;
    tags?: string[];
    visibility?: string;
    organizationId?: string;
    instructorName?: string;
    instructorBio?: string;
    isMandatory?: boolean;
    isFeatured?: boolean;
    thumbnail?: string;
    previewVideoUrl?: string;
  }
) {
  await checkSuperAdmin();
  await connectDB();

  try {
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return { success: false, error: "Invalid course ID" };
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return { success: false, error: "Course not found" };
    }

    const updateData: Record<string, unknown> = {};

    if (data.title) updateData.title = data.title.trim();
    if (data.shortDescription !== undefined)
      updateData.shortDescription = data.shortDescription?.trim();
    if (data.description !== undefined)
      updateData.description = data.description?.trim();
    if (data.category !== undefined)
      updateData.category = data.category?.trim();
    if (data.subCategory !== undefined)
      updateData.subCategory = data.subCategory?.trim();
    if (data.level) updateData.level = data.level;
    if (data.tags) updateData.tags = data.tags;
    if (data.visibility) updateData.visibility = data.visibility;
    if (data.instructorName !== undefined)
      updateData.instructorName = data.instructorName?.trim();
    if (data.instructorBio !== undefined)
      updateData.instructorBio = data.instructorBio?.trim();
    if (data.isMandatory !== undefined)
      updateData.isMandatory = data.isMandatory;
    if (data.isFeatured !== undefined) updateData.isFeatured = data.isFeatured;

    // Handle thumbnail - delete old if new one provided
    if (data.thumbnail && data.thumbnail !== course.thumbnail) {
      if (course.thumbnail) {
        const publicId = getPublicIdFromUrl(course.thumbnail);
        if (publicId) await deleteFromCloudinary(publicId, "image");
      }
      updateData.thumbnail = data.thumbnail;
    }

    // Handle preview video - delete old if new one provided
    if (
      data.previewVideoUrl &&
      data.previewVideoUrl !== course.previewVideoUrl
    ) {
      if (course.previewVideoUrl) {
        const publicId = getPublicIdFromUrl(course.previewVideoUrl);
        if (publicId) await deleteFromCloudinary(publicId, "video");
      }
      updateData.previewVideoUrl = data.previewVideoUrl;
    }

    if (data.organizationId) {
      updateData.organizationId = new Types.ObjectId(data.organizationId);
    }

    await Course.findByIdAndUpdate(courseId, updateData);

    revalidatePath("/super-admin/courses");
    revalidatePath(`/super-admin/courses/${courseId}`);
    return { success: true, message: "Course updated successfully" };
  } catch (error) {
    console.error("Update Course Error:", error);
    return { success: false, error: getErrorMessage(error) };
  }
}

export async function deleteCourse(courseId: string) {
  await checkSuperAdmin();
  await connectDB();

  try {
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return { success: false, error: "Invalid course ID" };
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return { success: false, error: "Course not found" };
    }

    // Delete all media from Cloudinary
    const mediaToDelete: { url: string; type: "video" | "image" | "raw" }[] =
      [];

    if (course.thumbnail) {
      mediaToDelete.push({ url: course.thumbnail, type: "image" });
    }
    if (course.previewVideoUrl) {
      mediaToDelete.push({ url: course.previewVideoUrl, type: "video" });
    }

    // Renamed `module` to `courseModule`
    for (const courseModule of course.modules) {
      for (const lesson of courseModule.lessons) {
        if (lesson.contentUrl && lesson.type === "video") {
          mediaToDelete.push({ url: lesson.contentUrl, type: "video" });
        }
        if (lesson.documentUrl) {
          mediaToDelete.push({ url: lesson.documentUrl, type: "raw" });
        }
      }
    }

    await Promise.allSettled(
      mediaToDelete.map(async (media) => {
        const publicId = getPublicIdFromUrl(media.url);
        if (publicId) await deleteFromCloudinary(publicId, media.type);
      })
    );

    await Course.findByIdAndDelete(courseId);

    revalidatePath("/super-admin/courses");
    return { success: true, message: "Course deleted successfully" };
  } catch (error) {
    console.error("Delete Course Error:", error);
    return { success: false, error: getErrorMessage(error) };
  }
}

export async function publishCourse(courseId: string) {
  await checkSuperAdmin();
  await connectDB();

  try {
    const course = await Course.findById(courseId);
    if (!course) {
      return { success: false, error: "Course not found" };
    }

    if (course.modules.length === 0) {
      return { success: false, error: "Course must have at least one module" };
    }

    // Renamed `m` to `courseModule` to be consistent, though `m` was not an issue.
    const hasLessons = course.modules.some(
      (courseModule: IModule) => courseModule.lessons.length > 0
    );
    if (!hasLessons) {
      return { success: false, error: "Course must have at least one lesson" };
    }

    await course.calculateStats();
    await course.publish();

    revalidatePath("/super-admin/courses");
    revalidatePath(`/super-admin/courses/${courseId}`);
    return { success: true, message: "Course published successfully" };
  } catch (error) {
    console.error("Publish Course Error:", error);
    return { success: false, error: getErrorMessage(error) };
  }
}

export async function unpublishCourse(courseId: string) {
  await checkSuperAdmin();
  await connectDB();

  try {
    const course = await Course.findById(courseId);
    if (!course) {
      return { success: false, error: "Course not found" };
    }

    await course.unpublish();

    revalidatePath("/super-admin/courses");
    revalidatePath(`/super-admin/courses/${courseId}`);
    return { success: true, message: "Course unpublished" };
  } catch (error) {
    console.error("Unpublish Course Error:", error);
    return { success: false, error: getErrorMessage(error) };
  }
}

export async function duplicateCourse(courseId: string) {
  await checkSuperAdmin();
  await connectDB();

  try {
    const course = await Course.findById(courseId);
    if (!course) {
      return { success: false, error: "Course not found" };
    }

    const newCourse = await course.duplicate();

    revalidatePath("/super-admin/courses");
    return {
      success: true,
      message: "Course duplicated successfully",
      data: serializeCourse(newCourse),
    };
  } catch (error) {
    console.error("Duplicate Course Error:", error);
    return { success: false, error: getErrorMessage(error) };
  }
}

// ============================================
// MODULE CRUD
// ============================================

export async function addModule(
  courseId: string,
  data: { title: string; description?: string }
) {
  await checkSuperAdmin();
  await connectDB();

  try {
    const course = await Course.findById(courseId);
    if (!course) {
      return { success: false, error: "Course not found" };
    }

    const newModule = {
      _id: new Types.ObjectId(),
      title: data.title.trim(),
      slug: generateSlug(data.title),
      description: data.description?.trim(),
      order: course.modules.length,
      isActive: true,
      isLocked: false,
      unlockCriteria: { type: "none" as const },
      lessons: [],
      totalDuration: 0,
      lessonCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    course.modules.push(newModule as IModule);
    await course.save();
    await course.calculateStats();

    revalidatePath(`/super-admin/courses/${courseId}`);
    return {
      success: true,
      message: "Module added successfully",
      data: JSON.parse(JSON.stringify(newModule)),
    };
  } catch (error) {
    console.error("Add Module Error:", error);
    return { success: false, error: getErrorMessage(error) };
  }
}

export async function updateModule(
  courseId: string,
  moduleId: string,
  data: {
    title?: string;
    description?: string;
    isActive?: boolean;
    isLocked?: boolean;
  }
) {
  await checkSuperAdmin();
  await connectDB();

  try {
    const course = await Course.findById(courseId);
    if (!course) {
      return { success: false, error: "Course not found" };
    }

    // Renamed `m` to `courseModule` for consistency, though `m` was not an issue.
    const moduleIndex = course.modules.findIndex(
      (courseModule: IModule) => courseModule._id.toString() === moduleId
    );
    if (moduleIndex === -1) {
      return { success: false, error: "Module not found" };
    }

    if (data.title) {
      course.modules[moduleIndex].title = data.title.trim();
      course.modules[moduleIndex].slug = generateSlug(data.title);
    }
    if (data.description !== undefined) {
      course.modules[moduleIndex].description = data.description?.trim();
    }
    if (data.isActive !== undefined) {
      course.modules[moduleIndex].isActive = data.isActive;
    }
    if (data.isLocked !== undefined) {
      course.modules[moduleIndex].isLocked = data.isLocked;
    }
    course.modules[moduleIndex].updatedAt = new Date();

    await course.save();

    revalidatePath(`/super-admin/courses/${courseId}`);
    return { success: true, message: "Module updated successfully" };
  } catch (error) {
    console.error("Update Module Error:", error);
    return { success: false, error: getErrorMessage(error) };
  }
}

export async function deleteModule(courseId: string, moduleId: string) {
  await checkSuperAdmin();
  await connectDB();

  try {
    const course = await Course.findById(courseId);
    if (!course) {
      return { success: false, error: "Course not found" };
    }

    // Renamed `module` to `foundModule`
    const foundModule = course.modules.find(
      (m: IModule) => m._id.toString() === moduleId
    );
    if (!foundModule) {
      return { success: false, error: "Module not found" };
    }

    // Delete all lesson media
    for (const lesson of foundModule.lessons) {
      // Use foundModule here
      if (lesson.contentUrl && lesson.type === "video") {
        const publicId = getPublicIdFromUrl(lesson.contentUrl);
        if (publicId) await deleteFromCloudinary(publicId, "video");
      }
      if (lesson.documentUrl) {
        const publicId = getPublicIdFromUrl(lesson.documentUrl);
        if (publicId) await deleteFromCloudinary(publicId, "raw");
      }
    }

    course.modules = course.modules.filter(
      (m: IModule) => m._id.toString() !== moduleId
    );

    course.modules.forEach((m: IModule, index: number) => {
      m.order = index;
    });

    await course.save();
    await course.calculateStats();

    revalidatePath(`/super-admin/courses/${courseId}`);
    return { success: true, message: "Module deleted successfully" };
  } catch (error) {
    console.error("Delete Module Error:", error);
    return { success: false, error: getErrorMessage(error) };
  }
}

// ============================================
// LESSON CRUD
// ============================================

export async function addLesson(
  courseId: string,
  moduleId: string,
  data: {
    title: string;
    description?: string;
    type?: LessonType;
    contentUrl?: string;
    contentText?: string;
    documentUrl?: string;
    videoDuration?: number;
    duration?: number;
    isPreview?: boolean;
    isRequired?: boolean;
  }
) {
  await checkSuperAdmin();
  await connectDB();

  try {
    const course = await Course.findById(courseId);
    if (!course) {
      return { success: false, error: "Course not found" };
    }

    // Renamed `m` to `courseModule` for consistency, though `m` was not an issue.
    const moduleIndex = course.modules.findIndex(
      (courseModule: IModule) => courseModule._id.toString() === moduleId
    );
    if (moduleIndex === -1) {
      return { success: false, error: "Module not found" };
    }

    const newLesson = {
      _id: new Types.ObjectId(),
      title: data.title.trim(),
      slug: generateSlug(data.title),
      description: data.description?.trim(),
      type: data.type || "video",
      contentUrl: data.contentUrl,
      contentText: data.contentText?.trim(),
      videoProvider: "cloudinary" as const,
      videoDuration: data.videoDuration,
      documentUrl: data.documentUrl,
      duration: data.videoDuration || data.duration || 0,
      order: course.modules[moduleIndex].lessons.length,
      isPreview: data.isPreview || false,
      isRequired: data.isRequired !== false,
      isActive: true,
      completionCriteria: { type: "view" as const },
      resources: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    course.modules[moduleIndex].lessons.push(newLesson as ILesson);
    await course.save();
    await course.calculateStats();

    revalidatePath(`/super-admin/courses/${courseId}`);
    return {
      success: true,
      message: "Lesson added successfully",
      data: JSON.parse(JSON.stringify(newLesson)),
    };
  } catch (error) {
    console.error("Add Lesson Error:", error);
    return { success: false, error: getErrorMessage(error) };
  }
}

export async function updateLesson(
  courseId: string,
  moduleId: string,
  lessonId: string,
  data: {
    title?: string;
    description?: string;
    contentUrl?: string;
    contentText?: string;
    documentUrl?: string;
    videoDuration?: number;
    duration?: number;
    isPreview?: boolean;
    isRequired?: boolean;
    isActive?: boolean;
  }
) {
  await checkSuperAdmin();
  await connectDB();

  try {
    const course = await Course.findById(courseId);
    if (!course) {
      return { success: false, error: "Course not found" };
    }

    // Renamed `m` to `courseModule` for consistency, though `m` was not an issue.
    const moduleIndex = course.modules.findIndex(
      (courseModule: IModule) => courseModule._id.toString() === moduleId
    );
    if (moduleIndex === -1) {
      return { success: false, error: "Module not found" };
    }

    const lessonIndex = course.modules[moduleIndex].lessons.findIndex(
      (l: ILesson) => l._id.toString() === lessonId
    );
    if (lessonIndex === -1) {
      return { success: false, error: "Lesson not found" };
    }

    const lesson = course.modules[moduleIndex].lessons[lessonIndex];

    if (data.title) {
      lesson.title = data.title.trim();
      lesson.slug = generateSlug(data.title);
    }
    if (data.description !== undefined)
      lesson.description = data.description?.trim();
    if (data.contentText !== undefined)
      lesson.contentText = data.contentText?.trim();
    if (data.duration !== undefined) lesson.duration = data.duration;
    if (data.isPreview !== undefined) lesson.isPreview = data.isPreview;
    if (data.isRequired !== undefined) lesson.isRequired = data.isRequired;
    if (data.isActive !== undefined) lesson.isActive = data.isActive;

    // Handle video URL update - delete old if new provided
    if (data.contentUrl && data.contentUrl !== lesson.contentUrl) {
      if (lesson.contentUrl) {
        const publicId = getPublicIdFromUrl(lesson.contentUrl);
        if (publicId) await deleteFromCloudinary(publicId, "video");
      }
      lesson.contentUrl = data.contentUrl;
      lesson.videoDuration = data.videoDuration;
      lesson.duration = data.videoDuration || lesson.duration;
    }

    // Handle document URL update
    if (data.documentUrl && data.documentUrl !== lesson.documentUrl) {
      if (lesson.documentUrl) {
        const publicId = getPublicIdFromUrl(lesson.documentUrl);
        if (publicId) await deleteFromCloudinary(publicId, "raw");
      }
      lesson.documentUrl = data.documentUrl;
    }

    lesson.updatedAt = new Date();
    await course.save();
    await course.calculateStats();

    revalidatePath(`/super-admin/courses/${courseId}`);
    return { success: true, message: "Lesson updated successfully" };
  } catch (error) {
    console.error("Update Lesson Error:", error);
    return { success: false, error: getErrorMessage(error) };
  }
}

export async function deleteLesson(
  courseId: string,
  moduleId: string,
  lessonId: string
) {
  await checkSuperAdmin();
  await connectDB();

  try {
    const course = await Course.findById(courseId);
    if (!course) {
      return { success: false, error: "Course not found" };
    }

    // Renamed `m` to `courseModule` for consistency, though `m` was not an issue.
    const moduleIndex = course.modules.findIndex(
      (courseModule: IModule) => courseModule._id.toString() === moduleId
    );
    if (moduleIndex === -1) {
      return { success: false, error: "Module not found" };
    }

    const lesson = course.modules[moduleIndex].lessons.find(
      (l: ILesson) => l._id.toString() === lessonId
    );
    if (!lesson) {
      return { success: false, error: "Lesson not found" };
    }

    // Delete media
    if (lesson.contentUrl && lesson.type === "video") {
      const publicId = getPublicIdFromUrl(lesson.contentUrl);
      if (publicId) await deleteFromCloudinary(publicId, "video");
    }
    if (lesson.documentUrl) {
      const publicId = getPublicIdFromUrl(lesson.documentUrl);
      if (publicId) await deleteFromCloudinary(publicId, "raw");
    }

    course.modules[moduleIndex].lessons = course.modules[
      moduleIndex
    ].lessons.filter((l: ILesson) => l._id.toString() !== lessonId);

    course.modules[moduleIndex].lessons.forEach((l: ILesson, index: number) => {
      l.order = index;
    });

    await course.save();
    await course.calculateStats();

    revalidatePath(`/super-admin/courses/${courseId}`);
    return { success: true, message: "Lesson deleted successfully" };
  } catch (error) {
    console.error("Delete Lesson Error:", error);
    return { success: false, error: getErrorMessage(error) };
  }
}

// ============================================
// STATS & UTILITIES
// ============================================

export async function getCourseStats() {
  await checkSuperAdmin();
  await connectDB();

  try {
    const [total, published, draft, archived] = await Promise.all([
      Course.countDocuments(),
      Course.countDocuments({ status: "published", isPublished: true }),
      Course.countDocuments({ status: "draft" }),
      Course.countDocuments({ status: "archived" }),
    ]);

    const totalEnrollments = await Course.aggregate([
      { $group: { _id: null, total: { $sum: "$stats.enrollmentCount" } } },
    ]);

    return {
      success: true,
      data: {
        total,
        published,
        draft,
        archived,
        totalEnrollments: totalEnrollments[0]?.total || 0,
      },
    };
  } catch (error) {
    console.error("Get Course Stats Error:", error);
    return { success: false, error: getErrorMessage(error) };
  }
}

export async function updateCourseSettings(
  courseId: string,
  settings: Partial<ICourse["settings"]>
) {
  await checkSuperAdmin();
  await connectDB();

  try {
    const updateObj: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(settings)) {
      updateObj[`settings.${key}`] = value;
    }

    await Course.findByIdAndUpdate(courseId, updateObj);

    revalidatePath(`/super-admin/courses/${courseId}`);
    return { success: true, message: "Settings updated successfully" };
  } catch (error) {
    console.error("Update Settings Error:", error);
    return { success: false, error: getErrorMessage(error) };
  }
}
