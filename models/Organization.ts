// models/Organization.ts

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

export type PlanType = "trial" | "basic" | "pro" | "enterprise";
export type OrgSize = "small" | "medium" | "large" | "enterprise";
export type OrgStatus = "active" | "inactive" | "suspended" | "expired";

export interface IOrgSettings {
  allowSelfRegistration: boolean;
  requireManagerApproval: boolean;
  enableGamification: boolean;
  enableLeaderboards: boolean;
  enableBenchmarking: boolean;
  enableNudges: boolean;
  enableAICoach: boolean;
  enableCertificates: boolean;
  enableCareerPaths: boolean;
  defaultLanguage: string;
  defaultTimezone: string;
}

export interface IOrgBranding {
  primaryColor: string;
  secondaryColor: string;
  logo?: string;
  favicon?: string;
  customDomain?: string;
}

export interface IOrgLicense {
  maxUsers: number;
  maxCourses: number;
  maxAssessments: number;
  maxStorageGB: number;
  features: string[];
}

export interface IOrgContact {
  name: string;
  email: string;
  phone?: string;
  designation?: string;
}

export interface IOrgBilling {
  billingEmail: string;
  billingAddress?: string;
  taxId?: string;
  currency: string;
  paymentMethod?: string;
}

export interface IOrganization extends Document {
  _id: Types.ObjectId;

  // Basic Info
  name: string;
  code: string;
  industry?: string;
  size?: OrgSize;
  description?: string;
  website?: string;

  // Branding
  branding: IOrgBranding;

  // Plan & License
  planType: PlanType;
  license: IOrgLicense;
  startDate: Date;
  endDate: Date;
  trialEndsAt?: Date;

  // Status
  status: OrgStatus;
  isActive: boolean;
  suspendedAt?: Date;
  suspendedReason?: string;

  // Contacts
  primaryContact: IOrgContact;
  billingContact?: IOrgContact;
  billing?: IOrgBilling;

  // Settings
  settings: IOrgSettings;

  // Hierarchy
  parentOrgId?: Types.ObjectId;
  departments: Types.ObjectId[];

  // Statistics (denormalized for performance)
  stats: {
    totalUsers: number;
    activeUsers: number;
    totalCourses: number;
    totalAssessments: number;
    totalLearningHours: number;
    avgSkillScore: number;
    lastActivityAt?: Date;
  };

  // Timestamps
  createdAt: Date;
  updatedAt: Date;

  // Virtuals
  isExpired?: boolean;
  isTrialActive?: boolean;
  daysUntilExpiry?: number;
  licenseUtilization?: number;
  displayStatus?: string;
  displayPlan?: string;

  // Methods
  checkLicenseLimit(): Promise<boolean>;
  updateStats(): Promise<void>;
  suspend(reason: string): Promise<void>;
  reactivate(): Promise<void>;
  extendLicense(days: number): Promise<void>;
}

// ============================================
// STATIC METHODS INTERFACE
// ============================================

export interface IOrganizationModel extends Model<IOrganization> {
  findByCode(code: string): Promise<IOrganization | null>;
  findActive(): Promise<IOrganization[]>;
  findExpiring(days: number): Promise<IOrganization[]>;
  findOverLimit(): Promise<IOrganization[]>;
  getGlobalStats(): Promise<{
    totalOrgs: number;
    activeOrgs: number;
    totalLicenses: number;
    usedLicenses: number;
    byPlan: Record<string, number>;
    byStatus: Record<string, number>;
  }>;
}

// ============================================
// SUB-SCHEMAS
// ============================================

const OrgSettingsSchema = new Schema<IOrgSettings>(
  {
    allowSelfRegistration: { type: Boolean, default: false },
    requireManagerApproval: { type: Boolean, default: true },
    enableGamification: { type: Boolean, default: true },
    enableLeaderboards: { type: Boolean, default: true },
    enableBenchmarking: { type: Boolean, default: false },
    enableNudges: { type: Boolean, default: true },
    enableAICoach: { type: Boolean, default: true },
    enableCertificates: { type: Boolean, default: true },
    enableCareerPaths: { type: Boolean, default: true },
    defaultLanguage: { type: String, default: "en" },
    defaultTimezone: { type: String, default: "Asia/Kolkata" },
  },
  { _id: false }
);

