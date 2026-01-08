// models/AssessmentAttempt.ts

import mongoose, {
  Schema,
  model,
  models,
  Types,
  Document,
  Model,
} from "mongoose";

// Import the Assessment interface to type-check dynamic queries
import type { IAssessment } from "./Assessment";

// ============================================
// TYPES
// ============================================

export type AttemptStatus =
  | "not_started"
  | "in_progress"
  | "completed"
  | "abandoned"
  | "timed_out"
  | "submitted";

// ============================================
// ANSWER INTERFACE
// ============================================

export interface IQuestionAnswer {
  questionId: Types.ObjectId;
  questionType: string;

  // User's answer (flexible based on question type)
  selectedOptionId?: string;
  selectedOptionIds?: string[];
  textAnswer?: string;
  orderedItems?: string[];
  matchedPairs?: Array<{ left: string; right: string }>;
  hotspotClicks?: Array<{ x: number; y: number }>;

  // Scoring
  isCorrect: boolean;
  isPartiallyCorrect: boolean;
  scoreEarned: number;
  maxScore: number;

  // Time tracking
  timeSpentSeconds: number;
  answeredAt?: Date;

  // Flags
  isSkipped: boolean;
  isMarkedForReview: boolean;
  attemptCount: number;
}

// ============================================
// GAMIFICATION RESULT INTERFACE
// ============================================

export interface IGamificationResult {
  basePoints: number;
  timeBonus: number;
  streakBonus: number;
  accuracyBonus: number;
  difficultyBonus: number;
  totalPoints: number;

  // Achievements unlocked
  badgesEarned: Types.ObjectId[];
  milestonesReached: string[];

  // Streak info
  currentStreak: number;
  longestStreak: number;
}

// ============================================
// PROCTORING DATA INTERFACE
// ============================================

export interface IProctoringData {
  webcamEnabled: boolean;
  fullScreenMaintained: boolean;
  tabSwitchCount: number;
  focusLostCount: number;
  suspiciousActivityFlags: Array<{
    type: string;
    timestamp: Date;
    details?: string;
  }>;
  browserInfo?: {
    name: string;
    version: string;
    os: string;
  };
  ipAddress?: string;
}

// ============================================
// ASSESSMENT ATTEMPT INTERFACE
// ============================================

export interface IAssessmentAttempt extends Document {
  _id: Types.ObjectId;

  // References
  assessmentId: Types.ObjectId;
  userId: Types.ObjectId;
  organizationId?: Types.ObjectId;

  // Attempt Info
  attemptNumber: number;
  status: AttemptStatus;

  // Timing
  startedAt: Date;
  completedAt?: Date;
  submittedAt?: Date;
  lastActivityAt: Date;
  timeSpentMinutes: number;
  timeLimitMinutes?: number;
  timeRemainingSeconds?: number;

  // Questions & Answers
  questions: Array<{
    questionId: Types.ObjectId;
    order: number;
    isShuffled: boolean;
  }>;
  answers: IQuestionAnswer[];
  currentQuestionIndex: number;

  // Scoring
  totalScore: number;
  maxPossibleScore: number;
  scorePercent: number;
  isPassed: boolean;
  passingScorePercent: number;

  // Question Stats
  totalQuestions: number;
  answeredCount: number;
  correctCount: number;
  incorrectCount: number;
  skippedCount: number;
  partialCount: number;

  // Skill Scores
  skillScores: Array<{
    skillId: Types.ObjectId;
    skillName?: string;
    score: number;
    maxScore: number;
    percent: number;
    questionsCount: number;
    correctCount: number;
  }>;

  // Gamification
  gamification: IGamificationResult;

  // Proctoring
  proctoring?: IProctoringData;

  // Feedback
  feedback?: {
    rating?: number;
    comment?: string;
    submittedAt?: Date;
  };

  // Review
  isReviewed: boolean;
  reviewedBy?: Types.ObjectId;
  reviewedAt?: Date;
  reviewNotes?: string;

  // Settings snapshot (to preserve even if assessment settings change)
  settingsSnapshot: {
    shuffleQuestions: boolean;
    shuffleOptions: boolean;
    showCorrectAnswers: boolean;
    showExplanations: boolean;
    allowBack: boolean;
  };

  // Timestamps
  createdAt: Date;
  updatedAt: Date;

