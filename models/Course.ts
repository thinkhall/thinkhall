// models/Course.ts

import mongoose, {
  Schema,
  model,
  models,
  Types,
  Document,
  Model,
} from "mongoose";

// ============================================
// TYPES
// ============================================

export type LessonType =
  | "video"
  | "text"
  | "quiz"
  | "interactive"
  | "document"
  | "scorm";
export type CourseLevel = "beginner" | "intermediate" | "advanced" | "expert";
export type CourseStatus = "draft" | "review" | "published" | "archived";

// ============================================
// LESSON INTERFACE
// ============================================

export interface ILesson {
  _id: Types.ObjectId;
  title: string;
  slug: string;
  description?: string;
  type: LessonType;

  // Content
  contentUrl?: string;
  contentText?: string;
  videoProvider?: "cloudinary" | "youtube" | "vimeo" | "custom";
  videoDuration?: number;
  documentUrl?: string;
  scormPackageUrl?: string;

  // Quiz (if type is quiz)
  quizId?: Types.ObjectId;

  // Settings
  duration: number;
  order: number;
  isPreview: boolean;
  isRequired: boolean;
  isActive: boolean;

  // Completion criteria
  completionCriteria: {
    type: "view" | "time" | "quiz_pass" | "manual";
    minTimeSeconds?: number;
    minQuizScore?: number;
  };

  // Resources
  resources: Array<{
    title: string;
    type: "pdf" | "link" | "download";
    url: string;
  }>;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

// ============================================
// MODULE INTERFACE
// ============================================

export interface IModule {
  _id: Types.ObjectId;
  title: string;
  slug: string;
  description?: string;
  order: number;
  isActive: boolean;
  isLocked: boolean;

  // Unlock criteria
  unlockCriteria?: {
    type: "none" | "previous_module" | "date" | "manual";
    unlockDate?: Date;
    requiredModuleId?: Types.ObjectId;
  };

  // Lessons
  lessons: ILesson[];

  // Stats
  totalDuration: number;
  lessonCount: number;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

// ============================================
// COURSE SKILL MAPPING
// ============================================

export interface ICourseSkill {
  categoryId: Types.ObjectId;
  skillId: Types.ObjectId;
  impactScore: number;
  isPrimary: boolean;
}

// ============================================
// COURSE INTERFACE
// ============================================

export interface ICourse extends Document {
  _id: Types.ObjectId;

  // Basic Info
  title: string;
  slug: string;
  shortDescription?: string;
  description?: string;
  thumbnail?: string;
  previewVideoUrl?: string;

  // Classification
  category?: string;
  subCategory?: string;
  tags: string[];
  level: CourseLevel;

  // Skills
  skills: ICourseSkill[];

  // Content
  modules: IModule[];

  // Instructor
  instructorId?: Types.ObjectId;
  instructorName?: string;
  instructorBio?: string;
  instructorAvatar?: string;

  // Organization (null = platform-wide)
  organizationId?: Types.ObjectId;

  // Status & Publishing
  status: CourseStatus;
  isPublished: boolean;
  isFeatured: boolean;
  isMandatory: boolean;
  publishedAt?: Date;

  // Visibility
  visibility: "public" | "organization" | "private";
  allowedOrganizations: Types.ObjectId[];
  allowedRoles: string[];
  allowedLevels: string[];

  // Settings
  settings: {
    allowSkip: boolean;
    showProgress: boolean;
    requireSequential: boolean;
    certificateEnabled: boolean;
    certificateTemplateId?: Types.ObjectId;
    discussionEnabled: boolean;
    notesEnabled: boolean;
    bookmarksEnabled: boolean;
  };

  // Pricing (for future marketplace)
  pricing: {
    isFree: boolean;
    price?: number;
    currency?: string;
    discountPrice?: number;
    discountValidUntil?: Date;
  };

  // Stats (denormalized)
  stats: {
    totalDuration: number;
    moduleCount: number;
    lessonCount: number;
    enrollmentCount: number;
    completionCount: number;
    avgRating: number;
    ratingCount: number;
    avgCompletionTime: number;
  };

