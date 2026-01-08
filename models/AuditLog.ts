// models/AuditLog.ts

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

export type AuditAction =
  // User Actions
  | "USER_CREATED"
  | "USER_UPDATED"
  | "USER_DELETED"
  | "USER_ROLE_CHANGED"
  | "USER_STATUS_CHANGED"
  | "USER_LEVEL_CHANGED"
  | "USER_PASSWORD_CHANGED"
  | "USER_PASSWORD_RESET"
  | "USER_LOGIN"
  | "USER_LOGIN_FAILED"
  | "USER_LOGOUT"
  | "USER_LOCKED"
  | "USER_UNLOCKED"
  | "USER_BULK_IMPORT"
  | "USER_BULK_UPDATE"
  | "USER_MANAGER_ASSIGNED"
  | "USER_TEAM_ASSIGNED"
  | "USER_DEPARTMENT_ASSIGNED"
  // Organization Actions
  | "ORG_CREATED"
  | "ORG_UPDATED"
  | "ORG_DELETED"
  | "ORG_STATUS_CHANGED"
  | "ORG_PLAN_CHANGED"
  | "ORG_LICENSE_UPDATED"
  | "ORG_SUSPENDED"
  | "ORG_REACTIVATED"
  | "ORG_SETTINGS_UPDATED"
  | "ORG_BRANDING_UPDATED"
  // Course Actions
  | "COURSE_CREATED"
  | "COURSE_UPDATED"
  | "COURSE_DELETED"
  | "COURSE_PUBLISHED"
  | "COURSE_UNPUBLISHED"
  | "COURSE_ASSIGNED"
  | "COURSE_UNASSIGNED"
  | "MODULE_CREATED"
  | "MODULE_UPDATED"
  | "MODULE_DELETED"
  | "LESSON_CREATED"
  | "LESSON_UPDATED"
  | "LESSON_DELETED"
  // Assessment Actions
  | "ASSESSMENT_CREATED"
  | "ASSESSMENT_UPDATED"
  | "ASSESSMENT_DELETED"
  | "ASSESSMENT_PUBLISHED"
  | "ASSESSMENT_COMPLETED"
  | "ASSESSMENT_GRADED"
  // Skill Actions
  | "SKILL_CATEGORY_CREATED"
  | "SKILL_CATEGORY_UPDATED"
  | "SKILL_CATEGORY_DELETED"
  | "SKILL_CREATED"
  | "SKILL_UPDATED"
  | "SKILL_DELETED"
  | "SKILL_SCORE_UPDATED"
  // Role & Career Actions
  | "ROLE_COMPETENCY_CREATED"
  | "ROLE_COMPETENCY_UPDATED"
  | "ROLE_COMPETENCY_DELETED"
  | "CAREER_PATH_CREATED"
  | "CAREER_PATH_UPDATED"
  | "LEARNING_PATH_CREATED"
  | "LEARNING_PATH_UPDATED"
  | "LEARNING_PATH_DELETED"
  // Nudge Actions
  | "NUDGE_SENT"
  | "NUDGE_VIEWED"
  | "NUDGE_CLICKED"
  | "NUDGE_COMPLETED"
  | "NUDGE_TEMPLATE_CREATED"
  | "NUDGE_TEMPLATE_UPDATED"
  // Badge & Gamification Actions
  | "BADGE_CREATED"
  | "BADGE_UPDATED"
  | "BADGE_AWARDED"
  | "POINTS_AWARDED"
  | "LEVEL_UP"
  // Data & Export Actions
  | "DATA_EXPORTED"
  | "REPORT_GENERATED"
  | "BULK_IMPORT_STARTED"
  | "BULK_IMPORT_COMPLETED"
  | "BULK_IMPORT_FAILED"
  // Security Actions
  | "PERMISSION_GRANTED"
  | "PERMISSION_REVOKED"
  | "API_KEY_CREATED"
  | "API_KEY_REVOKED"
  | "SESSION_TERMINATED"
  | "SUSPICIOUS_ACTIVITY"
  | "PII_ACCESSED"
  // System Actions
  | "SYSTEM_SETTING_CHANGED"
  | "MAINTENANCE_STARTED"
  | "MAINTENANCE_ENDED"
  | "BACKUP_CREATED"
  | "DATA_SYNC_COMPLETED"
  | "ERROR_OCCURRED";