  // Methods
  saveAnswer(answer: Partial<IQuestionAnswer>): Promise<void>;
  calculateScore(): Promise<void>;
  complete(): Promise<void>;
  abandon(): Promise<void>;
  timeout(): Promise<void>;
}

// ============================================
// STATIC METHODS INTERFACE
// ============================================

export interface IAssessmentAttemptModel extends Model<IAssessmentAttempt> {
  findByUser(
    userId: Types.ObjectId,
    options?: {
      assessmentId?: Types.ObjectId;
      status?: AttemptStatus;
      limit?: number;
    }
  ): Promise<IAssessmentAttempt[]>;
  findByAssessment(
    assessmentId: Types.ObjectId,
    options?: {
      status?: AttemptStatus;
      limit?: number;
    }
  ): Promise<IAssessmentAttempt[]>;
  getAttemptCount(
    userId: Types.ObjectId,
    assessmentId: Types.ObjectId
  ): Promise<number>;
  getLastAttempt(
    userId: Types.ObjectId,
    assessmentId: Types.ObjectId
  ): Promise<IAssessmentAttempt | null>;
  getBestAttempt(
    userId: Types.ObjectId,
    assessmentId: Types.ObjectId
  ): Promise<IAssessmentAttempt | null>;
  getLeaderboard(
    assessmentId: Types.ObjectId,
    limit?: number
  ): Promise<
    Array<{
      userId: Types.ObjectId;
      userName?: string;
      scorePercent: number;
      timeSpentMinutes: number;
      completedAt: Date;
    }>
  >;
  getAnalytics(assessmentId: Types.ObjectId): Promise<{
    totalAttempts: number;
    uniqueUsers: number;
    avgScore: number;
    avgTime: number;
    passRate: number;
    scoreDistribution: Record<string, number>;
    questionAnalysis: Array<{
      questionId: Types.ObjectId;
      correctRate: number;
      avgTime: number;
    }>;
  }>;
}

// ============================================
// QUESTION ANSWER SCHEMA
// ============================================

const QuestionAnswerSchema = new Schema<IQuestionAnswer>(
  {
    questionId: {
      type: Schema.Types.ObjectId,
      required: true,
      index: true,
    },
    questionType: {
      type: String,
      required: true,
    },

    // Answers
    selectedOptionId: { type: String },
    selectedOptionIds: [{ type: String }],
    textAnswer: { type: String, trim: true },
    orderedItems: [{ type: String }],
    matchedPairs: [
      {
        left: { type: String, required: true },
        right: { type: String, required: true },
      },
    ],
    hotspotClicks: [
      {
        x: { type: Number, required: true },
        y: { type: Number, required: true },
      },
    ],

    // Scoring
    isCorrect: { type: Boolean, default: false },
    isPartiallyCorrect: { type: Boolean, default: false },
    scoreEarned: { type: Number, default: 0, min: 0 },
    maxScore: { type: Number, default: 0, min: 0 },

    // Time
    timeSpentSeconds: { type: Number, default: 0, min: 0 },
    answeredAt: { type: Date },

    // Flags
    isSkipped: { type: Boolean, default: false },
    isMarkedForReview: { type: Boolean, default: false },
    attemptCount: { type: Number, default: 0, min: 0 },
  },
  { _id: false }
);

// ============================================
// GAMIFICATION RESULT SCHEMA
// ============================================

const GamificationResultSchema = new Schema<IGamificationResult>(
  {
    basePoints: { type: Number, default: 0 },
    timeBonus: { type: Number, default: 0 },
    streakBonus: { type: Number, default: 0 },
    accuracyBonus: { type: Number, default: 0 },
    difficultyBonus: { type: Number, default: 0 },
    totalPoints: { type: Number, default: 0 },

    badgesEarned: [{ type: Schema.Types.ObjectId, ref: "Badge" }],
    milestonesReached: [{ type: String }],

    currentStreak: { type: Number, default: 0 },
    longestStreak: { type: Number, default: 0 },
  },
  { _id: false }
);

// ============================================
// PROCTORING DATA SCHEMA
// ============================================

const ProctoringDataSchema = new Schema<IProctoringData>(
  {
    webcamEnabled: { type: Boolean, default: false },
    fullScreenMaintained: { type: Boolean, default: true },
    tabSwitchCount: { type: Number, default: 0 },
    focusLostCount: { type: Number, default: 0 },
    suspiciousActivityFlags: [
      {
        type: { type: String, required: true },
        timestamp: { type: Date, required: true },
        details: { type: String },
      },
    ],
    browserInfo: {
      name: { type: String },
      version: { type: String },
      os: { type: String },
    },
    ipAddress: { type: String },
  },
  { _id: false }
);

