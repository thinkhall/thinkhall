// models/Assessment.ts

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

export type QuestionType =
  | "mcq"
  | "multiple_select"
  | "true_false"
  | "scenario"
  | "drag_drop"
  | "matching"
  | "ranking"
  | "fill_blank"
  | "timed_decision"
  | "hotspot";

export type DifficultyLevel = "easy" | "medium" | "hard" | "expert";

export type AssessmentType =
  | "skill_assessment"
  | "quiz"
  | "practice"
  | "certification"
  | "baseline"
  | "periodic";

export type AssessmentStatus = "draft" | "published" | "archived";

// ============================================
// QUESTION OPTION INTERFACE
// ============================================

export interface IQuestionOption {
  id: string;
  text: string;
  imageUrl?: string;
  isCorrect: boolean;
  order: number;
  feedback?: string;
  matchWith?: string; // For matching questions
}

// ============================================
// QUESTION INTERFACE
// ============================================

export interface IQuestion {
  _id: Types.ObjectId;

  // Content
  question: string;
  questionHtml?: string;
  imageUrl?: string;
  audioUrl?: string;
  videoUrl?: string;

  // Type & Options
  type: QuestionType;
  options: IQuestionOption[];

  // For different question types
  correctAnswer?: number | number[] | string | string[];
  correctOrder?: string[]; // For ranking questions
  blanks?: Array<{
    id: string;
    correctAnswers: string[];
  }>;
  hotspots?: Array<{
    id: string;
    x: number;
    y: number;
    width: number;
    height: number;
    isCorrect: boolean;
  }>;

  // Scoring
  score: number;
  partialCredit: boolean;
  partialCreditPercentage?: number;
  negativeMarking: boolean;
  negativeMarkValue?: number;

  // Difficulty & Time
  difficulty: DifficultyLevel;
  timeLimit?: number; // seconds (for timed questions)

  // Skill mapping
  skillId?: Types.ObjectId;
  skillCategoryId?: Types.ObjectId;

  // Explanation & Feedback
  explanation?: string;
  explanationHtml?: string;
  hint?: string;

  // Tags & Metadata
  tags: string[];
  order: number;
  isActive: boolean;

  // Statistics (updated over time)
  stats: {
    timesAnswered: number;
    correctCount: number;
    avgTimeSpent: number;
    discriminationIndex?: number;
    difficultyIndex?: number;
  };
}

// ============================================
// ASSESSMENT SETTINGS INTERFACE
// ============================================

export interface IAssessmentSettings {
  // Time
  hasTimeLimit: boolean;
  timeLimitMinutes?: number;

  // Attempts
  maxAttempts: number;
  cooldownHours?: number; // Time between attempts

  // Navigation
  allowSkip: boolean;
  allowBack: boolean;
  shuffleQuestions: boolean;
  shuffleOptions: boolean;

  // Display
  showQuestionNumbers: boolean;
  showProgress: boolean;
  showTimer: boolean;
  questionsPerPage: number;

  // Scoring
  showScoreImmediately: boolean;
  showCorrectAnswers: boolean;
  showExplanations: boolean;
  passingScorePercent: number;

  // Security
  preventCopy: boolean;
  fullScreenRequired: boolean;
  webcamRequired: boolean;

  // Gamification
  enableGamification: boolean;
  pointsMultiplier: number;
  bonusTimePoints: boolean;
  streakBonus: boolean;
}

// ============================================
// ASSESSMENT INTERFACE
// ============================================

export interface IAssessment extends Document {
  _id: Types.ObjectId;

  // Basic Info
  title: string;
  slug: string;
  description?: string;
  instructions?: string;
  thumbnail?: string;

  // Type & Classification
  type: AssessmentType;
  status: AssessmentStatus;

  // Skill Mapping
  skillCategoryId: Types.ObjectId;
  skillId: Types.ObjectId;
  skills?: Array<{
    skillId: Types.ObjectId;
    weight: number;
  }>;

  // Questions
  questions: IQuestion[];
  questionBank?: Types.ObjectId[]; // For random question selection
  randomQuestionCount?: number;