export type AuditTargetType =
  | "user"
  | "organization"
  | "course"
  | "module"
  | "lesson"
  | "assessment"
  | "skill_category"
  | "skill"
  | "role_competency"
  | "learning_path"
  | "career_path"
  | "nudge"
  | "badge"
  | "report"
  | "system";

export type AuditSeverity = "low" | "medium" | "high" | "critical";

export interface IAuditMetadata {
  userAgent?: string;
  ipAddress?: string;
  sessionId?: string;
  requestId?: string;
  duration?: number;
  affectedCount?: number;
  errorMessage?: string;
  errorStack?: string;
  additionalData?: Record<string, unknown>;
}

export interface IAuditLog extends Document {
  _id: Types.ObjectId;

  // Actor (who performed the action)
  actorId: Types.ObjectId;
  actorEmail?: string;
  actorName?: string;
  actorRole?: string;

  // Action
  action: AuditAction;
  severity: AuditSeverity;
  description?: string;

  // Target (what was affected)
  targetType: AuditTargetType;
  targetId?: Types.ObjectId;
  targetName?: string;

  // Organization context
  organizationId?: Types.ObjectId;
  organizationName?: string;

  // Change details
  oldValue?: string;
  newValue?: string;
  changes?: Array<{
    field: string;
    oldValue: unknown;
    newValue: unknown;
  }>;

  // Metadata
  metadata: IAuditMetadata;

  // Status
  isSuccess: boolean;
  errorCode?: string;

  // Timestamps
  createdAt: Date;
}

// ============================================
// STATIC METHODS INTERFACE
// ============================================

export interface IAuditLogModel extends Model<IAuditLog> {
  log(data: Partial<IAuditLog>): Promise<IAuditLog>;
  logUserAction(
    actorId: Types.ObjectId,
    action: AuditAction,
    targetUserId: Types.ObjectId,
    details?: Partial<IAuditLog>
  ): Promise<IAuditLog>;
  logOrgAction(
    actorId: Types.ObjectId,
    action: AuditAction,
    orgId: Types.ObjectId,
    details?: Partial<IAuditLog>
  ): Promise<IAuditLog>;
  logSystemAction(
    actorId: Types.ObjectId,
    action: AuditAction,
    details?: Partial<IAuditLog>
  ): Promise<IAuditLog>;
  findByActor(actorId: Types.ObjectId, limit?: number): Promise<IAuditLog[]>;
  findByTarget(
    targetType: AuditTargetType,
    targetId: Types.ObjectId,
    limit?: number
  ): Promise<IAuditLog[]>;
  findByOrganization(
    orgId: Types.ObjectId,
    options?: {
      action?: AuditAction;
      startDate?: Date;
      endDate?: Date;
      limit?: number;
    }
  ): Promise<IAuditLog[]>;
  findByDateRange(
    startDate: Date,
    endDate: Date,
    options?: {
      action?: AuditAction;
      actorId?: Types.ObjectId;
      organizationId?: Types.ObjectId;
      severity?: AuditSeverity;
      limit?: number;
    }
  ): Promise<IAuditLog[]>;
  getActionSummary(
    startDate: Date,
    endDate: Date,
    organizationId?: Types.ObjectId
  ): Promise<Array<{ action: string; count: number }>>;
  getSecurityAlerts(
    days: number,
    organizationId?: Types.ObjectId
  ): Promise<IAuditLog[]>;
}

// ============================================
// SCHEMA
// ============================================

