const mongoose = require('mongoose');

/* ──────────────────────────────────────────────────────────
   Student Model — ManthraBeads Student Management (Stage 3)
   ────────────────────────────────────────────────────────── */

const studentSchema = new mongoose.Schema(
  {
    studentId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },
    name: {
      type: String,
      required: [true, 'Student full name is required'],
      trim: true,
      maxlength: [100, 'Student name cannot exceed 100 characters'],
    },
    parentName: {
      type: String,
      trim: true,
      maxlength: [100, 'Parent name cannot exceed 100 characters'],
      default: '',
    },
    studentEmail: {
      type: String,
      lowercase: true,
      trim: true,
      match: [
        /^$|^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        'Please provide a valid student email address',
      ],
      default: '',
    },
    parentEmail: {
      type: String,
      lowercase: true,
      trim: true,
      match: [
        /^$|^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        'Please provide a valid parent email address',
      ],
      default: '',
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
      maxlength: [20, 'Phone number cannot exceed 20 characters'],
    },
    enrollmentDate: {
      type: Date,
      default: Date.now,
      required: true,
    },
    level: {
      type: String,
      required: [true, 'Course / Abacus level is required'],
      trim: true,
      maxlength: [50, 'Level cannot exceed 50 characters'],
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [1000, 'Notes cannot exceed 1000 characters'],
      default: '',
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
      index: true,
    },
  },
  { timestamps: true }
);

// Search and lookup indexes
studentSchema.index({ name: 1 });
studentSchema.index({ phone: 1 });
studentSchema.index({ status: 1, enrollmentDate: -1 });

/**
 * Generate human-readable student ID: e.g. MB-1001, MB-1002
 */
studentSchema.statics.generateNextStudentId = async function () {
  const lastStudent = await this.findOne({}, { studentId: 1 })
    .sort({ createdAt: -1 })
    .lean();

  if (!lastStudent || !lastStudent.studentId) {
    return 'MB-1001';
  }

  const match = lastStudent.studentId.match(/MB-(\d+)/i);
  if (match && match[1]) {
    const nextNum = parseInt(match[1], 10) + 1;
    return `MB-${nextNum}`;
  }

  // Fallback to timestamp-based unique ID
  return `MB-${Date.now().toString().slice(-4)}`;
};

module.exports = mongoose.model('Student', studentSchema);
