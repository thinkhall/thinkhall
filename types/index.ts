// types/index.ts

import { Types } from "mongoose";

// ============================================
// USER & AUTH TYPES
// ============================================

export type UserRole =
  | "employee"
  | "team_lead"
  | "manager"
  | "org_admin"
  | "super_admin";

export type UserLevel = "entry" | "mid" | "senior" | "lead" | "executive";

export interface IUser {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  level: UserLevel;
  organizationId?: Types.ObjectId;
  managerId?: Types.ObjectId;
  teamId?: Types.ObjectId;
  departmentId?: Types.ObjectId;
  designation?: string;
  avatar?: string;
  phone?: string;
  location?: string;
  timezone?: string;
  isActive: boolean;
  isEmailVerified: boolean;
  lastLoginAt?: Date;
  preferences: {
    emailNotifications: boolean;
    whatsappNotifications: boolean;
    pushNotifications: boolean;
    language: string;
    theme: "light" | "dark" | "system";
  };
  onboardingCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================
// ORGANIZATION TYPES
// ============================================

export type PlanType = "trial" | "basic" | "pro" | "enterprise";

export interface IOrganization {
  _id: Types.ObjectId;
  name: string;
  code: string;
  industry?: string;
  size?: "small" | "medium" | "large" | "enterprise";
  logo?: string;
  website?: string;
  planType: PlanType;
  maxUsers: number;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  settings: {
    allowSelfRegistration: boolean;
    requireManagerApproval: boolean;
    enableGamification: boolean;
    enableLeaderboards: boolean;
    enableBenchmarking: boolean;
    customBranding?: {
      primaryColor: string;
      logo: string;
    };
  };
  createdAt: Date;
  updatedAt: Date;
}

// ============================================
// SKILL & ASSESSMENT TYPES
// ============================================

export interface ISkillCategory {
  _id: Types.ObjectId;
  name: string;
  description?: string;
  icon?: string;
  color?: string;
  order: number;
  isActive: boolean;
}

export interface ISkill {
  _id: Types.ObjectId;
  categoryId: Types.ObjectId;
  name: string;
  description?: string;
  maxScore: number;
  benchmarkScore: number;
  isActive: boolean;
  isCritical: boolean;
}

export interface IAssessmentQuestion {
  question: string;
  type: "mcq" | "scenario" | "drag_drop" | "timed_decision" | "ranking";
  options: string[];
  correctAnswer: number | number[];
  score: number;
  difficulty: "easy" | "medium" | "hard";
  timeLimit?: number;
  explanation?: string;
  skillId: Types.ObjectId;
}

export interface IAssessment {
  _id: Types.ObjectId;
  title: string;
  description?: string;
  skillCategoryId: Types.ObjectId;
  skillId: Types.ObjectId;
  questions: IAssessmentQuestion[];
  totalScore: number;
  passScore: number;
  duration: number;
  isGamified: boolean;
  isActive: boolean;
}

// ============================================
// COURSE & LEARNING TYPES
// ============================================

export interface ILesson {
  _id: Types.ObjectId;
  title: string;
  type: "video" | "text" | "quiz" | "interactive";
  contentUrl?: string;
  contentText?: string;
  duration: number;
  order: number;
  isActive: boolean;
}

export interface IModule {
  _id: Types.ObjectId;
  title: string;
  description?: string;
  order: number;
  lessons: ILesson[];
  isActive: boolean;
}

export interface ICourse {
  _id: Types.ObjectId;
  title: string;
  description?: string;
  thumbnail?: string;
  category?: string;
  skills: Array<{
    categoryId: Types.ObjectId;
    skillId: Types.ObjectId;
    impactScore: number;
  }>;
  modules: IModule[];
  totalDuration: number;
  difficulty: UserLevel;
  isPublished: boolean;
  isMandatory: boolean;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

// ============================================
// NUDGE TYPES
// ============================================

export type NudgeType =
  | "learning_reminder"
  | "streak_motivation"
  | "skill_gap_alert"
  | "course_recommendation"
  | "achievement_celebration"
  | "deadline_warning"
  | "peer_comparison"
  | "manager_feedback";

export type NudgeChannel = "email" | "whatsapp" | "push" | "in_app";

export type NudgeStatus =
  | "pending"
  | "sent"
  | "viewed"
  | "clicked"
  | "completed"
  | "failed";

export interface INudge {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  type: NudgeType;
  channel: NudgeChannel;
  title: string;
  message: string;
  actionUrl?: string;
  actionLabel?: string;
  status: NudgeStatus;
  sentAt?: Date;
  viewedAt?: Date;
  clickedAt?: Date;
  completedAt?: Date;
  metadata?: Record<string, unknown>;
  createdAt: Date;
}

// ============================================
// PROGRESS & TRACKING TYPES
// ============================================

export interface IUserSkillScore {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  skillId: Types.ObjectId;
  categoryId: Types.ObjectId;
  currentScore: number;
  previousScore: number;
  baselineScore: number;
  targetScore: number;
  assessmentCount: number;
  lastAssessedAt: Date;
  trend: "improving" | "stable" | "declining";
  percentile?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserCourseProgress {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  courseId: Types.ObjectId;
  status: "not_started" | "in_progress" | "completed" | "abandoned";
  progressPercent: number;
  completedModules: Types.ObjectId[];
  completedLessons: Types.ObjectId[];
  timeSpent: number;
  startedAt?: Date;
  completedAt?: Date;
  lastAccessedAt?: Date;
  quizScores: Array<{
    lessonId: Types.ObjectId;
    score: number;
    maxScore: number;
    attemptedAt: Date;
  }>;
}

// ============================================
// CAREER & PROGRESSION TYPES
// ============================================

export interface IRoleCompetency {
  _id: Types.ObjectId;
  name: string;
  level: UserLevel;
  description?: string;
  skills: Array<{
    skillId: Types.ObjectId;
    requiredScore: number;
    weight: number;
    isCritical: boolean;
  }>;
  isActive: boolean;
}

export interface ICareerPath {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  currentRoleId: Types.ObjectId;
  targetRoleId: Types.ObjectId;
  readinessPercent: number;
  gapAnalysis: Array<{
    skillId: Types.ObjectId;
    currentScore: number;
    requiredScore: number;
    gap: number;
  }>;
  recommendedCourses: Types.ObjectId[];
  estimatedTimeToReady: number;
  updatedAt: Date;
}

// ============================================
// GAMIFICATION TYPES
// ============================================

export type BadgeType =
  | "skill_master"
  | "streak_champion"
  | "fast_learner"
  | "assessment_ace"
  | "course_completer"
  | "team_player"
  | "mentor"
  | "early_bird"
  | "night_owl"
  | "consistent_learner";

export interface IBadge {
  _id: Types.ObjectId;
  name: string;
  description: string;
  type: BadgeType;
  icon: string;
  criteria: {
    type: string;
    threshold: number;
    condition?: string;
  };
  points: number;
  isActive: boolean;
}

export interface IUserBadge {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  badgeId: Types.ObjectId;
  earnedAt: Date;
  evidence?: string;
}

export interface IUserStreak {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: Date;
  streakHistory: Array<{
    date: Date;
    activityType: string;
  }>;
}

// ============================================
// AUDIT & ANALYTICS TYPES
// ============================================

export type AuditAction =
  | "USER_CREATED"
  | "USER_UPDATED"
  | "USER_DELETED"
  | "USER_ROLE_CHANGED"
  | "USER_STATUS_CHANGED"
  | "USER_LOGIN"
  | "USER_LOGOUT"
  | "ORG_CREATED"
  | "ORG_UPDATED"
  | "ORG_STATUS_CHANGED"
  | "ORG_PLAN_UPDATED"
  | "ORG_LIMIT_UPDATED"
  | "COURSE_CREATED"
  | "COURSE_UPDATED"
  | "COURSE_PUBLISHED"
  | "COURSE_DELETED"
  | "ASSESSMENT_CREATED"
  | "ASSESSMENT_COMPLETED"
  | "SKILL_UPDATED"
  | "NUDGE_SENT"
  | "EXPORT_GENERATED"
  | "BULK_IMPORT"
  | "PERMISSION_CHANGED"
  | "DATA_ACCESSED";

export interface IAuditLog {
  _id: Types.ObjectId;
  actorId: Types.ObjectId;
  action: AuditAction;
  targetType:
    | "user"
    | "organization"
    | "course"
    | "assessment"
    | "skill"
    | "system";
  targetId?: Types.ObjectId;
  targetOrgId?: Types.ObjectId;
  oldValue?: string;
  newValue?: string;
  metadata?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
}

// ============================================
// FILTER & QUERY TYPES
// ============================================

export interface IStandardFilters {
  dateFrom?: Date;
  dateTo?: Date;
  organizationId?: string;
  teamId?: string;
  departmentId?: string;
  managerId?: string;
  geography?: string;
  designation?: string;
  role?: UserRole;
  level?: UserLevel;
  skillCategory?: string;
  courseId?: string;
  status?: string;
}

export interface IPaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface IPaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// ============================================
// API RESPONSE TYPES
// ============================================

export interface IApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface IKpiCard {
  label: string;
  value: number | string;
  change?: number;
  changeType?: "positive" | "negative" | "neutral";
  icon?: string;
  trend?: number[];
}