  // Scoring
  totalScore: number;
  passingScore: number;

  // Settings
  settings: IAssessmentSettings;

  // Organization
  organizationId?: Types.ObjectId;

  // Access Control
  visibility: "public" | "organization" | "private";
  allowedOrganizations: Types.ObjectId[];
  allowedRoles: string[];
  allowedLevels: string[];
  prerequisiteAssessmentIds: Types.ObjectId[];
  prerequisiteCourseIds: Types.ObjectId[];

  // Scheduling
  availableFrom?: Date;
  availableUntil?: Date;

  // Version Control
  version: number;
  isPublished: boolean;
  publishedAt?: Date;

  // Creator
  createdBy?: Types.ObjectId;
  lastUpdatedBy?: Types.ObjectId;

  // Statistics
  stats: {
    totalAttempts: number;
    uniqueUsers: number;
    avgScore: number;
    avgTimeMinutes: number;
    passRate: number;
    completionRate: number;
  };

  // Timestamps
  createdAt: Date;
  updatedAt: Date;

  // Virtuals
  displayType?: string;
  displayStatus?: string;
  isAvailable?: boolean;
  questionCount?: number;

  // Methods
  calculateTotalScore(): number;
  publish(): Promise<void>;
  unpublish(): Promise<void>;
  duplicate(): Promise<IAssessment>;
  getRandomQuestions(count: number): IQuestion[];
  updateStats(): Promise<void>;
}

// ============================================
// STATIC METHODS INTERFACE
// ============================================

export interface IAssessmentModel extends Model<IAssessment> {
  findBySkill(skillId: Types.ObjectId): Promise<IAssessment[]>;
  findByCategory(categoryId: Types.ObjectId): Promise<IAssessment[]>;
  findPublished(options?: {
    organizationId?: Types.ObjectId;
    type?: AssessmentType;
    skillId?: Types.ObjectId;
    limit?: number;
  }): Promise<IAssessment[]>;
  findAvailable(userId: Types.ObjectId): Promise<IAssessment[]>;
  search(
    query: string,
    organizationId?: Types.ObjectId
  ): Promise<IAssessment[]>;
}

// ============================================
// QUESTION OPTION SCHEMA
// ============================================

const QuestionOptionSchema = new Schema<IQuestionOption>(
  {
    id: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
      trim: true,
    },
    imageUrl: {
      type: String,
      trim: true,
    },
    isCorrect: {
      type: Boolean,
      default: false,
    },
    order: {
      type: Number,
      default: 0,
    },
    feedback: {
      type: String,
      trim: true,
    },
    matchWith: {
      type: String,
      trim: true,
    },
  },
  { _id: false }
);

// ============================================
// QUESTION STATS SCHEMA
// ============================================

const QuestionStatsSchema = new Schema(
  {
    timesAnswered: { type: Number, default: 0 },
    correctCount: { type: Number, default: 0 },
    avgTimeSpent: { type: Number, default: 0 },
    discriminationIndex: { type: Number },
    difficultyIndex: { type: Number },
  },
  { _id: false }
);

// ============================================
// QUESTION SCHEMA
// ============================================

