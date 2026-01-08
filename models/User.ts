// models/User.ts

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

export type UserRole =
  | "employee"
  | "team_lead"
  | "manager"
  | "org_admin"
  | "super_admin";

export type UserLevel = "entry" | "mid" | "senior" | "lead" | "executive";

export interface IUserPreferences {
  emailNotifications: boolean;
  whatsappNotifications: boolean;
  pushNotifications: boolean;
  dailyNudgeTime?: string;
  language: string;
  timezone: string;
}

export interface IUserGamification {
  totalPoints: number;
  currentLevel: number;
  currentStreak: number;
  longestStreak: number;
  lastActivityDate?: Date;
  weeklyGoalHours: number;
  weeklyCompletedHours: number;
}

export interface IUserCareer {
  currentRoleId?: Types.ObjectId;
  targetRoleId?: Types.ObjectId;
  careerPathId?: Types.ObjectId;
  readinessPercent: number;
  careerProgressIndex: number;
}

export interface IUser extends Document {
  _id: Types.ObjectId;

  // Basic Info
  name: string;
  email: string;
  password?: string;
  avatar?: string;
  phone?: string;

  // Role & Access
  role: UserRole;
  level: UserLevel;
  designation?: string;

  // Organization Hierarchy
  organizationId?: Types.ObjectId;
  departmentId?: Types.ObjectId;
  teamId?: Types.ObjectId;
  managerId?: Types.ObjectId;

  // Location
  location?: string;
  geography?: string;
  timezone: string;

  // Status
  isActive: boolean;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  onboardingCompleted: boolean;
  onboardingStep: number;

  // Preferences
  preferences: IUserPreferences;

  // Gamification
  gamification: IUserGamification;

  // Career
  career: IUserCareer;

  // Activity Tracking
  lastLoginAt?: Date;
  lastActivityAt?: Date;
  totalLearningMinutes: number;
  totalCoursesCompleted: number;
  totalAssessmentsCompleted: number;
  totalBadgesEarned: number;

  // Security
  passwordChangedAt?: Date;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  failedLoginAttempts: number;
  lockUntil?: Date;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;

  // Virtuals
  isLocked?: boolean;
  displayRole?: string;
  displayLevel?: string;
  learningHours?: number;

  // Methods
  incrementLoginAttempts(): Promise<void>;
  resetLoginAttempts(): Promise<void>;
  updateActivity(): Promise<void>;
  addLearningTime(minutes: number): Promise<void>;
  addPoints(points: number): Promise<void>;
}

// ============================================
// STATIC METHODS INTERFACE
// ============================================

export interface IUserModel extends Model<IUser> {
  findByOrganization(
    organizationId: Types.ObjectId,
    options?: { activeOnly?: boolean; role?: UserRole }
  ): Promise<IUser[]>;
  findDirectReports(managerId: Types.ObjectId): Promise<IUser[]>;
  getLeaderboard(
    organizationId: Types.ObjectId,
    limit?: number
  ): Promise<IUser[]>;
  getOrganizationStats(organizationId: Types.ObjectId): Promise<{
    totalUsers: number;
    activeUsers: number;
    totalLearningMinutes: number;
    totalCoursesCompleted: number;
    avgReadiness: number;
    byRole: Array<{ role: string; level: string }>;
  }>;
}

// ============================================
// SUB-SCHEMAS
// ============================================

const UserPreferencesSchema = new Schema<IUserPreferences>(
  {
    emailNotifications: { type: Boolean, default: true },
    whatsappNotifications: { type: Boolean, default: false },
    pushNotifications: { type: Boolean, default: true },
    dailyNudgeTime: { type: String, default: "09:00" },
    language: { type: String, default: "en" },
    timezone: { type: String, default: "Asia/Kolkata" },
  },
  { _id: false }
);

