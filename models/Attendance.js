const mongoose = require('mongoose');

/* ──────────────────────────────────────────────────────────
   Attendance Model — Student Session Attendance (Stage 5)
   ────────────────────────────────────────────────────────── */

const attendanceSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: [true, 'Student reference is required'],
      index: true,
    },
    session: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Session',
      required: [true, 'Session reference is required'],
      index: true,
    },
    date: {
      type: Date,
      required: [true, 'Attendance date is required'],
      index: true,
    },
    status: {
      type: String,
      enum: {
        values: ['present', 'absent', 'late', 'excused'],
        message: '{VALUE} is not a supported attendance status',
      },
      default: 'present',
      required: true,
      index: true,
    },
    package: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Package',
      index: true,
    },
    creditConsumed: {
      type: Boolean,
      default: false,
    },
    creditStatus: {
      type: String,
      enum: ['consumed', 'reverted', 'no_package', 'none'],
      default: 'none',
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [500, 'Notes cannot exceed 500 characters'],
      default: '',
    },
    recordedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Teacher',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Unique compound index: prevent duplicate attendance for the same student and session
attendanceSchema.index({ student: 1, session: 1 }, { unique: true });
attendanceSchema.index({ date: -1 });

module.exports = mongoose.model('Attendance', attendanceSchema);