const AuditMetadataSchema = new Schema<IAuditMetadata>(
  {
    userAgent: { type: String },
    ipAddress: { type: String },
    sessionId: { type: String },
    requestId: { type: String },
    duration: { type: Number },
    affectedCount: { type: Number },
    errorMessage: { type: String },
    errorStack: { type: String },
    additionalData: { type: Schema.Types.Mixed },
  },
  { _id: false }
);

const AuditLogSchema = new Schema<IAuditLog, IAuditLogModel>(
  {
    // Actor
    actorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Actor ID is required"],
      index: true,
    },

    actorEmail: {
      type: String,
      trim: true,
    },

    actorName: {
      type: String,
      trim: true,
    },

    actorRole: {
      type: String,
      trim: true,
    },

    // Action
    action: {
      type: String,
      required: [true, "Action is required"],
      index: true,
    },

    severity: {
      type: String,
      enum: ["low", "medium", "high", "critical"],
      default: "low",
      index: true,
    },

    description: {
      type: String,
      trim: true,
      maxlength: [1000, "Description cannot exceed 1000 characters"],
    },

    // Target
    targetType: {
      type: String,
      required: [true, "Target type is required"],
      enum: [
        "user",
        "organization",
        "course",
        "module",
        "lesson",
        "assessment",
        "skill_category",
        "skill",
        "role_competency",
        "learning_path",
        "career_path",
        "nudge",
        "badge",
        "report",
        "system",
      ],
      index: true,
    },

    targetId: {
      type: Schema.Types.ObjectId,
      index: true,
    },

    targetName: {
      type: String,
      trim: true,
    },

    // Organization context
    organizationId: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
      index: true,
    },

    organizationName: {
      type: String,
      trim: true,
    },

    // Change details
    oldValue: {
      type: String,
    },

    newValue: {
      type: String,
    },

    changes: [
      {
        field: { type: String, required: true },
        oldValue: { type: Schema.Types.Mixed },
        newValue: { type: Schema.Types.Mixed },
      },
    ],

    // Metadata
    metadata: {
      type: AuditMetadataSchema,
      default: () => ({}),
    },

    // Status
    isSuccess: {
      type: Boolean,
      default: true,
    },

    errorCode: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    toJSON: {
      virtuals: true,
      transform: function (_doc, ret: Record<string, unknown>) {
        ret.__v = undefined;
        return ret;
      },
    },
  }
);

// ============================================
// INDEXES
// ============================================

AuditLogSchema.index({ createdAt: -1 });
AuditLogSchema.index({ actorId: 1, createdAt: -1 });
AuditLogSchema.index({ organizationId: 1, createdAt: -1 });
AuditLogSchema.index({ targetType: 1, targetId: 1, createdAt: -1 });
AuditLogSchema.index({ action: 1, createdAt: -1 });
AuditLogSchema.index({ severity: 1, createdAt: -1 });
AuditLogSchema.index({ isSuccess: 1, createdAt: -1 });
AuditLogSchema.index({ organizationId: 1, action: 1, createdAt: -1 });

// TTL index - automatically delete logs older than 2 years
AuditLogSchema.index(
  { createdAt: 1 },
  { expireAfterSeconds: 2 * 365 * 24 * 60 * 60 }
);

// Text index for search
AuditLogSchema.index(
  { description: "text", actorEmail: "text", targetName: "text" },
  { weights: { description: 2, actorEmail: 1, targetName: 1 } }
);

// ============================================
// HELPER FUNCTIONS
// ============================================