const UserGamificationSchema = new Schema<IUserGamification>(
  {
    totalPoints: { type: Number, default: 0 },
    currentLevel: { type: Number, default: 1 },
    currentStreak: { type: Number, default: 0 },
    longestStreak: { type: Number, default: 0 },
    lastActivityDate: { type: Date },
    weeklyGoalHours: { type: Number, default: 5 },
    weeklyCompletedHours: { type: Number, default: 0 },
  },
  { _id: false }
);

const UserCareerSchema = new Schema<IUserCareer>(
  {
    currentRoleId: { type: Schema.Types.ObjectId, ref: "RoleCompetency" },
    targetRoleId: { type: Schema.Types.ObjectId, ref: "RoleCompetency" },
    careerPathId: { type: Schema.Types.ObjectId, ref: "CareerPath" },
    readinessPercent: { type: Number, default: 0, min: 0, max: 100 },
    careerProgressIndex: { type: Number, default: 0, min: 0, max: 100 },
  },
  { _id: false }
);

// ============================================
// MAIN SCHEMA
// ============================================

const UserSchema = new Schema<IUser, IUserModel>(
  {
    // Basic Info
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [100, "Name cannot exceed 100 characters"],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a valid email",
      ],
      index: true,
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters"],
      select: false,
    },

    avatar: {
      type: String,
      default: "",
    },

    phone: {
      type: String,
      trim: true,
      match: [/^\+?[\d\s-]{10,}$/, "Please provide a valid phone number"],
    },

    // Role & Access
    role: {
      type: String,
      enum: {
        values: [
          "employee",
          "team_lead",
          "manager",
          "org_admin",
          "super_admin",
        ],
        message: "{VALUE} is not a valid role",
      },
      default: "employee",
      index: true,
    },

    level: {
      type: String,
      enum: {
        values: ["entry", "mid", "senior", "lead", "executive"],
        message: "{VALUE} is not a valid level",
      },
      default: "entry",
      index: true,
    },

    designation: {
      type: String,
      trim: true,
      maxlength: [100, "Designation cannot exceed 100 characters"],
    },

    // Organization Hierarchy
    organizationId: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
      index: true,
    },

    departmentId: {
      type: Schema.Types.ObjectId,
      ref: "Department",
      index: true,
    },

    teamId: {
      type: Schema.Types.ObjectId,
      ref: "Team",
      index: true,
    },

    managerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },

    // Location
    location: {
      type: String,
      trim: true,
    },

    geography: {
      type: String,
      trim: true,
      index: true,
    },

    timezone: {
      type: String,
      default: "Asia/Kolkata",
    },

    // Status
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },

    isEmailVerified: {
      type: Boolean,
      default: false,
    },

    isPhoneVerified: {
      type: Boolean,
      default: false,
    },

    onboardingCompleted: {
      type: Boolean,
      default: false,
    },

    onboardingStep: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    // Preferences (defaults handled by sub-schema)
    preferences: {
      type: UserPreferencesSchema,
      default: () => ({
        emailNotifications: true,
        whatsappNotifications: false,
        pushNotifications: true,
        dailyNudgeTime: "09:00",
        language: "en",
        timezone: "Asia/Kolkata",
      }),
    },

    // Gamification (defaults handled by sub-schema)
    gamification: {
      type: UserGamificationSchema,
      default: () => ({
        totalPoints: 0,
        currentLevel: 1,
        currentStreak: 0,
        longestStreak: 0,
        weeklyGoalHours: 5,
        weeklyCompletedHours: 0,
      }),
    },

    // Career (defaults handled by sub-schema)
    career: {
      type: UserCareerSchema,
      default: () => ({
        readinessPercent: 0,
        careerProgressIndex: 0,
      }),
    },

    // Activity Tracking
    lastLoginAt: {
      type: Date,
    },

    lastActivityAt: {
      type: Date,
    },

    totalLearningMinutes: {
      type: Number,
      default: 0,
      min: 0,
    },

    totalCoursesCompleted: {
      type: Number,
      default: 0,
      min: 0,
    },

    totalAssessmentsCompleted: {
      type: Number,
      default: 0,
      min: 0,
    },

    totalBadgesEarned: {
      type: Number,
      default: 0,
      min: 0,
    },

    // Security
    passwordChangedAt: {
      type: Date,
    },

    passwordResetToken: {
      type: String,
      select: false,
    },

    passwordResetExpires: {
      type: Date,
      select: false,
    },

    failedLoginAttempts: {
      type: Number,
      default: 0,
    },

    lockUntil: {
      type: Date,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (_doc, ret: Record<string, unknown>) {
        ret.password = undefined;
        ret.passwordResetToken = undefined;
        ret.passwordResetExpires = undefined;
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

UserSchema.index({ organizationId: 1, role: 1 });
UserSchema.index({ organizationId: 1, isActive: 1 });
UserSchema.index({ managerId: 1, isActive: 1 });
UserSchema.index({ organizationId: 1, departmentId: 1 });
UserSchema.index({ email: 1, isActive: 1 });
UserSchema.index({ createdAt: -1 });
UserSchema.index({ "gamification.totalPoints": -1 });
UserSchema.index({ "career.readinessPercent": -1 });

UserSchema.index(
  { name: "text", email: "text", designation: "text" },
  { weights: { name: 3, email: 2, designation: 1 } }
);

// ============================================
// VIRTUALS
// ============================================

UserSchema.virtual("isLocked").get(function () {
  return !!(this.lockUntil && this.lockUntil > new Date());
});

UserSchema.virtual("displayRole").get(function () {
  const roleLabels: Record<UserRole, string> = {
    employee: "Employee",
    team_lead: "Team Lead",
    manager: "Manager",
    org_admin: "Organization Admin",
    super_admin: "Super Admin",
  };
  return roleLabels[this.role];
});

UserSchema.virtual("displayLevel").get(function () {
  const levelLabels: Record<UserLevel, string> = {
    entry: "Entry Level",
    mid: "Mid Level",
    senior: "Senior Level",
    lead: "Lead",
    executive: "Executive",
  };
  return levelLabels[this.level];
});

UserSchema.virtual("learningHours").get(function () {
  return Math.round((this.totalLearningMinutes / 60) * 10) / 10;
});

UserSchema.virtual("directReports", {
  ref: "User",
  localField: "_id",
  foreignField: "managerId",
  match: { isActive: true },
});

// ============================================
// INSTANCE METHODS
// ============================================

UserSchema.methods.incrementLoginAttempts = async function (): Promise<void> {
  if (this.lockUntil && this.lockUntil < new Date()) {
    await this.updateOne({
      $set: { failedLoginAttempts: 1 },
      $unset: { lockUntil: 1 },
    });
    return;
  }

  const updates: Record<string, unknown> = {
    $inc: { failedLoginAttempts: 1 },
  };

  if (this.failedLoginAttempts + 1 >= 5) {
    updates.$set = {
      lockUntil: new Date(Date.now() + 2 * 60 * 60 * 1000),
    };
  }

  await this.updateOne(updates);
};

UserSchema.methods.resetLoginAttempts = async function (): Promise<void> {
  await this.updateOne({
    $set: { failedLoginAttempts: 0 },
    $unset: { lockUntil: 1 },
  });
};

UserSchema.methods.updateActivity = async function (): Promise<void> {
  await this.updateOne({
    $set: { lastActivityAt: new Date() },
  });
};

UserSchema.methods.addLearningTime = async function (
  minutes: number
): Promise<void> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const lastActivity = this.gamification?.lastActivityDate;
  const lastActivityDay = lastActivity
    ? new Date(lastActivity).setHours(0, 0, 0, 0)
    : null;

  let streakUpdate: Record<string, number> = {};

  if (lastActivityDay) {
    const daysDiff = Math.floor(
      (today.getTime() - lastActivityDay) / (1000 * 60 * 60 * 24)
    );

    if (daysDiff === 1) {
      const currentStreak = this.gamification?.currentStreak || 0;
      const longestStreak = this.gamification?.longestStreak || 0;
      streakUpdate = {
        "gamification.currentStreak": currentStreak + 1,
        "gamification.longestStreak": Math.max(
          longestStreak,
          currentStreak + 1
        ),
      };
    } else if (daysDiff > 1) {
      streakUpdate = {
        "gamification.currentStreak": 1,
      };
    }
  } else {
    streakUpdate = {
      "gamification.currentStreak": 1,
      "gamification.longestStreak": 1,
    };
  }

  await this.updateOne({
    $inc: {
      totalLearningMinutes: minutes,
      "gamification.weeklyCompletedHours": minutes / 60,
    },
    $set: {
      lastActivityAt: new Date(),
      "gamification.lastActivityDate": new Date(),
      ...streakUpdate,
    },
  });
};

UserSchema.methods.addPoints = async function (points: number): Promise<void> {
  const currentPoints = this.gamification?.totalPoints || 0;
  const newTotal = currentPoints + points;
  const newLevel = Math.floor(newTotal / 1000) + 1;

  await this.updateOne({
    $inc: { "gamification.totalPoints": points },
    $set: { "gamification.currentLevel": newLevel },
  });
};

// ============================================
// STATIC METHODS
// ============================================

UserSchema.statics.findByOrganization = function (
  organizationId: Types.ObjectId,
  options?: { activeOnly?: boolean; role?: UserRole }
): Promise<IUser[]> {
  const query: Record<string, unknown> = { organizationId };

  if (options?.activeOnly !== false) {
    query.isActive = true;
  }

  if (options?.role) {
    query.role = options.role;
  }

  return this.find(query).sort({ name: 1 }).exec();
};

UserSchema.statics.findDirectReports = function (
  managerId: Types.ObjectId
): Promise<IUser[]> {
  return this.find({ managerId, isActive: true }).sort({ name: 1 }).exec();
};

UserSchema.statics.getLeaderboard = function (
  organizationId: Types.ObjectId,
  limit = 10
): Promise<IUser[]> {
  return this.find({ organizationId, isActive: true })
    .sort({ "gamification.totalPoints": -1 })
    .limit(limit)
    .select("name avatar gamification.totalPoints gamification.currentLevel")
    .exec();
};

UserSchema.statics.getOrganizationStats = async function (
  organizationId: Types.ObjectId
): Promise<{
  totalUsers: number;
  activeUsers: number;
  totalLearningMinutes: number;
  totalCoursesCompleted: number;
  avgReadiness: number;
  byRole: Array<{ role: string; level: string }>;
}> {
  const stats = await this.aggregate([
    {
      $match: {
        organizationId: new mongoose.Types.ObjectId(organizationId.toString()),
      },
    },
    {
      $group: {
        _id: null,
        totalUsers: { $sum: 1 },
        activeUsers: {
          $sum: { $cond: [{ $eq: ["$isActive", true] }, 1, 0] },
        },
        totalLearningMinutes: { $sum: "$totalLearningMinutes" },
        totalCoursesCompleted: { $sum: "$totalCoursesCompleted" },
        avgReadiness: { $avg: "$career.readinessPercent" },
        byRole: {
          $push: {
            role: "$role",
            level: "$level",
          },
        },
      },
    },
  ]);

  return (
    stats[0] || {
      totalUsers: 0,
      activeUsers: 0,
      totalLearningMinutes: 0,
      totalCoursesCompleted: 0,
      avgReadiness: 0,
      byRole: [],
    }
  );
};

// ============================================
// EXPORT
// ============================================

export const User: IUserModel =
  (models.User as IUserModel) || model<IUser, IUserModel>("User", UserSchema);

export default User;
