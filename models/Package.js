const mongoose = require('mongoose');

/* ──────────────────────────────────────────────────────────
   Package Model — ManthraBeads Class Packages & Ledger (Stage 4)
   Stores monetary values in integer paise (₹1 = 100 paise)
   ────────────────────────────────────────────────────────── */

const packageSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: [true, 'Student reference is required'],
      index: true,
    },
    packageName: {
      type: String,
      required: [true, 'Package name is required'],
      trim: true,
      maxlength: [100, 'Package name cannot exceed 100 characters'],
    },
    totalClasses: {
      type: Number,
      required: [true, 'Number of classes is required'],
      min: [1, 'Package must contain at least 1 class'],
      max: [500, 'Package cannot exceed 500 classes'],
      validate: {
        validator: Number.isInteger,
        message: 'Number of classes must be a whole integer',
      },
    },
    consumedClasses: {
      type: Number,
      default: 0,
      min: [0, 'Consumed classes cannot be negative'],
      validate: {
        validator: Number.isInteger,
        message: 'Consumed classes must be a whole integer',
      },
    },
    totalPricePaise: {
      type: Number,
      required: [true, 'Total price is required'],
      min: [0, 'Package price cannot be negative'],
      validate: {
        validator: Number.isInteger,
        message: 'Total price in paise must be an integer',
      },
    },
    amountPaidPaise: {
      type: Number,
      default: 0,
      min: [0, 'Amount paid cannot be negative'],
      validate: {
        validator: Number.isInteger,
        message: 'Amount paid in paise must be an integer',
      },
    },
    status: {
      type: String,
      enum: ['active', 'exhausted', 'cancelled', 'expired'],
      default: 'active',
      index: true,
    },
    purchaseDate: {
      type: Date,
      default: Date.now,
      required: true,
    },
    expiryDate: {
      type: Date,
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [500, 'Notes cannot exceed 500 characters'],
      default: '',
    },
    consumedSessionIds: [
      {
        type: String,
        trim: true,
      },
    ],
    recordedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Teacher',
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for ledger queries
packageSchema.index({ student: 1, status: 1 });
packageSchema.index({ createdAt: -1 });

/* ── Financial & Class Credit Virtuals ── */

/**
 * Base price per class in paise.
 * Rounding policy: Math.floor(total / classes).
 * Any remaining paise fraction is absorbed in the final class completion.
 */
packageSchema.virtual('pricePerClassPaise').get(function () {
  if (!this.totalClasses || this.totalClasses <= 0) return 0;
  return Math.floor(this.totalPricePaise / this.totalClasses);
});

/**
 * Number of unconsumed classes remaining.
 */
packageSchema.virtual('remainingClasses').get(function () {
  return Math.max(0, this.totalClasses - (this.consumedClasses || 0));
});

/**
 * Outstanding dues on this package (amount unpaid).
 */
packageSchema.virtual('outstandingDuesPaise').get(function () {
  return Math.max(0, this.totalPricePaise - (this.amountPaidPaise || 0));
});

/**
 * Value of classes consumed so far in paise.
 * When all classes are consumed, equals the full package price.
 */
packageSchema.virtual('consumedValuePaise').get(function () {
  const consumed = this.consumedClasses || 0;
  if (consumed <= 0) return 0;
  if (consumed >= this.totalClasses) return this.totalPricePaise;
  return consumed * this.pricePerClassPaise;
});

/**
 * Unused prepaid balance in paise.
 * Money paid by student that has not yet been consumed by completed classes.
 * Formula: Math.max(0, amountPaidPaise - consumedValuePaise)
 */
packageSchema.virtual('unusedPrepaidBalancePaise').get(function () {
  const paid = this.amountPaidPaise || 0;
  const consumedVal = this.consumedValuePaise;
  return Math.max(0, paid - consumedVal);
});

/* ── Formatting Helpers (Rupees) ── */
packageSchema.methods.formatRupees = function (paiseAmount) {
  const rs = (paiseAmount / 100).toFixed(2);
  return rs.endsWith('.00') ? `₹${parseInt(rs, 10).toLocaleString('en-IN')}` : `₹${parseFloat(rs).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

/**
 * Atomic class credit consumption method for Stage 5 attendance integration.
 * Safely decrements 1 remaining class credit and updates status to 'exhausted'
 * if all classes have been consumed. Prevents duplicate session consumption and over-consumption.
 */
packageSchema.statics.consumeOneClassCredit = async function (packageId, sessionId = null) {
  const pkg = await this.findById(packageId);

  if (!pkg) {
    return { success: false, reason: 'NOT_FOUND' };
  }

  if (pkg.status !== 'active') {
    return { success: false, reason: 'PACKAGE_NOT_ACTIVE', status: pkg.status, pkg };
  }

  if (pkg.consumedClasses >= pkg.totalClasses) {
    return { success: false, reason: 'EXHAUSTED', pkg };
  }

  if (!pkg.consumedSessionIds) {
    pkg.consumedSessionIds = [];
  }

  if (sessionId && pkg.consumedSessionIds.includes(String(sessionId))) {
    return { success: false, reason: 'DUPLICATE_SESSION', pkg };
  }

  pkg.consumedClasses += 1;
  if (sessionId) {
    pkg.consumedSessionIds.push(String(sessionId));
  }

  if (pkg.consumedClasses >= pkg.totalClasses) {
    pkg.status = 'exhausted';
  }

  await pkg.save();
  return { success: true, pkg };
};

/**
 * Atomic class credit reversal method for Stage 5 attendance corrections.
 */
packageSchema.statics.revertOneClassCredit = async function (packageId, sessionId = null) {
  const pkg = await this.findById(packageId);

  if (!pkg) {
    return { success: false, reason: 'NOT_FOUND' };
  }

  if (pkg.consumedClasses <= 0) {
    return { success: false, reason: 'NOTHING_TO_REVERT', pkg };
  }

  if (!pkg.consumedSessionIds) {
    pkg.consumedSessionIds = [];
  }

  if (sessionId && pkg.consumedSessionIds) {
    const idx = pkg.consumedSessionIds.indexOf(String(sessionId));
    if (idx !== -1) {
      pkg.consumedSessionIds.splice(idx, 1);
    }
  }

  pkg.consumedClasses -= 1;
  if (pkg.status === 'exhausted' && pkg.consumedClasses < pkg.totalClasses) {
    pkg.status = 'active';
  }

  await pkg.save();
  return { success: true, pkg };
};

/**
 * Helper to fetch the student's current active package with remaining credits (FIFO order).
 */
packageSchema.statics.getActivePackageForStudent = async function (studentId) {
  if (!studentId || !mongoose.Types.ObjectId.isValid(studentId)) {
    return null;
  }
  return this.findOne({
    student: studentId,
    status: 'active',
    $expr: { $lt: ['$consumedClasses', '$totalClasses'] },
  }).sort({ createdAt: 1 });
};

module.exports = mongoose.model('Package', packageSchema);