const OrgBrandingSchema = new Schema<IOrgBranding>(
  {
    primaryColor: { type: String, default: "#FBBF24" },
    secondaryColor: { type: String, default: "#000000" },
    logo: { type: String },
    favicon: { type: String },
    customDomain: { type: String },
  },
  { _id: false }
);

const OrgLicenseSchema = new Schema<IOrgLicense>(
  {
    maxUsers: { type: Number, required: true, min: 1 },
    maxCourses: { type: Number, default: -1 },
    maxAssessments: { type: Number, default: -1 },
    maxStorageGB: { type: Number, default: 10 },
    features: [{ type: String }],
  },
  { _id: false }
);

const OrgContactSchema = new Schema<IOrgContact>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    designation: { type: String },
  },
  { _id: false }
);

const OrgBillingSchema = new Schema<IOrgBilling>(
  {
    billingEmail: { type: String, required: true },
    billingAddress: { type: String },
    taxId: { type: String },
    currency: { type: String, default: "INR" },
    paymentMethod: { type: String },
  },
  { _id: false }
);

const OrgStatsSchema = new Schema(
  {
    totalUsers: { type: Number, default: 0 },
    activeUsers: { type: Number, default: 0 },
    totalCourses: { type: Number, default: 0 },
    totalAssessments: { type: Number, default: 0 },
    totalLearningHours: { type: Number, default: 0 },
    avgSkillScore: { type: Number, default: 0 },
    lastActivityAt: { type: Date },
  },
  { _id: false }
);

// ============================================
// MAIN SCHEMA
// ============================================