function getSeverityForAction(action: AuditAction): AuditSeverity {
  const criticalActions: AuditAction[] = [
    "USER_DELETED",
    "ORG_DELETED",
    "ORG_SUSPENDED",
    "PERMISSION_GRANTED",
    "PERMISSION_REVOKED",
    "API_KEY_CREATED",
    "API_KEY_REVOKED",
    "SUSPICIOUS_ACTIVITY",
    "PII_ACCESSED",
  ];

  const highActions: AuditAction[] = [
    "USER_ROLE_CHANGED",
    "USER_STATUS_CHANGED",
    "USER_PASSWORD_CHANGED",
    "USER_PASSWORD_RESET",
    "USER_LOCKED",
    "USER_BULK_IMPORT",
    "USER_BULK_UPDATE",
    "ORG_STATUS_CHANGED",
    "ORG_PLAN_CHANGED",
    "ORG_LICENSE_UPDATED",
    "DATA_EXPORTED",
    "SESSION_TERMINATED",
    "SYSTEM_SETTING_CHANGED",
  ];

  const mediumActions: AuditAction[] = [
    "USER_CREATED",
    "USER_UPDATED",
    "USER_LOGIN_FAILED",
    "ORG_CREATED",
    "ORG_UPDATED",
    "ORG_SETTINGS_UPDATED",
    "COURSE_PUBLISHED",
    "COURSE_UNPUBLISHED",
    "ASSESSMENT_PUBLISHED",
    "BULK_IMPORT_STARTED",
    "BULK_IMPORT_COMPLETED",
    "BULK_IMPORT_FAILED",
    "ERROR_OCCURRED",
  ];

  if (criticalActions.includes(action)) return "critical";
  if (highActions.includes(action)) return "high";
  if (mediumActions.includes(action)) return "medium";
  return "low";
}

function getTargetTypeForAction(action: AuditAction): AuditTargetType {
  if (action.startsWith("USER_")) return "user";
  if (action.startsWith("ORG_")) return "organization";
  if (action.startsWith("COURSE_")) return "course";
  if (action.startsWith("MODULE_")) return "module";
  if (action.startsWith("LESSON_")) return "lesson";
  if (action.startsWith("ASSESSMENT_")) return "assessment";
  if (action.startsWith("SKILL_CATEGORY_")) return "skill_category";
  if (action.startsWith("SKILL_")) return "skill";
  if (action.startsWith("ROLE_COMPETENCY_")) return "role_competency";
  if (action.startsWith("CAREER_PATH_")) return "career_path";
  if (action.startsWith("LEARNING_PATH_")) return "learning_path";
  if (action.startsWith("NUDGE_")) return "nudge";
  if (action.startsWith("BADGE_")) return "badge";
  if (action.startsWith("REPORT_") || action === "DATA_EXPORTED")
    return "report";
  return "system";
}

// ============================================
// STATIC METHODS
// ============================================

AuditLogSchema.statics.log = async function (
  data: Partial<IAuditLog>
): Promise<IAuditLog> {
  const action = data.action as AuditAction;

  const logData: Partial<IAuditLog> = {
    ...data,
    severity: data.severity || getSeverityForAction(action),
    targetType: data.targetType || getTargetTypeForAction(action),
    isSuccess: data.isSuccess !== undefined ? data.isSuccess : true,
  };

  return this.create(logData);
};

AuditLogSchema.statics.logUserAction = async function (
  actorId: Types.ObjectId,
  action: AuditAction,
  targetUserId: Types.ObjectId,
  details?: Partial<IAuditLog>
): Promise<IAuditLog> {
  return this.log({
    actorId,
    action,
    targetType: "user",
    targetId: targetUserId,
    ...details,
  });
};

AuditLogSchema.statics.logOrgAction = async function (
  actorId: Types.ObjectId,
  action: AuditAction,
  orgId: Types.ObjectId,
  details?: Partial<IAuditLog>
): Promise<IAuditLog> {
  return this.log({
    actorId,
    action,
    targetType: "organization",
    targetId: orgId,
    organizationId: orgId,
    ...details,
  });
};

AuditLogSchema.statics.logSystemAction = async function (
  actorId: Types.ObjectId,
  action: AuditAction,
  details?: Partial<IAuditLog>
): Promise<IAuditLog> {
  return this.log({
    actorId,
    action,
    targetType: "system",
    ...details,
  });
};