// ============================================
// SETTINGS SNAPSHOT SCHEMA
// ============================================

const SettingsSnapshotSchema = new Schema(
  {
    shuffleQuestions: { type: Boolean, default: false },
    shuffleOptions: { type: Boolean, default: false },
    showCorrectAnswers: { type: Boolean, default: true },
    showExplanations: { type: Boolean, default: true },
    allowBack: { type: Boolean, default: true },
  },
  { _id: false }
);

// ============================================
// SKILL SCORE SCHEMA
// ============================================

const SkillScoreSchema = new Schema(
  {
    skillId: {
      type: Schema.Types.ObjectId,
      ref: "Skill",
      required: true,
    },
    skillName: { type: String },
    score: { type: Number, default: 0 },
    maxScore: { type: Number, default: 0 },
    percent: { type: Number, default: 0 },
    questionsCount: { type: Number, default: 0 },
    correctCount: { type: Number, default: 0 },
  },
  { _id: false }
);

// ============================================
// ASSESSMENT ATTEMPT SCHEMA
// ============================================

const AssessmentAttemptSchema = new Schema<
  IAssessmentAttempt,
  IAssessmentAttemptModel
>(
  {
    // References
    assessmentId: {
      type: Schema.Types.ObjectId,
      ref: "Assessment",
      required: [true, "Assessment ID is required"],
      index: true,
    },

    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
      index: true,
    },

    organizationId: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
      index: true,
    },

    // Attempt Info
    attemptNumber: {
      type: Number,
      required: true,
      min: 1,
    },

    status: {
      type: String,
      enum: {
        values: [
          "not_started",
          "in_progress",
          "completed",
          "abandoned",
          "timed_out",
          "submitted",
        ],
        message: "{VALUE} is not a valid status",
      },
      default: "not_started",
      index: true,
    },

    // Timing
    startedAt: {
      type: Date,
      required: true,
      default: Date.now,
    },

    completedAt: { type: Date },
    submittedAt: { type: Date },

    lastActivityAt: {
      type: Date,
      default: Date.now,
    },

    timeSpentMinutes: {
      type: Number,
      default: 0,
      min: 0,
    },

    timeLimitMinutes: { type: Number },
    timeRemainingSeconds: { type: Number },

    // Questions
    questions: [
      {
        questionId: {
          type: Schema.Types.ObjectId,
          required: true,
        },
        order: { type: Number, required: true },
        isShuffled: { type: Boolean, default: false },
      },
    ],

    answers: {
      type: [QuestionAnswerSchema],
      default: [],
    },

    currentQuestionIndex: {
      type: Number,
      default: 0,
      min: 0,
    },

    // Scoring
    totalScore: {
      type: Number,
      default: 0,
      min: 0,
    },

    maxPossibleScore: {
      type: Number,
      default: 0,
      min: 0,
    },

    scorePercent: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    isPassed: {
      type: Boolean,
      default: false,
    },

    passingScorePercent: {
      type: Number,
      default: 60,
    },

    // Question Stats
    totalQuestions: { type: Number, default: 0 },
    answeredCount: { type: Number, default: 0 },
    correctCount: { type: Number, default: 0 },
    incorrectCount: { type: Number, default: 0 },
    skippedCount: { type: Number, default: 0 },
    partialCount: { type: Number, default: 0 },

    // Skill Scores
    skillScores: {
      type: [SkillScoreSchema],
      default: [],
    },

    // Gamification
    gamification: {
      type: GamificationResultSchema,
      default: () => ({
        basePoints: 0,
        timeBonus: 0,
        streakBonus: 0,
        accuracyBonus: 0,
        difficultyBonus: 0,
        totalPoints: 0,
        badgesEarned: [],
        milestonesReached: [],
        currentStreak: 0,
        longestStreak: 0,
      }),
    },

    // Proctoring
    proctoring: {
      type: ProctoringDataSchema,
    },

    // Feedback
    feedback: {
      rating: { type: Number, min: 1, max: 5 },
      comment: { type: String, trim: true, maxlength: 2000 },
      submittedAt: { type: Date },
    },

    // Review
    isReviewed: { type: Boolean, default: false },
    reviewedBy: { type: Schema.Types.ObjectId, ref: "User" },
    reviewedAt: { type: Date },
    reviewNotes: { type: String, trim: true },

    // Settings snapshot
    settingsSnapshot: {
      type: SettingsSnapshotSchema,
      default: () => ({
        shuffleQuestions: false,
        shuffleOptions: false,
        showCorrectAnswers: true,
        showExplanations: true,
        allowBack: true,
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

AssessmentAttemptSchema.index({ userId: 1, assessmentId: 1 });
AssessmentAttemptSchema.index({ userId: 1, status: 1 });
AssessmentAttemptSchema.index({ assessmentId: 1, status: 1 });
AssessmentAttemptSchema.index({ assessmentId: 1, scorePercent: -1 });
AssessmentAttemptSchema.index({ organizationId: 1, assessmentId: 1 });
AssessmentAttemptSchema.index({ userId: 1, completedAt: -1 });
AssessmentAttemptSchema.index({ startedAt: -1 });
AssessmentAttemptSchema.index({ "gamification.totalPoints": -1 });

// Compound index for checking max attempts
AssessmentAttemptSchema.index(
  { userId: 1, assessmentId: 1, attemptNumber: 1 },
  { unique: true }
);

// ============================================
// INSTANCE METHODS
// ============================================

AssessmentAttemptSchema.methods.saveAnswer = async function (
  answer: Partial<IQuestionAnswer>
): Promise<void> {
  const existingIndex = this.answers.findIndex(
    (a: IQuestionAnswer) =>
      a.questionId.toString() === answer.questionId?.toString()
  );

  if (existingIndex >= 0) {
    // Update existing answer
    this.answers[existingIndex] = {
      ...this.answers[existingIndex],
      ...answer,
      attemptCount: (this.answers[existingIndex].attemptCount || 0) + 1,
      answeredAt: new Date(),
    };
  } else {
    // Add new answer
    this.answers.push({
      ...answer,
      attemptCount: 1,
      answeredAt: new Date(),
    } as IQuestionAnswer);
  }

  this.lastActivityAt = new Date();
  this.answeredCount = this.answers.filter(
    (a: IQuestionAnswer) => !a.isSkipped
  ).length;
  this.skippedCount = this.answers.filter(
    (a: IQuestionAnswer) => a.isSkipped
  ).length;

  await this.save();
};

AssessmentAttemptSchema.methods.calculateScore =
  async function (): Promise<void> {
    let totalScore = 0;
    let correctCount = 0;
    let incorrectCount = 0;
    let partialCount = 0;

    // Calculate per-question scores
    for (const answer of this.answers) {
      totalScore += answer.scoreEarned || 0;

      if (answer.isCorrect) {
        correctCount++;
      } else if (answer.isPartiallyCorrect) {
        partialCount++;
      } else if (!answer.isSkipped) {
        incorrectCount++;
      }
    }

    this.totalScore = totalScore;
    this.correctCount = correctCount;
    this.incorrectCount = incorrectCount;
    this.partialCount = partialCount;

    // Calculate percentage
    if (this.maxPossibleScore > 0) {
      this.scorePercent = Math.round(
        (totalScore / this.maxPossibleScore) * 100
      );
    }

    // Check if passed
    this.isPassed = this.scorePercent >= this.passingScorePercent;

    // Calculate skill-wise scores
    const skillScoreMap = new Map<
      string,
      {
        score: number;
        maxScore: number;
        count: number;
        correct: number;
      }
    >();

    const Assessment = mongoose.model("Assessment");
    // Cast the result to IAssessment to fix TypeScript error regarding 'questions' property
    const assessment = (await Assessment.findById(
      this.assessmentId
    ).lean()) as IAssessment | null;

    if (assessment && assessment.questions) {
      for (const answer of this.answers) {
        const question = assessment.questions.find(
          (q) => q._id.toString() === answer.questionId.toString()
        );

        if (question && question.skillId) {
          const skillKey = question.skillId.toString();
          const existing = skillScoreMap.get(skillKey) || {
            score: 0,
            maxScore: 0,
            count: 0,
            correct: 0,
          };

          skillScoreMap.set(skillKey, {
            score: existing.score + (answer.scoreEarned || 0),
            maxScore: existing.maxScore + (question.score || 0),
            count: existing.count + 1,
            correct: existing.correct + (answer.isCorrect ? 1 : 0),
          });
        }
      }
    }

    // Convert map to array
    this.skillScores = [];
    for (const [skillId, data] of skillScoreMap) {
      this.skillScores.push({
        skillId: new Types.ObjectId(skillId),
        score: data.score,
        maxScore: data.maxScore,
        percent:
          data.maxScore > 0
            ? Math.round((data.score / data.maxScore) * 100)
            : 0,
        questionsCount: data.count,
        correctCount: data.correct,
      });
    }

    // Calculate gamification points
    await this.calculateGamification();

    await this.save();
  };

// Helper method for gamification calculation
AssessmentAttemptSchema.methods.calculateGamification =
  async function (): Promise<void> {
    const Assessment = mongoose.model("Assessment");
    // Cast result to IAssessment to fix TypeScript error regarding 'settings'
    const assessment = (await Assessment.findById(
      this.assessmentId
    ).lean()) as IAssessment | null;

    if (!assessment || !assessment.settings?.enableGamification) {
      return;
    }

    const multiplier = assessment.settings.pointsMultiplier || 1;

    // Base points from score
    const basePoints = Math.round(this.totalScore * multiplier);

    // Time bonus (if completed faster than average)
    let timeBonus = 0;
    if (
      assessment.settings.bonusTimePoints &&
      assessment.settings.timeLimitMinutes
    ) {
      const expectedTime = assessment.settings.timeLimitMinutes;
      const actualTime = this.timeSpentMinutes;
      if (actualTime < expectedTime * 0.5) {
        timeBonus = Math.round(basePoints * 0.2); // 20% bonus
      } else if (actualTime < expectedTime * 0.75) {
        timeBonus = Math.round(basePoints * 0.1); // 10% bonus
      }
    }

    // Accuracy bonus
    let accuracyBonus = 0;
    if (this.scorePercent >= 90) {
      accuracyBonus = Math.round(basePoints * 0.25);
    } else if (this.scorePercent >= 80) {
      accuracyBonus = Math.round(basePoints * 0.15);
    } else if (this.scorePercent >= 70) {
      accuracyBonus = Math.round(basePoints * 0.05);
    }

    // Streak tracking
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;

    for (const answer of this.answers) {
      if (answer.isCorrect) {
        tempStreak++;
        if (tempStreak > longestStreak) {
          longestStreak = tempStreak;
        }
      } else {
        tempStreak = 0;
      }
    }
    currentStreak = tempStreak;

    // Streak bonus
    let streakBonus = 0;
    if (assessment.settings.streakBonus && longestStreak >= 3) {
      streakBonus = Math.round(longestStreak * 5 * multiplier);
    }

    // Difficulty bonus (based on questions)
    let difficultyBonus = 0;
    if (assessment.questions) {
      const hardQuestions = assessment.questions.filter(
        (q) => q.difficulty === "hard" || q.difficulty === "expert"
      ).length;

      if (hardQuestions > 0 && this.scorePercent >= 70) {
        difficultyBonus = Math.round(hardQuestions * 10 * multiplier);
      }
    }

    const totalPoints =
      basePoints + timeBonus + accuracyBonus + streakBonus + difficultyBonus;

    this.gamification = {
      basePoints,
      timeBonus,
      streakBonus,
      accuracyBonus,
      difficultyBonus,
      totalPoints,
      badgesEarned: [],
      milestonesReached: [],
      currentStreak,
      longestStreak,
    };

    // Check for milestones
    if (this.isPassed && this.attemptNumber === 1) {
      this.gamification.milestonesReached.push("first_try_pass");
    }
    if (this.scorePercent === 100) {
      this.gamification.milestonesReached.push("perfect_score");
    }
    if (longestStreak >= 5) {
      this.gamification.milestonesReached.push("streak_master");
    }
    if (longestStreak >= 10) {
      this.gamification.milestonesReached.push("streak_legend");
    }
  };

AssessmentAttemptSchema.methods.complete = async function (): Promise<void> {
  const now = new Date();

  this.status = "completed";
  this.completedAt = now;
  this.submittedAt = now;

  // Calculate time spent
  const startTime = new Date(this.startedAt).getTime();
  const endTime = now.getTime();
  this.timeSpentMinutes = Math.round((endTime - startTime) / 60000);

  // Calculate final score
  await this.calculateScore();

  // Update user's skill scores
  await this.updateUserSkillScores();

  // Update assessment statistics
  await this.updateAssessmentStats();

  // Award points to user
  await this.awardPointsToUser();

  await this.save();
};

// Helper to update user skill scores
AssessmentAttemptSchema.methods.updateUserSkillScores =
  async function (): Promise<void> {
    const UserSkillScore = mongoose.model("UserSkillScore");

    for (const skillScore of this.skillScores) {
      await UserSkillScore.findOneAndUpdate(
        {
          userId: this.userId,
          skillId: skillScore.skillId,
        },
        {
          $set: {
            previousScore: "$currentScore",
            currentScore: skillScore.percent,
            lastAssessedAt: new Date(),
          },
          $inc: {
            assessmentCount: 1,
          },
          $setOnInsert: {
            userId: this.userId,
            skillId: skillScore.skillId,
            baselineScore: skillScore.percent,
            targetScore: 80,
          },
        },
        {
          upsert: true,
          new: true,
        }
      );
    }
  };

// Helper to update assessment stats
AssessmentAttemptSchema.methods.updateAssessmentStats =
  async function (): Promise<void> {
    const Assessment = mongoose.model("Assessment");
    // Cast to IAssessment so TS knows updateStats method exists
    const assessment = (await Assessment.findById(
      this.assessmentId
    )) as IAssessment | null;

    if (assessment) {
      await assessment.updateStats();
    }
  };

// Helper to award points to user
AssessmentAttemptSchema.methods.awardPointsToUser =
  async function (): Promise<void> {
    if (this.gamification.totalPoints > 0) {
      const User = mongoose.model("User");

      // Cast to a specific type that includes the expected method
      const user = (await User.findById(this.userId)) as
        | (Document & {
            addPoints(points: number): Promise<void>;
          })
        | null;

      if (user) {
        await user.addPoints(this.gamification.totalPoints);
      }
    }
  };

AssessmentAttemptSchema.methods.abandon = async function (): Promise<void> {
  this.status = "abandoned";
  this.lastActivityAt = new Date();
  await this.save();
};

AssessmentAttemptSchema.methods.timeout = async function (): Promise<void> {
  this.status = "timed_out";
  this.completedAt = new Date();

  // Calculate partial score
  await this.calculateScore();

  await this.save();
};

// ============================================
// STATIC METHODS
// ============================================

AssessmentAttemptSchema.statics.findByUser = function (
  userId: Types.ObjectId,
  options?: {
    assessmentId?: Types.ObjectId;
    status?: AttemptStatus;
    limit?: number;
  }
): Promise<IAssessmentAttempt[]> {
  const query: Record<string, unknown> = { userId };

  if (options?.assessmentId) query.assessmentId = options.assessmentId;
  if (options?.status) query.status = options.status;

  return this.find(query)
    .sort({ startedAt: -1 })
    .limit(options?.limit || 50)
    .populate("assessmentId", "title type")
    .exec();
};

AssessmentAttemptSchema.statics.findByAssessment = function (
  assessmentId: Types.ObjectId,
  options?: {
    status?: AttemptStatus;
    limit?: number;
  }
): Promise<IAssessmentAttempt[]> {
  const query: Record<string, unknown> = { assessmentId };

  if (options?.status) query.status = options.status;

  return this.find(query)
    .sort({ startedAt: -1 })
    .limit(options?.limit || 100)
    .populate("userId", "name email avatar")
    .exec();
};

AssessmentAttemptSchema.statics.getAttemptCount = async function (
  userId: Types.ObjectId,
  assessmentId: Types.ObjectId
): Promise<number> {
  return this.countDocuments({ userId, assessmentId });
};

AssessmentAttemptSchema.statics.getLastAttempt = function (
  userId: Types.ObjectId,
  assessmentId: Types.ObjectId
): Promise<IAssessmentAttempt | null> {
  return this.findOne({ userId, assessmentId })
    .sort({ attemptNumber: -1 })
    .exec();
};

AssessmentAttemptSchema.statics.getBestAttempt = function (
  userId: Types.ObjectId,
  assessmentId: Types.ObjectId
): Promise<IAssessmentAttempt | null> {
  return this.findOne({
    userId,
    assessmentId,
    status: "completed",
  })
    .sort({ scorePercent: -1 })
    .exec();
};

AssessmentAttemptSchema.statics.getLeaderboard = async function (
  assessmentId: Types.ObjectId,
  limit = 10
): Promise<
  Array<{
    userId: Types.ObjectId;
    userName?: string;
    scorePercent: number;
    timeSpentMinutes: number;
    completedAt: Date;
  }>
> {
  const results = await this.aggregate([
    {
      $match: {
        assessmentId: new mongoose.Types.ObjectId(assessmentId.toString()),
        status: "completed",
      },
    },
    {
      $sort: { scorePercent: -1, timeSpentMinutes: 1 },
    },
    {
      $group: {
        _id: "$userId",
        bestScore: { $first: "$scorePercent" },
        bestTime: { $first: "$timeSpentMinutes" },
        completedAt: { $first: "$completedAt" },
      },
    },
    {
      $sort: { bestScore: -1, bestTime: 1 },
    },
    {
      $limit: limit,
    },
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "user",
      },
    },
    {
      $unwind: { path: "$user", preserveNullAndEmptyArrays: true },
    },
    {
      $project: {
        userId: "$_id",
        userName: "$user.name",
        scorePercent: "$bestScore",
        timeSpentMinutes: "$bestTime",
        completedAt: 1,
      },
    },
  ]);

  return results;
};

AssessmentAttemptSchema.statics.getAnalytics = async function (
  assessmentId: Types.ObjectId
): Promise<{
  totalAttempts: number;
  uniqueUsers: number;
  avgScore: number;
  avgTime: number;
  passRate: number;
  scoreDistribution: Record<string, number>;
  questionAnalysis: Array<{
    questionId: Types.ObjectId;
    correctRate: number;
    avgTime: number;
  }>;
}> {
  const matchStage = {
    $match: {
      assessmentId: new mongoose.Types.ObjectId(assessmentId.toString()),
      status: "completed",
    },
  };

  // Basic stats
  const basicStats = await this.aggregate([
    matchStage,
    {
      $group: {
        _id: null,
        totalAttempts: { $sum: 1 },
        uniqueUsers: { $addToSet: "$userId" },
        avgScore: { $avg: "$scorePercent" },
        avgTime: { $avg: "$timeSpentMinutes" },
        passCount: {
          $sum: { $cond: ["$isPassed", 1, 0] },
        },
      },
    },
  ]);

  // Score distribution
  const scoreDistribution = await this.aggregate([
    matchStage,
    {
      $bucket: {
        groupBy: "$scorePercent",
        boundaries: [0, 20, 40, 60, 80, 100, 101],
        default: "other",
        output: { count: { $sum: 1 } },
      },
    },
  ]);

  // Question analysis
  const questionAnalysis = await this.aggregate([
    matchStage,
    { $unwind: "$answers" },
    {
      $group: {
        _id: "$answers.questionId",
        correctCount: {
          $sum: { $cond: ["$answers.isCorrect", 1, 0] },
        },
        totalCount: { $sum: 1 },
        avgTime: { $avg: "$answers.timeSpentSeconds" },
      },
    },
    {
      $project: {
        questionId: "$_id",
        correctRate: {
          $multiply: [{ $divide: ["$correctCount", "$totalCount"] }, 100],
        },
        avgTime: 1,
      },
    },
  ]);

  const stats = basicStats[0] || {
    totalAttempts: 0,
    uniqueUsers: [],
    avgScore: 0,
    avgTime: 0,
    passCount: 0,
  };

  const distribution: Record<string, number> = {};
  for (const bucket of scoreDistribution) {
    distribution[`${bucket._id}-${bucket._id + 19}`] = bucket.count;
  }

  return {
    totalAttempts: stats.totalAttempts,
    uniqueUsers: stats.uniqueUsers?.length || 0,
    avgScore: Math.round((stats.avgScore || 0) * 10) / 10,
    avgTime: Math.round((stats.avgTime || 0) * 10) / 10,
    passRate:
      stats.totalAttempts > 0
        ? Math.round((stats.passCount / stats.totalAttempts) * 100)
        : 0,
    scoreDistribution: distribution,
    questionAnalysis,
  };
};

// ============================================
// EXPORT
// ============================================

export const AssessmentAttempt: IAssessmentAttemptModel =
  (models.AssessmentAttempt as IAssessmentAttemptModel) ||
  model<IAssessmentAttempt, IAssessmentAttemptModel>(
    "AssessmentAttempt",
    AssessmentAttemptSchema
  );

export default AssessmentAttempt;
