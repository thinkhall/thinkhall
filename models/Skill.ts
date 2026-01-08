// models/Skill.ts

import mongoose, {
  Schema,
  model,
  models,
  Types,
  Document,
  Model,
} from "mongoose";

// ============================================
// SKILL CATEGORY TYPES
// ============================================

export interface ISkillCategory extends Document {
  _id: Types.ObjectId;

  // Basic Info
  name: string;
  code: string;
  description?: string;
  icon?: string;
  color?: string;

  // Organization (null = global/platform-wide)
  organizationId?: Types.ObjectId;

  // Hierarchy
  parentCategoryId?: Types.ObjectId;
  order: number;
  level: number;

  // Status
  isActive: boolean;
  isSystemDefined: boolean;

  // Stats
  skillCount: number;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;

  // Virtuals
  skills?: ISkill[];
  subCategories?: ISkillCategory[];
}

export interface ISkillCategoryModel extends Model<ISkillCategory> {
  findByOrganization(
    organizationId?: Types.ObjectId
  ): Promise<ISkillCategory[]>;
  findWithSkills(categoryId: Types.ObjectId): Promise<ISkillCategory | null>;
  getHierarchy(organizationId?: Types.ObjectId): Promise<ISkillCategory[]>;
}

// ============================================
// SKILL TYPES
// ============================================

export type SkillType =
  | "technical"
  | "soft"
  | "domain"
  | "leadership"
  | "functional";

export interface ISkillBenchmark {
  level: string;
  minScore: number;
  maxScore: number;
  description: string;
}

export interface ISkill extends Document {
  _id: Types.ObjectId;

  // Basic Info
  name: string;
  code: string;
  description?: string;
  categoryId: Types.ObjectId;

  // Classification
  type: SkillType;
  tags: string[];

  // Scoring
  maxScore: number;
  passingScore: number;
  benchmarks: ISkillBenchmark[];

  // Importance
  isCritical: boolean;
  weight: number;

  // Organization (null = global/platform-wide)
  organizationId?: Types.ObjectId;

  // Related Content
  relatedCourseIds: Types.ObjectId[];
  relatedAssessmentIds: Types.ObjectId[];

  // Status
  isActive: boolean;
  isSystemDefined: boolean;
  order: number;

  // Stats
  assessmentCount: number;
  avgScore: number;
  usersAssessed: number;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;

  // Virtuals
  category?: ISkillCategory;
  displayType?: string;
}

// ============================================
// ROLE COMPETENCY TYPE (for getSkillGaps)
// ============================================

interface IRoleCompetencySkill {
  skillId: Types.ObjectId;
  requiredScore: number;
  isCritical: boolean;
  weight: number;
}

interface IRoleCompetencyLean {
  _id: Types.ObjectId;
  skills?: IRoleCompetencySkill[];
}

// ============================================
// SKILL MODEL INTERFACE
// ============================================

export interface ISkillModel extends Model<ISkill> {
  findByCategory(categoryId: Types.ObjectId): Promise<ISkill[]>;
  findByOrganization(organizationId?: Types.ObjectId): Promise<ISkill[]>;
  findCritical(organizationId?: Types.ObjectId): Promise<ISkill[]>;
  search(query: string, organizationId?: Types.ObjectId): Promise<ISkill[]>;
  getSkillGaps(
    userScores: Array<{ skillId: Types.ObjectId; score: number }>,
    targetRoleId: Types.ObjectId
  ): Promise<Array<{ skill: ISkill; gap: number; priority: string }>>;
}

// ============================================
// SKILL CATEGORY SCHEMA
// ============================================