AuditLogSchema.statics.findByActor = function (
  actorId: Types.ObjectId,
  limit = 100
): Promise<IAuditLog[]> {
  return this.find({ actorId }).sort({ createdAt: -1 }).limit(limit).exec();
};

AuditLogSchema.statics.findByTarget = function (
  targetType: AuditTargetType,
  targetId: Types.ObjectId,
  limit = 100
): Promise<IAuditLog[]> {
  return this.find({ targetType, targetId })
    .sort({ createdAt: -1 })
    .limit(limit)
    .exec();
};

AuditLogSchema.statics.findByOrganization = function (
  orgId: Types.ObjectId,
  options?: {
    action?: AuditAction;
    startDate?: Date;
    endDate?: Date;
    limit?: number;
  }
): Promise<IAuditLog[]> {
  const query: Record<string, unknown> = { organizationId: orgId };

  if (options?.action) {
    query.action = options.action;
  }

  if (options?.startDate || options?.endDate) {
    query.createdAt = {};
    if (options.startDate) {
      (query.createdAt as Record<string, Date>).$gte = options.startDate;
    }
    if (options.endDate) {
      (query.createdAt as Record<string, Date>).$lte = options.endDate;
    }
  }

  return this.find(query)
    .sort({ createdAt: -1 })
    .limit(options?.limit || 100)
    .exec();
};

AuditLogSchema.statics.findByDateRange = function (
  startDate: Date,
  endDate: Date,
  options?: {
    action?: AuditAction;
    actorId?: Types.ObjectId;
    organizationId?: Types.ObjectId;
    severity?: AuditSeverity;
    limit?: number;
  }
): Promise<IAuditLog[]> {
  const query: Record<string, unknown> = {
    createdAt: { $gte: startDate, $lte: endDate },
  };

  if (options?.action) query.action = options.action;
  if (options?.actorId) query.actorId = options.actorId;
  if (options?.organizationId) query.organizationId = options.organizationId;
  if (options?.severity) query.severity = options.severity;

  return this.find(query)
    .sort({ createdAt: -1 })
    .limit(options?.limit || 500)
    .exec();
};

AuditLogSchema.statics.getActionSummary = async function (
  startDate: Date,
  endDate: Date,
  organizationId?: Types.ObjectId
): Promise<Array<{ action: string; count: number }>> {
  const match: Record<string, unknown> = {
    createdAt: { $gte: startDate, $lte: endDate },
  };

  if (organizationId) {
    match.organizationId = organizationId;
  }

  const result = await this.aggregate([
    { $match: match },
    {
      $group: {
        _id: "$action",
        count: { $sum: 1 },
      },
    },
    { $sort: { count: -1 } },
    {
      $project: {
        _id: 0,
        action: "$_id",
        count: 1,
      },
    },
  ]);

  return result;
};

AuditLogSchema.statics.getSecurityAlerts = function (
  days: number,
  organizationId?: Types.ObjectId
): Promise<IAuditLog[]> {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const query: Record<string, unknown> = {
    createdAt: { $gte: startDate },
    $or: [
      { severity: { $in: ["high", "critical"] } },
      {
        action: {
          $in: [
            "USER_LOGIN_FAILED",
            "USER_LOCKED",
            "SUSPICIOUS_ACTIVITY",
            "PII_ACCESSED",
            "SESSION_TERMINATED",
          ],
        },
      },
      { isSuccess: false },
    ],
  };

  if (organizationId) {
    query.organizationId = organizationId;
  }

  return this.find(query).sort({ createdAt: -1 }).limit(500).exec();
};

// ============================================
// EXPORT
// ============================================

export const AuditLog: IAuditLogModel =
  (models.AuditLog as IAuditLogModel) ||
  model<IAuditLog, IAuditLogModel>("AuditLog", AuditLogSchema);

export default AuditLog;
