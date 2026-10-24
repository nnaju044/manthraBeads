const mongoose = require('mongoose');

/* ──────────────────────────────────────────────────────────
   Notification Model — Post-Class Email Ledger (Stage 6)
   ────────────────────────────────────────────────────────── */

const notificationSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: [true, 'Student reference is required'],
      index: true,
    },
    attendance: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Attendance',
      required: [true, 'Attendance reference is required'],
      index: true,
    },
    session: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Session',
      index: true,
    },
    package: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Package',
      index: true,
    },
    recipientEmail: {
      type: String,
      trim: true,
      lowercase: true,
      default: '',
    },
    recipientName: {
      type: String,
      trim: true,
      default: '',
    },
    recipientType: {
      type: String,
      enum: ['student', 'parent', 'none'],
      default: 'none',
    },
    notificationType: {
      type: String,
      enum: ['class_completion', 'late_arrival', 'absence'],
      required: [true, 'Notification type is required'],
      index: true,
    },
    status: {
      type: String,
      enum: ['pending', 'sent', 'failed', 'skipped'],
      default: 'pending',
      index: true,
    },
    skipReason: {
      type: String,
      trim: true,
      default: '',
    },
    attemptCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    lastError: {
      type: String,
      trim: true,
      default: '',
    },
    idempotencyKey: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    subject: {
      type: String,
      trim: true,
      default: '',
    },
    // Snapshot of metrics at dispatch time
    sessionName: {
      type: String,
      trim: true,
      default: '',
    },
    sessionDate: {
      type: Date,
    },
    attendanceStatus: {
      type: String,
      trim: true,
      default: '',
    },
    remainingClasses: {
      type: Number,
      default: null,
    },
    totalClasses: {
      type: Number,
      default: null,
    },
    packageName: {
      type: String,
      trim: true,
      default: '',
    },
    outstandingDuesPaise: {
      type: Number,
      default: null,
    },
    sentAt: {
      type: Date,
    },
    messageId: {
      type: String,
      trim: true,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate notifications for the same attendance and notification type
notificationSchema.index({ attendance: 1, notificationType: 1 }, { unique: true });
notificationSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Notification', notificationSchema);