const QuestionSchema = new Schema<IQuestion>(
  {
    // Content
    question: {
      type: String,
      required: [true, "Question text is required"],
      trim: true,
    },
    questionHtml: {
      type: String,
      trim: true,
    },
    imageUrl: {
      type: String,
      trim: true,
    },
    audioUrl: {
      type: String,
      trim: true,
    },
    videoUrl: {
      type: String,
      trim: true,
    },

    // Type
    type: {
      type: String,
      enum: {
        values: [
          "mcq",
          "multiple_select",
          "true_false",
          "scenario",
          "drag_drop",
          "matching",
          "ranking",
          "fill_blank",
          "timed_decision",
          "hotspot",
        ],
        message: "{VALUE} is not a valid question type",
      },
      default: "mcq",
    },

    // Options
    options: {
      type: [QuestionOptionSchema],
      default: [],
    },

    // Answers
    correctAnswer: {
      type: Schema.Types.Mixed,
    },
    correctOrder: [{ type: String }],
    blanks: [
      {
        id: { type: String, required: true },
        correctAnswers: [{ type: String }],
      },
    ],
    hotspots: [
      {
        id: { type: String, required: true },
        x: { type: Number, required: true },
        y: { type: Number, required: true },
        width: { type: Number, required: true },
        height: { type: Number, required: true },
        isCorrect: { type: Boolean, default: false },
      },
    ],

    // Scoring
    score: {
      type: Number,
      default: 1,
      min: [0, "Score cannot be negative"],
    },
    partialCredit: {
      type: Boolean,
      default: false,
    },
    partialCreditPercentage: {
      type: Number,
      min: 0,
      max: 100,
    },
    negativeMarking: {
      type: Boolean,
      default: false,
    },
    negativeMarkValue: {
      type: Number,
      min: 0,
    },

    // Difficulty & Time
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard", "expert"],
      default: "medium",
    },
    timeLimit: {
      type: Number,
      min: 0,
    },

    // Skill mapping
    skillId: {
      type: Schema.Types.ObjectId,
      ref: "Skill",
    },
    skillCategoryId: {
      type: Schema.Types.ObjectId,
      ref: "SkillCategory",
    },

    // Explanation
    explanation: {
      type: String,
      trim: true,
    },
    explanationHtml: {
      type: String,
      trim: true,
    },
    hint: {
      type: String,
      trim: true,
    },

    // Metadata
    tags: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],
    order: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },

    // Stats
    stats: {
      type: QuestionStatsSchema,
      default: () => ({
        timesAnswered: 0,
        correctCount: 0,
        avgTimeSpent: 0,
      }),
    },
  },
  {
    timestamps: true,
  }
);

// ============================================
// ASSESSMENT SETTINGS SCHEMA
// ============================================

const AssessmentSettingsSchema = new Schema<IAssessmentSettings>(
  {
    // Time
    hasTimeLimit: { type: Boolean, default: false },
    timeLimitMinutes: { type: Number, min: 1 },

    // Attempts
    maxAttempts: { type: Number, default: 3, min: 1 },
    cooldownHours: { type: Number, min: 0 },

    // Navigation
    allowSkip: { type: Boolean, default: true },
    allowBack: { type: Boolean, default: true },
    shuffleQuestions: { type: Boolean, default: false },
    shuffleOptions: { type: Boolean, default: false },

    // Display
    showQuestionNumbers: { type: Boolean, default: true },
    showProgress: { type: Boolean, default: true },
    showTimer: { type: Boolean, default: true },
    questionsPerPage: { type: Number, default: 1, min: 1 },

    // Scoring
    showScoreImmediately: { type: Boolean, default: true },
    showCorrectAnswers: { type: Boolean, default: true },
    showExplanations: { type: Boolean, default: true },
    passingScorePercent: { type: Number, default: 60, min: 0, max: 100 },

    // Security
    preventCopy: { type: Boolean, default: true },
    fullScreenRequired: { type: Boolean, default: false },
    webcamRequired: { type: Boolean, default: false },

    // Gamification
    enableGamification: { type: Boolean, default: true },
    pointsMultiplier: { type: Number, default: 1, min: 0.1, max: 10 },
    bonusTimePoints: { type: Boolean, default: true },
    streakBonus: { type: Boolean, default: true },
  },
  { _id: false }
);

// ============================================
// ASSESSMENT STATS SCHEMA
// ============================================

const AssessmentStatsSchema = new Schema(
  {
    totalAttempts: { type: Number, default: 0 },
    uniqueUsers: { type: Number, default: 0 },
    avgScore: { type: Number, default: 0 },
    avgTimeMinutes: { type: Number, default: 0 },
    passRate: { type: Number, default: 0 },
    completionRate: { type: Number, default: 0 },
  },
  { _id: false }
);

// ============================================
// HELPER FUNCTION
// ============================================

function generateSlug(text: string): string {
  return `${text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .substring(0, 80)}-${Date.now().toString(36)}`;
}