  // SEO
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
  };

  // Version control
  version: number;
  lastUpdatedBy?: Types.ObjectId;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;

  // Virtuals
  displayLevel?: string;
  displayStatus?: string;
  isAccessible?: boolean;

  // Methods
  calculateStats(): Promise<void>;
  publish(): Promise<void>;
  unpublish(): Promise<void>;
  archive(): Promise<void>;
  duplicate(): Promise<ICourse>;
}

// ============================================
// STATIC METHODS INTERFACE
// ============================================

export interface ICourseModel extends Model<ICourse> {
  findPublished(options?: {
    organizationId?: Types.ObjectId;
    category?: string;
    level?: CourseLevel;
    skillId?: Types.ObjectId;
    limit?: number;
    skip?: number;
  }): Promise<ICourse[]>;
  findBySkill(skillId: Types.ObjectId): Promise<ICourse[]>;
  findFeatured(organizationId?: Types.ObjectId): Promise<ICourse[]>;
  findMandatory(organizationId: Types.ObjectId): Promise<ICourse[]>;
  search(
    query: string,
    options?: {
      organizationId?: Types.ObjectId;
      limit?: number;
    }
  ): Promise<ICourse[]>;
  getPopular(
    limit?: number,
    organizationId?: Types.ObjectId
  ): Promise<ICourse[]>;
  getRecommendedForSkillGaps(
    skillGaps: Array<{ skillId: Types.ObjectId; gap: number }>,
    limit?: number
  ): Promise<ICourse[]>;
}

// ============================================
// HELPER FUNCTION - Generate Slug
// ============================================

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

// ============================================
// LESSON SCHEMA
// ============================================

const LessonResourceSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    type: {
      type: String,
      enum: ["pdf", "link", "download"],
      required: true,
    },
    url: { type: String, required: true, trim: true },
  },
  { _id: false }
);

const LessonCompletionCriteriaSchema = new Schema(
  {
    type: {
      type: String,
      enum: ["view", "time", "quiz_pass", "manual"],
      default: "view",
    },
    minTimeSeconds: { type: Number, min: 0 },
    minQuizScore: { type: Number, min: 0, max: 100 },
  },
  { _id: false }
);

