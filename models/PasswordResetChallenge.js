const mongoose = require('mongoose');

const passwordResetChallengeSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    teacherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Teacher',
      required: true,
    },
    // Keyed HMAC/hash of the 6-digit OTP — plaintext OTP is NEVER stored
    otpHash: {
      type: String,
      required: true,
    },
    // Expiration timestamp for OTP (typically 5 minutes)
    expiresAt: {
      type: Date,
      required: true,
    },
    // Failed attempt tracking to prevent brute-forcing (max 5)
    attempts: {
      type: Number,
      default: 0,
    },
    maxAttempts: {
      type: Number,
      default: 5,
    },
    // Earliest timestamp when a resend is permitted (60s cooldown)
    resendAvailableAt: {
      type: Date,
      required: true,
    },
    // Set to true once the OTP is successfully verified
    verified: {
      type: Boolean,
      default: false,
    },
    verifiedAt: {
      type: Date,
      default: null,
    },
    // Single-purpose, short-lived reset authorization token hash (SHA-256)
    resetTokenHash: {
      type: String,
      default: null,
    },
    resetTokenExpiresAt: {
      type: Date,
      default: null,
    },
    // Flag set once password has been successfully updated
    used: {
      type: Boolean,
      default: false,
    },
    usedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

// TTL index to automatically purge expired challenges from MongoDB
passwordResetChallengeSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 3600 });

module.exports = mongoose.model('PasswordResetChallenge', passwordResetChallengeSchema);
