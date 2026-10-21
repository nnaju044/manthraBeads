const mongoose = require('mongoose');

/* ──────────────────────────────────────────────────────────
   Session Model — Class / Batch Session (Stage 5)
   ────────────────────────────────────────────────────────── */

const sessionSchema = new mongoose.Schema(
  {
    sessionName: {
      type: String,
      required: [true, 'Session or batch name is required'],
      trim: true,
      maxlength: [100, 'Session name cannot exceed 100 characters'],
      default: 'Regular Abacus Class',
    },
    date: {
      type: Date,
      required: [true, 'Session date is required'],
      index: true,
    },
    level: {
      type: String,
      trim: true,
      default: 'All Levels',
    },
    startTime: {
      type: String,
      trim: true,
      default: '10:00 AM',
    },
    endTime: {
      type: String,
      trim: true,
      default: '11:00 AM',
    },
    topic: {
      type: String,
      trim: true,
      maxlength: [200, 'Topic cannot exceed 200 characters'],
      default: '',
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [500, 'Notes cannot exceed 500 characters'],
      default: '',
    },
    status: {
      type: String,
      enum: ['scheduled', 'completed', 'cancelled'],
      default: 'completed',
      index: true,
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

// Indexes
sessionSchema.index({ date: -1, createdAt: -1 });

module.exports = mongoose.model('Session', sessionSchema);