const LessonSchema = new Schema<ILesson>(
  {
    title: {
      type: String,
      required: [true, "Lesson title is required"],
      trim: true,
      minlength: [2, "Title must be at least 2 characters"],
      maxlength: [200, "Title cannot exceed 200 characters"],
    },

    slug: {
      type: String,
      trim: true,
      lowercase: true,
    },

    description: {
      type: String,
      trim: true,
      maxlength: [1000, "Description cannot exceed 1000 characters"],
    },

    type: {
      type: String,
      enum: {
        values: ["video", "text", "quiz", "interactive", "document", "scorm"],
        message: "{VALUE} is not a valid lesson type",
      },
      default: "video",
    },

    contentUrl: { type: String, trim: true },
    contentText: { type: String },
    videoProvider: {
      type: String,
      enum: ["cloudinary", "youtube", "vimeo", "custom"],
      default: "cloudinary",
    },
    videoDuration: { type: Number, min: 0 },
    documentUrl: { type: String, trim: true },
    scormPackageUrl: { type: String, trim: true },

    quizId: {
      type: Schema.Types.ObjectId,
      ref: "Assessment",
    },

    duration: {
      type: Number,
      default: 0,
      min: 0,
    },

    order: {
      type: Number,
      default: 0,
    },

    isPreview: {
      type: Boolean,
      default: false,
    },

    isRequired: {
      type: Boolean,
      default: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    completionCriteria: {
      type: LessonCompletionCriteriaSchema,
      default: () => ({ type: "view" }),
    },

    resources: {
      type: [LessonResourceSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// ============================================
// MODULE SCHEMA
// ============================================

const ModuleUnlockCriteriaSchema = new Schema(
  {
    type: {
      type: String,
      enum: ["none", "previous_module", "date", "manual"],
      default: "none",
    },
    unlockDate: { type: Date },
    requiredModuleId: { type: Schema.Types.ObjectId },
  },
  { _id: false }
);

const ModuleSchema = new Schema<IModule>(
  {
    title: {
      type: String,
      required: [true, "Module title is required"],
      trim: true,
      minlength: [2, "Title must be at least 2 characters"],
      maxlength: [200, "Title cannot exceed 200 characters"],
    },

    slug: {
      type: String,
      trim: true,
      lowercase: true,
    },

    description: {
      type: String,
      trim: true,
      maxlength: [1000, "Description cannot exceed 1000 characters"],
    },

    order: {
      type: Number,
      default: 0,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    isLocked: {
      type: Boolean,
      default: false,
    },

    unlockCriteria: {
      type: ModuleUnlockCriteriaSchema,
      default: () => ({ type: "none" }),
    },

    lessons: {
      type: [LessonSchema],
      default: [],
    },

    totalDuration: {
      type: Number,
      default: 0,
      min: 0,
    },

    lessonCount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

// ============================================
// COURSE SKILL SCHEMA
// ============================================

const CourseSkillSchema = new Schema<ICourseSkill>(
  {
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "SkillCategory",
      required: true,
    },
    skillId: {
      type: Schema.Types.ObjectId,
      ref: "Skill",
      required: true,
    },
    impactScore: {
      type: Number,
      default: 10,
      min: [1, "Impact score must be at least 1"],
      max: [100, "Impact score cannot exceed 100"],
    },
    isPrimary: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false }
);

// ============================================
// COURSE SUB-SCHEMAS
// ============================================

const CourseSettingsSchema = new Schema(
  {
    allowSkip: { type: Boolean, default: false },
    showProgress: { type: Boolean, default: true },
    requireSequential: { type: Boolean, default: true },
    certificateEnabled: { type: Boolean, default: true },
    certificateTemplateId: {
      type: Schema.Types.ObjectId,
      ref: "CertificateTemplate",
    },
    discussionEnabled: { type: Boolean, default: false },
    notesEnabled: { type: Boolean, default: true },
    bookmarksEnabled: { type: Boolean, default: true },
  },
  { _id: false }
);

const CoursePricingSchema = new Schema(
  {
    isFree: { type: Boolean, default: true },
    price: { type: Number, min: 0 },
    currency: { type: String, default: "INR" },
    discountPrice: { type: Number, min: 0 },
    discountValidUntil: { type: Date },
  },
  { _id: false }
);

const CourseStatsSchema = new Schema(
  {
    totalDuration: { type: Number, default: 0 },
    moduleCount: { type: Number, default: 0 },
    lessonCount: { type: Number, default: 0 },
    enrollmentCount: { type: Number, default: 0 },
    completionCount: { type: Number, default: 0 },
    avgRating: { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 },
    avgCompletionTime: { type: Number, default: 0 },
  },
  { _id: false }
);

const CourseSeoSchema = new Schema(
  {
    metaTitle: { type: String, trim: true, maxlength: 70 },
    metaDescription: { type: String, trim: true, maxlength: 160 },
    keywords: [{ type: String, trim: true }],
  },
  { _id: false }
);

// ============================================
// COURSE SCHEMA
// ============================================

const CourseSchema = new Schema<ICourse, ICourseModel>(
  {
    // Basic Info
    title: {
      type: String,
      required: [true, "Course title is required"],
      trim: true,
      minlength: [3, "Title must be at least 3 characters"],
      maxlength: [200, "Title cannot exceed 200 characters"],
      set: function (this: ICourse, value: string) {
        if (value && !this.slug) {
          this.slug = generateSlug(value, true);
        }
        return value;
      },
    },

    slug: {
      type: String,
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },

    shortDescription: {
      type: String,
      trim: true,
      maxlength: [300, "Short description cannot exceed 300 characters"],
    },

    description: {
      type: String,
      trim: true,
      maxlength: [10000, "Description cannot exceed 10000 characters"],
    },

    thumbnail: {
      type: String,
      trim: true,
    },

    previewVideoUrl: {
      type: String,
      trim: true,
    },

    // Classification
    category: {
      type: String,
      trim: true,
      index: true,
    },

    subCategory: {
      type: String,
      trim: true,
    },

    tags: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],

    level: {
      type: String,
      enum: {
        values: ["beginner", "intermediate", "advanced", "expert"],
        message: "{VALUE} is not a valid level",
      },
      default: "beginner",
      index: true,
    },

    // Skills
    skills: {
      type: [CourseSkillSchema],
      default: [],
    },

    // Content
    modules: {
      type: [ModuleSchema],
      default: [],
    },

    // Instructor
    instructorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

    instructorName: {
      type: String,
      trim: true,
    },

    instructorBio: {
      type: String,
      trim: true,
      maxlength: [1000, "Instructor bio cannot exceed 1000 characters"],
    },

    instructorAvatar: {
      type: String,
      trim: true,
    },

    // Organization
    organizationId: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
      index: true,
    },

    // Status
    status: {
      type: String,
      enum: {
        values: ["draft", "review", "published", "archived"],
        message: "{VALUE} is not a valid status",
      },
      default: "draft",
      index: true,
    },

    isPublished: {
      type: Boolean,
      default: false,
      index: true,
    },

    isFeatured: {
      type: Boolean,
      default: false,
      index: true,
    },

    isMandatory: {
      type: Boolean,
      default: false,
      index: true,
    },

    publishedAt: {
      type: Date,
    },

    // Visibility
    visibility: {
      type: String,
      enum: ["public", "organization", "private"],
      default: "organization",
    },

    allowedOrganizations: [
      {
        type: Schema.Types.ObjectId,
        ref: "Organization",
      },
    ],

    allowedRoles: [{ type: String }],

    allowedLevels: [{ type: String }],

    // Settings
    settings: {
      type: CourseSettingsSchema,
      default: () => ({
        allowSkip: false,
        showProgress: true,
        requireSequential: true,
        certificateEnabled: true,
        discussionEnabled: false,
        notesEnabled: true,
        bookmarksEnabled: true,
      }),
    },

    // Pricing
    pricing: {
      type: CoursePricingSchema,
      default: () => ({ isFree: true }),
    },

    // Stats
    stats: {
      type: CourseStatsSchema,
      default: () => ({
        totalDuration: 0,
        moduleCount: 0,
        lessonCount: 0,
        enrollmentCount: 0,
        completionCount: 0,
        avgRating: 0,
        ratingCount: 0,
        avgCompletionTime: 0,
      }),
    },

    // SEO
    seo: {
      type: CourseSeoSchema,
    },

    // Version
    version: {
      type: Number,
      default: 1,
    },

    lastUpdatedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (_doc, ret: Record<string, unknown>) {
        ret.__v = undefined;
        return ret;
      },
    },
    toObject: { virtuals: true },
  }
);

// ============================================
// INDEXES
// ============================================

CourseSchema.index({ title: 1 });
CourseSchema.index({ organizationId: 1, isPublished: 1 });
CourseSchema.index({ organizationId: 1, status: 1 });
CourseSchema.index({ "skills.skillId": 1 });
CourseSchema.index({ category: 1, level: 1, isPublished: 1 });
CourseSchema.index({ isFeatured: 1, isPublished: 1 });
CourseSchema.index({ isMandatory: 1, organizationId: 1 });
CourseSchema.index({ tags: 1 });
CourseSchema.index({ createdAt: -1 });
CourseSchema.index({ "stats.enrollmentCount": -1 });
CourseSchema.index({ "stats.avgRating": -1 });

CourseSchema.index(
  {
    title: "text",
    shortDescription: "text",
    description: "text",
    tags: "text",
  },
  { weights: { title: 10, shortDescription: 5, tags: 3, description: 1 } }
);

// ============================================
// VIRTUALS
// ============================================

CourseSchema.virtual("displayLevel").get(function () {
  const levelLabels: Record<CourseLevel, string> = {
    beginner: "Beginner",
    intermediate: "Intermediate",
    advanced: "Advanced",
    expert: "Expert",
  };
  return levelLabels[this.level];
});

CourseSchema.virtual("displayStatus").get(function () {
  const statusLabels: Record<CourseStatus, string> = {
    draft: "Draft",
    review: "Under Review",
    published: "Published",
    archived: "Archived",
  };
  return statusLabels[this.status];
});

CourseSchema.virtual("isAccessible").get(function () {
  return this.isPublished && this.status === "published";
});

// ============================================
// INSTANCE METHODS
// ============================================

CourseSchema.methods.calculateStats = async function (): Promise<void> {
  let totalDuration = 0;
  let lessonCount = 0;

  for (const mod of this.modules) {
    const activeLessons = mod.lessons.filter((l: ILesson) => l.isActive);
    mod.lessonCount = activeLessons.length;
    mod.totalDuration = activeLessons.reduce(
      (sum: number, l: ILesson) => sum + (l.duration || 0),
      0
    );

    totalDuration += mod.totalDuration;
    lessonCount += mod.lessonCount;
  }

  this.stats.totalDuration = totalDuration;
  this.stats.moduleCount = this.modules.filter(
    (m: IModule) => m.isActive
  ).length;
  this.stats.lessonCount = lessonCount;

  await this.save();
};

CourseSchema.methods.publish = async function (): Promise<void> {
  this.status = "published";
  this.isPublished = true;
  this.publishedAt = new Date();
  await this.save();
};

CourseSchema.methods.unpublish = async function (): Promise<void> {
  this.status = "draft";
  this.isPublished = false;
  await this.save();
};

CourseSchema.methods.archive = async function (): Promise<void> {
  this.status = "archived";
  this.isPublished = false;
  await this.save();
};

CourseSchema.methods.duplicate = async function (): Promise<ICourse> {
  const CourseModel = mongoose.model<ICourse>("Course");

  const courseData = this.toObject();
  delete courseData._id;
  delete courseData.slug;
  courseData.title = `${courseData.title} (Copy)`;
  courseData.status = "draft";
  courseData.isPublished = false;
  courseData.publishedAt = undefined;
  courseData.stats = {
    totalDuration: courseData.stats.totalDuration,
    moduleCount: courseData.stats.moduleCount,
    lessonCount: courseData.stats.lessonCount,
    enrollmentCount: 0,
    completionCount: 0,
    avgRating: 0,
    ratingCount: 0,
    avgCompletionTime: 0,
  };
  courseData.version = 1;

  // Generate new IDs for modules and lessons
  for (const mod of courseData.modules) {
    mod._id = new Types.ObjectId();
    for (const lesson of mod.lessons) {
      lesson._id = new Types.ObjectId();
    }
  }

  const newCourse = new CourseModel(courseData);
  newCourse.slug = generateSlug(this.slug + "-copy", true);

  await newCourse.save();
  return newCourse;
};

// ============================================
// STATIC METHODS
// ============================================

CourseSchema.statics.findPublished = function (options?: {
  organizationId?: Types.ObjectId;
  category?: string;
  level?: CourseLevel;
  skillId?: Types.ObjectId;
  limit?: number;
  skip?: number;
}): Promise<ICourse[]> {
  const query: Record<string, unknown> = {
    isPublished: true,
    status: "published",
  };

  if (options?.organizationId) {
    query.$or = [
      { organizationId: options.organizationId },
      { visibility: "public" },
      { allowedOrganizations: options.organizationId },
    ];
  }

  if (options?.category) query.category = options.category;
  if (options?.level) query.level = options.level;
  if (options?.skillId) query["skills.skillId"] = options.skillId;

  return this.find(query)
    .sort({ isFeatured: -1, "stats.avgRating": -1, createdAt: -1 })
    .skip(options?.skip || 0)
    .limit(options?.limit || 20)
    .exec();
};

CourseSchema.statics.findBySkill = function (
  skillId: Types.ObjectId
): Promise<ICourse[]> {
  return this.find({
    "skills.skillId": skillId,
    isPublished: true,
    status: "published",
  })
    .sort({ "skills.impactScore": -1 })
    .exec();
};

CourseSchema.statics.findFeatured = function (
  organizationId?: Types.ObjectId
): Promise<ICourse[]> {
  const query: Record<string, unknown> = {
    isPublished: true,
    status: "published",
    isFeatured: true,
  };

  if (organizationId) {
    query.$or = [
      { organizationId },
      { visibility: "public" },
      { allowedOrganizations: organizationId },
    ];
  }

  return this.find(query).sort({ "stats.avgRating": -1 }).limit(10).exec();
};

CourseSchema.statics.findMandatory = function (
  organizationId: Types.ObjectId
): Promise<ICourse[]> {
  return this.find({
    organizationId,
    isMandatory: true,
    isPublished: true,
    status: "published",
  })
    .sort({ title: 1 })
    .exec();
};

CourseSchema.statics.search = function (
  query: string,
  options?: {
    organizationId?: Types.ObjectId;
    limit?: number;
  }
): Promise<ICourse[]> {
  const searchQuery: Record<string, unknown> = {
    isPublished: true,
    status: "published",
    $text: { $search: query },
  };

  if (options?.organizationId) {
    searchQuery.$or = [
      { organizationId: options.organizationId },
      { visibility: "public" },
      { allowedOrganizations: options.organizationId },
    ];
  }

  return this.find(searchQuery, { score: { $meta: "textScore" } })
    .sort({ score: { $meta: "textScore" } })
    .limit(options?.limit || 20)
    .exec();
};

CourseSchema.statics.getPopular = function (
  limit = 10,
  organizationId?: Types.ObjectId
): Promise<ICourse[]> {
  const query: Record<string, unknown> = {
    isPublished: true,
    status: "published",
  };

  if (organizationId) {
    query.$or = [
      { organizationId },
      { visibility: "public" },
      { allowedOrganizations: organizationId },
    ];
  }

  return this.find(query)
    .sort({ "stats.enrollmentCount": -1, "stats.avgRating": -1 })
    .limit(limit)
    .exec();
};

CourseSchema.statics.getRecommendedForSkillGaps = async function (
  skillGaps: Array<{ skillId: Types.ObjectId; gap: number }>,
  limit = 10
): Promise<ICourse[]> {
  const skillIds = skillGaps.map((g) => g.skillId);

  const courses = await this.find({
    "skills.skillId": { $in: skillIds },
    isPublished: true,
    status: "published",
  })
    .lean()
    .exec();

  // Score courses based on skill coverage and gap size
  interface ScoredCourse extends Record<string, unknown> {
    skills: ICourseSkill[];
    relevanceScore: number;
  }

  const scoredCourses: ScoredCourse[] = courses.map((course) => {
    let score = 0;
    const typedCourse = course as unknown as { skills: ICourseSkill[] };
    for (const courseSkill of typedCourse.skills) {
      const gap = skillGaps.find(
        (g) => g.skillId.toString() === courseSkill.skillId.toString()
      );
      if (gap) {
        score += (gap.gap * courseSkill.impactScore) / 100;
      }
    }
    return { ...course, relevanceScore: score } as ScoredCourse;
  });

  // Sort by relevance and return top courses
  scoredCourses.sort((a, b) => b.relevanceScore - a.relevanceScore);

  return scoredCourses.slice(0, limit) as unknown as ICourse[];
};

// ============================================
// EXPORT
// ============================================

export const Course: ICourseModel =
  (models.Course as ICourseModel) ||
  model<ICourse, ICourseModel>("Course", CourseSchema);

export default Course;