const SkillCategorySchema = new Schema<ISkillCategory, ISkillCategoryModel>(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [100, "Name cannot exceed 100 characters"],
    },

    code: {
      type: String,
      required: [true, "Category code is required"],
      uppercase: true,
      trim: true,
      minlength: [2, "Code must be at least 2 characters"],
      maxlength: [20, "Code cannot exceed 20 characters"],
      match: [
        /^[A-Z0-9_-]+$/,
        "Code can only contain letters, numbers, hyphens, and underscores",
      ],
    },

    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
    },

    icon: {
      type: String,
      trim: true,
    },

    color: {
      type: String,
      trim: true,
      match: [/^#[0-9A-Fa-f]{6}$/, "Please provide a valid hex color"],
      default: "#FBBF24",
    },

    organizationId: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
      index: true,
    },

    parentCategoryId: {
      type: Schema.Types.ObjectId,
      ref: "SkillCategory",
      index: true,
    },

    order: {
      type: Number,
      default: 0,
    },

    level: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },

    isSystemDefined: {
      type: Boolean,
      default: false,
    },

    skillCount: {
      type: Number,
      default: 0,
      min: 0,
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
// SKILL CATEGORY INDEXES
// ============================================

SkillCategorySchema.index({ code: 1, organizationId: 1 }, { unique: true });
SkillCategorySchema.index({ organizationId: 1, isActive: 1 });
SkillCategorySchema.index({ parentCategoryId: 1 });
SkillCategorySchema.index({ order: 1 });
SkillCategorySchema.index(
  { name: "text", description: "text" },
  { weights: { name: 2, description: 1 } }
);

// ============================================
// SKILL CATEGORY VIRTUALS
// ============================================

SkillCategorySchema.virtual("skills", {
  ref: "Skill",
  localField: "_id",
  foreignField: "categoryId",
  match: { isActive: true },
});

SkillCategorySchema.virtual("subCategories", {
  ref: "SkillCategory",
  localField: "_id",
  foreignField: "parentCategoryId",
  match: { isActive: true },
});

// ============================================
// SKILL CATEGORY STATICS
// ============================================

SkillCategorySchema.statics.findByOrganization = function (
  organizationId?: Types.ObjectId
): Promise<ISkillCategory[]> {
  const query: Record<string, unknown> = { isActive: true };

  if (organizationId) {
    query.$or = [
      { organizationId: organizationId },
      { organizationId: { $exists: false } },
      { isSystemDefined: true },
    ];
  } else {
    query.$or = [
      { organizationId: { $exists: false } },
      { isSystemDefined: true },
    ];
  }

  return this.find(query).sort({ order: 1, name: 1 }).exec();
};

SkillCategorySchema.statics.findWithSkills = function (
  categoryId: Types.ObjectId
): Promise<ISkillCategory | null> {
  return this.findById(categoryId)
    .populate({
      path: "skills",
      match: { isActive: true },
      options: { sort: { order: 1, name: 1 } },
    })
    .exec();
};

SkillCategorySchema.statics.getHierarchy = async function (
  organizationId?: Types.ObjectId
): Promise<ISkillCategory[]> {
  const query: Record<string, unknown> = {
    isActive: true,
    parentCategoryId: { $exists: false },
  };

  if (organizationId) {
    query.$or = [
      { organizationId: organizationId },
      { organizationId: { $exists: false } },
      { isSystemDefined: true },
    ];
  }

  return this.find(query)
    .populate({
      path: "subCategories",
      match: { isActive: true },
      options: { sort: { order: 1 } },
      populate: {
        path: "skills",
        match: { isActive: true },
        options: { sort: { order: 1 } },
      },
    })
    .populate({
      path: "skills",
      match: { isActive: true },
      options: { sort: { order: 1 } },
    })
    .sort({ order: 1, name: 1 })
    .exec();
};

// ============================================
// SKILL SCHEMA
// ============================================

const SkillBenchmarkSchema = new Schema<ISkillBenchmark>(
  {
    level: {
      type: String,
      required: true,
      enum: ["beginner", "intermediate", "advanced", "expert", "master"],
    },
    minScore: {
      type: Number,
      required: true,
      min: 0,
    },
    maxScore: {
      type: Number,
      required: true,
      min: 0,
    },
    description: {
      type: String,
      trim: true,
    },
  },
  { _id: false }
);

const SkillSchema = new Schema<ISkill, ISkillModel>(
  {
    name: {
      type: String,
      required: [true, "Skill name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [100, "Name cannot exceed 100 characters"],
    },

    code: {
      type: String,
      required: [true, "Skill code is required"],
      uppercase: true,
      trim: true,
      minlength: [2, "Code must be at least 2 characters"],
      maxlength: [30, "Code cannot exceed 30 characters"],
      match: [
        /^[A-Z0-9_-]+$/,
        "Code can only contain letters, numbers, hyphens, and underscores",
      ],
    },

    description: {
      type: String,
      trim: true,
      maxlength: [1000, "Description cannot exceed 1000 characters"],
    },

    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "SkillCategory",
      required: [true, "Category is required"],
      index: true,
    },

    type: {
      type: String,
      enum: {
        values: ["technical", "soft", "domain", "leadership", "functional"],
        message: "{VALUE} is not a valid skill type",
      },
      default: "technical",
      index: true,
    },

    tags: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],

    maxScore: {
      type: Number,
      default: 100,
      min: [1, "Max score must be at least 1"],
      max: [1000, "Max score cannot exceed 1000"],
    },

    passingScore: {
      type: Number,
      default: 60,
      min: [0, "Passing score cannot be negative"],
    },

    benchmarks: {
      type: [SkillBenchmarkSchema],
      default: () => [
        {
          level: "beginner",
          minScore: 0,
          maxScore: 20,
          description: "Basic understanding",
        },
        {
          level: "intermediate",
          minScore: 21,
          maxScore: 40,
          description: "Working knowledge",
        },
        {
          level: "advanced",
          minScore: 41,
          maxScore: 60,
          description: "Strong proficiency",
        },
        {
          level: "expert",
          minScore: 61,
          maxScore: 80,
          description: "Deep expertise",
        },
        {
          level: "master",
          minScore: 81,
          maxScore: 100,
          description: "Industry leader",
        },
      ],
    },

    isCritical: {
      type: Boolean,
      default: false,
      index: true,
    },

    weight: {
      type: Number,
      default: 1,
      min: [0.1, "Weight must be at least 0.1"],
      max: [10, "Weight cannot exceed 10"],
    },

    organizationId: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
      index: true,
    },

    relatedCourseIds: [
      {
        type: Schema.Types.ObjectId,
        ref: "Course",
      },
    ],

    relatedAssessmentIds: [
      {
        type: Schema.Types.ObjectId,
        ref: "Assessment",
      },
    ],

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },

    isSystemDefined: {
      type: Boolean,
      default: false,
    },

    order: {
      type: Number,
      default: 0,
    },

    assessmentCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    avgScore: {
      type: Number,
      default: 0,
      min: 0,
    },

    usersAssessed: {
      type: Number,
      default: 0,
      min: 0,
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
// SKILL INDEXES
// ============================================

SkillSchema.index({ code: 1, organizationId: 1 }, { unique: true });
SkillSchema.index({ categoryId: 1, isActive: 1 });
SkillSchema.index({ organizationId: 1, isActive: 1 });
SkillSchema.index({ type: 1, isActive: 1 });
SkillSchema.index({ isCritical: 1, isActive: 1 });
SkillSchema.index({ tags: 1 });
SkillSchema.index({ order: 1 });
SkillSchema.index(
  { name: "text", description: "text", tags: "text" },
  { weights: { name: 3, tags: 2, description: 1 } }
);

// ============================================
// SKILL VIRTUALS
// ============================================

SkillSchema.virtual("category", {
  ref: "SkillCategory",
  localField: "categoryId",
  foreignField: "_id",
  justOne: true,
});

SkillSchema.virtual("displayType").get(function () {
  const typeLabels: Record<SkillType, string> = {
    technical: "Technical",
    soft: "Soft Skill",
    domain: "Domain",
    leadership: "Leadership",
    functional: "Functional",
  };
  return typeLabels[this.type];
});

// ============================================
// SKILL STATICS
// ============================================

SkillSchema.statics.findByCategory = function (
  categoryId: Types.ObjectId
): Promise<ISkill[]> {
  return this.find({ categoryId, isActive: true })
    .sort({ order: 1, name: 1 })
    .exec();
};

SkillSchema.statics.findByOrganization = function (
  organizationId?: Types.ObjectId
): Promise<ISkill[]> {
  const query: Record<string, unknown> = { isActive: true };

  if (organizationId) {
    query.$or = [
      { organizationId: organizationId },
      { organizationId: { $exists: false } },
      { isSystemDefined: true },
    ];
  } else {
    query.$or = [
      { organizationId: { $exists: false } },
      { isSystemDefined: true },
    ];
  }

  return this.find(query)
    .populate("category", "name code color")
    .sort({ order: 1, name: 1 })
    .exec();
};

SkillSchema.statics.findCritical = function (
  organizationId?: Types.ObjectId
): Promise<ISkill[]> {
  const query: Record<string, unknown> = {
    isActive: true,
    isCritical: true,
  };

  if (organizationId) {
    query.$or = [
      { organizationId: organizationId },
      { organizationId: { $exists: false } },
    ];
  }

  return this.find(query)
    .populate("category", "name code color")
    .sort({ weight: -1, name: 1 })
    .exec();
};

SkillSchema.statics.search = function (
  query: string,
  organizationId?: Types.ObjectId
): Promise<ISkill[]> {
  const searchQuery: Record<string, unknown> = {
    isActive: true,
    $text: { $search: query },
  };

  if (organizationId) {
    searchQuery.$or = [
      { organizationId: organizationId },
      { organizationId: { $exists: false } },
    ];
  }

  return this.find(searchQuery, { score: { $meta: "textScore" } })
    .sort({ score: { $meta: "textScore" } })
    .limit(20)
    .populate("category", "name code color")
    .exec();
};

SkillSchema.statics.getSkillGaps = async function (
  userScores: Array<{ skillId: Types.ObjectId; score: number }>,
  targetRoleId: Types.ObjectId
): Promise<Array<{ skill: ISkill; gap: number; priority: string }>> {
  // Get RoleCompetency model dynamically to avoid circular dependency
  const RoleCompetency = mongoose.model("RoleCompetency");

  // Fetch role and cast to proper type
  const role = (await RoleCompetency.findById(targetRoleId)
    .lean()
    .exec()) as IRoleCompetencyLean | null;

  if (!role || !role.skills || !Array.isArray(role.skills)) {
    return [];
  }

  const gaps: Array<{ skill: ISkill; gap: number; priority: string }> = [];

  for (const roleSkill of role.skills) {
    const userScore = userScores.find(
      (s) => s.skillId.toString() === roleSkill.skillId.toString()
    );

    const currentScore = userScore?.score || 0;
    const gap = roleSkill.requiredScore - currentScore;

    if (gap > 0) {
      const skill = await this.findById(roleSkill.skillId).exec();
      if (skill) {
        let priority = "low";
        if (roleSkill.isCritical || gap > 30) priority = "high";
        else if (gap > 15) priority = "medium";

        gaps.push({ skill, gap, priority });
      }
    }
  }

  // Sort by priority
  const priorityOrder: Record<string, number> = { high: 0, medium: 1, low: 2 };
  return gaps.sort(
    (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]
  );
};

// ============================================
// EXPORTS
// ============================================

export const SkillCategory: ISkillCategoryModel =
  (models.SkillCategory as ISkillCategoryModel) ||
  model<ISkillCategory, ISkillCategoryModel>(
    "SkillCategory",
    SkillCategorySchema
  );

export const Skill: ISkillModel =
  (models.Skill as ISkillModel) ||
  model<ISkill, ISkillModel>("Skill", SkillSchema);

export default { SkillCategory, Skill };
