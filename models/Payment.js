const mongoose = require('mongoose');

/* ──────────────────────────────────────────────────────────
   Payment Model — ManthraBeads Payment Ledger (Stage 4)
   Stores monetary transactions in integer paise (₹1 = 100 paise)
   ────────────────────────────────────────────────────────── */

const paymentSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: [true, 'Student reference is required'],
      index: true,
    },
    package: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Package',
      required: [true, 'Package reference is required'],
      index: true,
    },
    amountPaise: {
      type: Number,
      required: [true, 'Payment amount is required'],
      validate: {
        validator: Number.isInteger,
        message: 'Payment amount in paise must be an integer',
      },
    },
    type: {
      type: String,
      enum: ['payment', 'refund', 'adjustment'],
      default: 'payment',
      required: true,
    },
    paymentDate: {
      type: Date,
      default: Date.now,
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: ['upi', 'cash', 'bank_transfer', 'cheque', 'other'],
      default: 'upi',
      required: true,
    },
    referenceNumber: {
      type: String,
      trim: true,
      maxlength: [100, 'Reference number cannot exceed 100 characters'],
      default: '',
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
    },
    status: {
      type: String,
      enum: ['valid', 'cancelled'],
      default: 'valid',
      index: true,
    },
    cancelReason: {
      type: String,
      trim: true,
      maxlength: [200, 'Cancel reason cannot exceed 200 characters'],
      default: '',
    },
  },
  { timestamps: true }
);

// Indexes
paymentSchema.index({ student: 1, paymentDate: -1 });
paymentSchema.index({ package: 1, status: 1 });

/**
 * Format paise into Indian Rupee display (e.g. ₹1,000 or ₹750.50)
 */
paymentSchema.methods.formatRupees = function () {
  const rs = (this.amountPaise / 100).toFixed(2);
  const formatted = rs.endsWith('.00')
    ? parseInt(rs, 10).toLocaleString('en-IN')
    : parseFloat(rs).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return `₹${formatted}`;
};

module.exports = mongoose.model('Payment', paymentSchema);