// ============================================
// ASSESSMENT SCHEMA
// ============================================

const AssessmentSchema = new Schema<IAssessment, IAssessmentModel>(
  {
    // Basic Info
    title: {
      type: String,
      required: [true, "Assessment title is required"],
      trim: true,
      minlength: [3, "Title must be at least 3 characters"],
      maxlength: [200, "Title cannot exceed 200 characters"],
      set: function (this: IAssessment, value: string) {
        if (value && !this.slug) {
          this.slug = generateSlug(value);
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

    description: {
      type: String,
      trim: true,
      maxlength: [2000, "Description cannot exceed 2000 characters"],
    },

    instructions: {
      type: String,
      trim: true,
      maxlength: [5000, "Instructions cannot exceed 5000 characters"],
    },

    thumbnail: {
      type: String,
      trim: true,
    },

    // Type & Status
    type: {
      type: String,
      enum: {
        values: [
          "skill_assessment",
          "quiz",
          "practice",
          "certification",
          "baseline",
          "periodic",
        ],
        message: "{VALUE} is not a valid assessment type",
      },
      default: "skill_assessment",
      index: true,
    },

    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
      index: true,
    },

    // Skill Mapping
    skillCategoryId: {
      type: Schema.Types.ObjectId,
      ref: "SkillCategory",
      required: [true, "Skill category is required"],
      index: true,
    },

    skillId: {
      type: Schema.Types.ObjectId,
      ref: "Skill",
      required: [true, "Skill is required"],
      index: true,
    },

    skills: [
      {
        skillId: {
          type: Schema.Types.ObjectId,
          ref: "Skill",
          required: true,
        },
        weight: {
          type: Number,
          default: 1,
          min: 0.1,
          max: 10,
        },
      },
    ],

    // Questions
    questions: {
      type: [QuestionSchema],
      default: [],
    },

    questionBank: [
      {
        type: Schema.Types.ObjectId,
        ref: "Question",
      },
    ],

    randomQuestionCount: {
      type: Number,
      min: 1,
    },

    // Scoring
    totalScore: {
      type: Number,
      default: 0,
      min: 0,
    },

    passingScore: {
      type: Number,
      default: 60,
      min: 0,
    },

    // Settings
    settings: {
      type: AssessmentSettingsSchema,
      default: () => ({
        hasTimeLimit: false,
        maxAttempts: 3,
        allowSkip: true,
        allowBack: true,
        shuffleQuestions: false,
        shuffleOptions: false,
        showQuestionNumbers: true,
        showProgress: true,
        showTimer: true,
        questionsPerPage: 1,
        showScoreImmediately: true,
        showCorrectAnswers: true,
        showExplanations: true,
        passingScorePercent: 60,
        preventCopy: true,
        fullScreenRequired: false,
        webcamRequired: false,
        enableGamification: true,
        pointsMultiplier: 1,
        bonusTimePoints: true,
        streakBonus: true,
      }),
    },

    // Organization
    organizationId: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
      index: true,
    },

    // Access Control
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

    prerequisiteAssessmentIds: [
      {
        type: Schema.Types.ObjectId,
        ref: "Assessment",
      },
    ],

    prerequisiteCourseIds: [
      {
        type: Schema.Types.ObjectId,
        ref: "Course",
      },
    ],

    // Scheduling
    availableFrom: { type: Date },
    availableUntil: { type: Date },

    // Version
    version: {
      type: Number,
      default: 1,
    },

    isPublished: {
      type: Boolean,
      default: false,
      index: true,
    },

    publishedAt: { type: Date },

    // Creator
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

    lastUpdatedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

    // Stats
    stats: {
      type: AssessmentStatsSchema,
      default: () => ({
        totalAttempts: 0,
        uniqueUsers: 0,
        avgScore: 0,
        avgTimeMinutes: 0,
        passRate: 0,
        completionRate: 0,
      }),
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

AssessmentSchema.index({ title: 1 });
AssessmentSchema.index({ organizationId: 1, status: 1 });
AssessmentSchema.index({ organizationId: 1, isPublished: 1 });
AssessmentSchema.index({ skillCategoryId: 1, skillId: 1 });
AssessmentSchema.index({ type: 1, isPublished: 1 });
AssessmentSchema.index({ "skills.skillId": 1 });
AssessmentSchema.index({ availableFrom: 1, availableUntil: 1 });
AssessmentSchema.index({ createdAt: -1 });
AssessmentSchema.index({ "stats.totalAttempts": -1 });

AssessmentSchema.index(
  { title: "text", description: "text", instructions: "text" },
  { weights: { title: 10, description: 3, instructions: 1 } }
);

// ============================================
// VIRTUALS
// ============================================

AssessmentSchema.virtual("displayType").get(function () {
  const typeLabels: Record<AssessmentType, string> = {
    skill_assessment: "Skill Assessment",
    quiz: "Quiz",
    practice: "Practice Test",
    certification: "Certification Exam",
    baseline: "Baseline Assessment",
    periodic: "Periodic Assessment",
  };
  return typeLabels[this.type];
});

AssessmentSchema.virtual("displayStatus").get(function () {
  const statusLabels: Record<AssessmentStatus, string> = {
    draft: "Draft",
    published: "Published",
    archived: "Archived",
  };
  return statusLabels[this.status];
});

AssessmentSchema.virtual("isAvailable").get(function () {
  if (!this.isPublished || this.status !== "published") return false;

  const now = new Date();
  if (this.availableFrom && now < this.availableFrom) return false;
  if (this.availableUntil && now > this.availableUntil) return false;

  return true;
});

AssessmentSchema.virtual("questionCount").get(function () {
  return this.questions.filter((q) => q.isActive).length;
});

// ============================================
// INSTANCE METHODS
// ============================================

AssessmentSchema.methods.calculateTotalScore = function (): number {
  const total = this.questions
    .filter((q: IQuestion) => q.isActive)
    .reduce((sum: number, q: IQuestion) => sum + q.score, 0);

  this.totalScore = total;
  return total;
};

AssessmentSchema.methods.publish = async function (): Promise<void> {
  this.calculateTotalScore();
  this.status = "published";
  this.isPublished = true;
  this.publishedAt = new Date();
  await this.save();
};

AssessmentSchema.methods.unpublish = async function (): Promise<void> {
  this.status = "draft";
  this.isPublished = false;
  await this.save();
};

AssessmentSchema.methods.duplicate = async function (): Promise<IAssessment> {
  const AssessmentModel = mongoose.model<IAssessment>("Assessment");

  const assessmentData = this.toObject();
  delete assessmentData._id;
  delete assessmentData.slug;
  assessmentData.title = `${assessmentData.title} (Copy)`;
  assessmentData.status = "draft";
  assessmentData.isPublished = false;
  assessmentData.publishedAt = undefined;
  assessmentData.version = 1;
  assessmentData.stats = {
    totalAttempts: 0,
    uniqueUsers: 0,
    avgScore: 0,
    avgTimeMinutes: 0,
    passRate: 0,
    completionRate: 0,
  };

  // Generate new IDs for questions
  for (const question of assessmentData.questions) {
    question._id = new Types.ObjectId();
    question.stats = {
      timesAnswered: 0,
      correctCount: 0,
      avgTimeSpent: 0,
    };
  }

  const newAssessment = new AssessmentModel(assessmentData);
  newAssessment.slug = generateSlug(this.slug + "-copy");

  await newAssessment.save();
  return newAssessment;
};

AssessmentSchema.methods.getRandomQuestions = function (
  count: number
): IQuestion[] {
  const activeQuestions = this.questions.filter((q: IQuestion) => q.isActive);

  if (count >= activeQuestions.length) {
    return activeQuestions;
  }

  // Fisher-Yates shuffle
  const shuffled = [...activeQuestions];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled.slice(0, count);
};

AssessmentSchema.methods.updateStats = async function (): Promise<void> {
  const AssessmentAttempt = mongoose.model("AssessmentAttempt");

  const stats = await AssessmentAttempt.aggregate([
    { $match: { assessmentId: this._id, status: "completed" } },
    {
      $group: {
        _id: null,
        totalAttempts: { $sum: 1 },
        uniqueUsers: { $addToSet: "$userId" },
        avgScore: { $avg: "$scorePercent" },
        avgTimeMinutes: { $avg: "$timeSpentMinutes" },
        passCount: {
          $sum: {
            $cond: [
              { $gte: ["$scorePercent", this.settings.passingScorePercent] },
              1,
              0,
            ],
          },
        },
      },
    },
  ]);

  if (stats[0]) {
    this.stats.totalAttempts = stats[0].totalAttempts;
    this.stats.uniqueUsers = stats[0].uniqueUsers.length;
    this.stats.avgScore = Math.round(stats[0].avgScore * 10) / 10;
    this.stats.avgTimeMinutes = Math.round(stats[0].avgTimeMinutes * 10) / 10;
    this.stats.passRate = Math.round(
      (stats[0].passCount / stats[0].totalAttempts) * 100
    );
  }

  await this.save();
};

// ============================================
// STATIC METHODS
// ============================================

AssessmentSchema.statics.findBySkill = function (
  skillId: Types.ObjectId
): Promise<IAssessment[]> {
  return this.find({
    $or: [{ skillId }, { "skills.skillId": skillId }],
    isPublished: true,
    status: "published",
  })
    .sort({ createdAt: -1 })
    .exec();
};

AssessmentSchema.statics.findByCategory = function (
  categoryId: Types.ObjectId
): Promise<IAssessment[]> {
  return this.find({
    skillCategoryId: categoryId,
    isPublished: true,
    status: "published",
  })
    .sort({ createdAt: -1 })
    .exec();
};

AssessmentSchema.statics.findPublished = function (options?: {
  organizationId?: Types.ObjectId;
  type?: AssessmentType;
  skillId?: Types.ObjectId;
  limit?: number;
}): Promise<IAssessment[]> {
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

  if (options?.type) query.type = options.type;
  if (options?.skillId) {
    query.$or = [
      { skillId: options.skillId },
      { "skills.skillId": options.skillId },
    ];
  }

  return this.find(query)
    .sort({ createdAt: -1 })
    .limit(options?.limit || 20)
    .exec();
};

AssessmentSchema.statics.findAvailable = async function (
  userId: Types.ObjectId
): Promise<IAssessment[]> {
  const User = mongoose.model("User");

  // Cast result to ensure organizationId property is recognized
  const user = (await User.findById(userId).lean()) as {
    organizationId?: Types.ObjectId;
  } | null;

  if (!user) return [];

  const now = new Date();

  const query: Record<string, unknown> = {
    isPublished: true,
    status: "published",
    $or: [
      { availableFrom: { $exists: false } },
      { availableFrom: { $lte: now } },
    ],
    $and: [
      {
        $or: [
          { availableUntil: { $exists: false } },
          { availableUntil: { $gte: now } },
        ],
      },
    ],
  };

  // Add organization filter
  const userOrg = user.organizationId;
  if (userOrg) {
    query.$or = [
      { organizationId: userOrg },
      { visibility: "public" },
      { allowedOrganizations: userOrg },
    ];
  }

  return this.find(query).sort({ createdAt: -1 }).exec();
};

AssessmentSchema.statics.search = function (
  query: string,
  organizationId?: Types.ObjectId
): Promise<IAssessment[]> {
  const searchQuery: Record<string, unknown> = {
    isPublished: true,
    status: "published",
    $text: { $search: query },
  };

  if (organizationId) {
    searchQuery.$or = [
      { organizationId },
      { visibility: "public" },
      { allowedOrganizations: organizationId },
    ];
  }

  return this.find(searchQuery, { score: { $meta: "textScore" } })
    .sort({ score: { $meta: "textScore" } })
    .limit(20)
    .exec();
};

// ============================================
// EXPORT
// ============================================

export const Assessment: IAssessmentModel =
  (models.Assessment as IAssessmentModel) ||
  model<IAssessment, IAssessmentModel>("Assessment", AssessmentSchema);

export default Assessment;