const OrganizationSchema = new Schema<IOrganization, IOrganizationModel>(
  {
    // Basic Info
    name: {
      type: String,
      required: [true, "Organization name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [200, "Name cannot exceed 200 characters"],
    },

    code: {
      type: String,
      required: [true, "Organization code is required"],
      unique: true,
      uppercase: true,
      trim: true,
      minlength: [2, "Code must be at least 2 characters"],
      maxlength: [20, "Code cannot exceed 20 characters"],
      match: [
        /^[A-Z0-9_-]+$/,
        "Code can only contain letters, numbers, hyphens, and underscores",
      ],
      index: true,
    },

    industry: {
      type: String,
      trim: true,
      enum: {
        values: [
          "technology",
          "finance",
          "healthcare",
          "education",
          "manufacturing",
          "retail",
          "consulting",
          "government",
          "nonprofit",
          "other",
        ],
        message: "{VALUE} is not a valid industry",
      },
    },

    size: {
      type: String,
      enum: {
        values: ["small", "medium", "large", "enterprise"],
        message: "{VALUE} is not a valid size",
      },
      default: "small",
    },

    description: {
      type: String,
      trim: true,
      maxlength: [1000, "Description cannot exceed 1000 characters"],
    },

    website: {
      type: String,
      trim: true,
      match: [
        /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
        "Please provide a valid URL",
      ],
    },

    // Branding
    branding: {
      type: OrgBrandingSchema,
      default: () => ({
        primaryColor: "#FBBF24",
        secondaryColor: "#000000",
      }),
    },

    // Plan & License
    planType: {
      type: String,
      enum: {
        values: ["trial", "basic", "pro", "enterprise"],
        message: "{VALUE} is not a valid plan type",
      },
      default: "trial",
      index: true,
    },

    license: {
      type: OrgLicenseSchema,
      required: true,
    },

    startDate: {
      type: Date,
      required: [true, "Start date is required"],
      index: true,
    },

    endDate: {
      type: Date,
      required: [true, "End date is required"],
      index: true,
    },

    trialEndsAt: {
      type: Date,
    },

    // Status
    status: {
      type: String,
      enum: {
        values: ["active", "inactive", "suspended", "expired"],
        message: "{VALUE} is not a valid status",
      },
      default: "active",
      index: true,
    },

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },

    suspendedAt: {
      type: Date,
    },

    suspendedReason: {
      type: String,
      trim: true,
    },

    // Contacts
    primaryContact: {
      type: OrgContactSchema,
      required: true,
    },

    billingContact: {
      type: OrgContactSchema,
    },

    billing: {
      type: OrgBillingSchema,
    },

    // Settings
    settings: {
      type: OrgSettingsSchema,
      default: () => ({
        allowSelfRegistration: false,
        requireManagerApproval: true,
        enableGamification: true,
        enableLeaderboards: true,
        enableBenchmarking: false,
        enableNudges: true,
        enableAICoach: true,
        enableCertificates: true,
        enableCareerPaths: true,
        defaultLanguage: "en",
        defaultTimezone: "Asia/Kolkata",
      }),
    },

    // Hierarchy
    parentOrgId: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
    },

    departments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Department",
      },
    ],

    // Statistics
    stats: {
      type: OrgStatsSchema,
      default: () => ({
        totalUsers: 0,
        activeUsers: 0,
        totalCourses: 0,
        totalAssessments: 0,
        totalLearningHours: 0,
        avgSkillScore: 0,
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

OrganizationSchema.index({ name: 1 });
OrganizationSchema.index({ planType: 1, isActive: 1 });
OrganizationSchema.index({ status: 1, isActive: 1 });
OrganizationSchema.index({ endDate: 1, isActive: 1 });
OrganizationSchema.index({ "primaryContact.email": 1 });
OrganizationSchema.index({ createdAt: -1 });
OrganizationSchema.index({ "stats.totalUsers": -1 });
OrganizationSchema.index({ "stats.activeUsers": -1 });

OrganizationSchema.index(
  { name: "text", code: "text", description: "text" },
  { weights: { name: 3, code: 2, description: 1 } }
);

// ============================================
// VIRTUALS
// ============================================

OrganizationSchema.virtual("isExpired").get(function () {
  return this.endDate < new Date();
});

OrganizationSchema.virtual("isTrialActive").get(function () {
  if (this.planType !== "trial") return false;
  if (!this.trialEndsAt) return false;
  return this.trialEndsAt > new Date();
});

OrganizationSchema.virtual("daysUntilExpiry").get(function () {
  const now = new Date();
  const diffTime = this.endDate.getTime() - now.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

OrganizationSchema.virtual("licenseUtilization").get(function () {
  if (!this.license?.maxUsers || this.license.maxUsers <= 0) return 0;
  return Math.round((this.stats.totalUsers / this.license.maxUsers) * 100);
});

OrganizationSchema.virtual("displayStatus").get(function () {
  const statusLabels: Record<OrgStatus, string> = {
    active: "Active",
    inactive: "Inactive",
    suspended: "Suspended",
    expired: "Expired",
  };
  return statusLabels[this.status];
});

OrganizationSchema.virtual("displayPlan").get(function () {
  const planLabels: Record<PlanType, string> = {
    trial: "Trial",
    basic: "Basic",
    pro: "Professional",
    enterprise: "Enterprise",
  };
  return planLabels[this.planType];
});

OrganizationSchema.virtual("users", {
  ref: "User",
  localField: "_id",
  foreignField: "organizationId",
});

// ============================================
// INSTANCE METHODS
// ============================================

OrganizationSchema.methods.checkLicenseLimit =
  async function (): Promise<boolean> {
    const User = mongoose.model("User");
    const userCount = await User.countDocuments({
      organizationId: this._id,
      isActive: true,
    });
    return userCount < this.license.maxUsers;
  };

OrganizationSchema.methods.updateStats = async function (): Promise<void> {
  const User = mongoose.model("User");

  const stats = await User.aggregate([
    { $match: { organizationId: this._id } },
    {
      $group: {
        _id: null,
        totalUsers: { $sum: 1 },
        activeUsers: {
          $sum: { $cond: [{ $eq: ["$isActive", true] }, 1, 0] },
        },
        totalLearningMinutes: { $sum: "$totalLearningMinutes" },
        avgReadiness: { $avg: "$career.readinessPercent" },
        lastActivity: { $max: "$lastActivityAt" },
      },
    },
  ]);

  const result = stats[0] || {};

  await this.updateOne({
    $set: {
      "stats.totalUsers": result.totalUsers || 0,
      "stats.activeUsers": result.activeUsers || 0,
      "stats.totalLearningHours": Math.round(
        (result.totalLearningMinutes || 0) / 60
      ),
      "stats.avgSkillScore": Math.round(result.avgReadiness || 0),
      "stats.lastActivityAt": result.lastActivity,
    },
  });
};

OrganizationSchema.methods.suspend = async function (
  reason: string
): Promise<void> {
  await this.updateOne({
    $set: {
      status: "suspended",
      isActive: false,
      suspendedAt: new Date(),
      suspendedReason: reason,
    },
  });
};

OrganizationSchema.methods.reactivate = async function (): Promise<void> {
  await this.updateOne({
    $set: {
      status: "active",
      isActive: true,
    },
    $unset: {
      suspendedAt: 1,
      suspendedReason: 1,
    },
  });
};

OrganizationSchema.methods.extendLicense = async function (
  days: number
): Promise<void> {
  const newEndDate = new Date(this.endDate);
  newEndDate.setDate(newEndDate.getDate() + days);

  await this.updateOne({
    $set: {
      endDate: newEndDate,
      status: "active",
      isActive: true,
    },
  });
};

// ============================================
// STATIC METHODS
// ============================================

OrganizationSchema.statics.findByCode = function (
  code: string
): Promise<IOrganization | null> {
  return this.findOne({ code: code.toUpperCase() }).exec();
};

OrganizationSchema.statics.findActive = function (): Promise<IOrganization[]> {
  return this.find({ isActive: true, status: "active" })
    .sort({ name: 1 })
    .exec();
};

OrganizationSchema.statics.findExpiring = function (
  days: number
): Promise<IOrganization[]> {
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + days);

  return this.find({
    isActive: true,
    endDate: { $lte: futureDate, $gte: new Date() },
  })
    .sort({ endDate: 1 })
    .exec();
};

OrganizationSchema.statics.findOverLimit = async function (): Promise<
  IOrganization[]
> {
  const User = mongoose.model("User");
  const orgs = await this.find({ isActive: true }).lean();
  const overLimitOrgs: IOrganization[] = [];

  for (const org of orgs) {
    const userCount = await User.countDocuments({
      organizationId: org._id,
      isActive: true,
    });

    if (userCount > org.license.maxUsers) {
      overLimitOrgs.push(org as IOrganization);
    }
  }

  return overLimitOrgs;
};

OrganizationSchema.statics.getGlobalStats = async function (): Promise<{
  totalOrgs: number;
  activeOrgs: number;
  totalLicenses: number;
  usedLicenses: number;
  byPlan: Record<string, number>;
  byStatus: Record<string, number>;
}> {
  const stats = await this.aggregate([
    {
      $facet: {
        totals: [
          {
            $group: {
              _id: null,
              totalOrgs: { $sum: 1 },
              activeOrgs: {
                $sum: { $cond: [{ $eq: ["$isActive", true] }, 1, 0] },
              },
              totalLicenses: { $sum: "$license.maxUsers" },
              usedLicenses: { $sum: "$stats.totalUsers" },
            },
          },
        ],
        byPlan: [
          {
            $group: {
              _id: "$planType",
              count: { $sum: 1 },
            },
          },
        ],
        byStatus: [
          {
            $group: {
              _id: "$status",
              count: { $sum: 1 },
            },
          },
        ],
      },
    },
  ]);

  const totals = stats[0]?.totals[0] || {
    totalOrgs: 0,
    activeOrgs: 0,
    totalLicenses: 0,
    usedLicenses: 0,
  };

  const byPlan: Record<string, number> = {};
  for (const item of stats[0]?.byPlan || []) {
    byPlan[item._id] = item.count;
  }

  const byStatus: Record<string, number> = {};
  for (const item of stats[0]?.byStatus || []) {
    byStatus[item._id] = item.count;
  }

  return {
    totalOrgs: totals.totalOrgs,
    activeOrgs: totals.activeOrgs,
    totalLicenses: totals.totalLicenses,
    usedLicenses: totals.usedLicenses,
    byPlan,
    byStatus,
  };
};

// ============================================
// EXPORT (No middleware - defaults handle everything)
// ============================================

export const Organization: IOrganizationModel =
  (models.Organization as IOrganizationModel) ||
  model<IOrganization, IOrganizationModel>("Organization", OrganizationSchema);

export default Organization;
