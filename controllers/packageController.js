const mongoose = require('mongoose');
const Package = require('../models/Package');
const Payment = require('../models/Payment');
const Student = require('../models/Student');

/* ──────────────────────────────────────────────────────────
   Package & Payment Ledger Controller — Stage 4
   ────────────────────────────────────────────────────────── */

// Helper to format paise to readable rupees (e.g., ₹1,000 or ₹750.50)
function formatRupees(paise) {
  if (typeof paise !== 'number' || isNaN(paise)) return '₹0';
  const rs = (paise / 100).toFixed(2);
  return rs.endsWith('.00')
    ? `₹${parseInt(rs, 10).toLocaleString('en-IN')}`
    : `₹${parseFloat(rs).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

const PRESET_PACKAGES = [
  { name: '4-Class Starter Pack', classes: 4, priceRs: 1000 },
  { name: '8-Class Monthly Pack', classes: 8, priceRs: 2000 },
  { name: '12-Class Term Pack', classes: 12, priceRs: 2800 },
  { name: '24-Class Level Mastery', classes: 24, priceRs: 5200 },
];

/* ── GET /teacher/packages ── */
exports.listPackages = async (req, res) => {
  try {
    const statusFilter = req.query.status || 'all';
    const filter = {};
    if (['active', 'exhausted', 'cancelled'].includes(statusFilter)) {
      filter.status = statusFilter;
    }

    // Fetch packages with populated student
    const packages = await Package.find(filter)
      .populate('student', 'name studentId phone level status')
      .sort({ createdAt: -1 })
      .lean({ virtuals: true });

    // Fetch recent 10 payments for the financial ledger feed
    const recentPayments = await Payment.find({ status: 'valid' })
      .populate('student', 'name studentId')
      .populate('package', 'packageName')
      .sort({ paymentDate: -1 })
      .limit(10)
      .lean();

    // Calculate aggregate ledger statistics
    let totalRevenuePaise = 0;
    let totalDuesPaise = 0;
    let activePackagesCount = 0;
    let totalRemainingClasses = 0;

    // Aggregate all valid payments for lifetime revenue
    const revenueAgg = await Payment.aggregate([
      { $match: { status: 'valid' } },
      { $group: { _id: null, total: { $sum: '$amountPaise' } } },
    ]);
    if (revenueAgg.length > 0) {
      totalRevenuePaise = revenueAgg[0].total;
    }

    // Compute dues and counts from active packages
    const allActive = await Package.find({ status: 'active' }).lean({ virtuals: true });
    activePackagesCount = allActive.length;

    for (const pkg of allActive) {
      const price = pkg.totalPricePaise || 0;
      const paid = pkg.amountPaidPaise || 0;
      const consumed = pkg.consumedClasses || 0;
      const total = pkg.totalClasses || 0;
      totalDuesPaise += Math.max(0, price - paid);
      totalRemainingClasses += Math.max(0, total - consumed);
    }

    res.render('teacher/packages/index', {
      teacher: res.locals.teacher,
      csrfToken: res.locals.csrfToken,
      activeSection: 'packages',
      packages,
      recentPayments,
      stats: {
        totalRevenue: formatRupees(totalRevenuePaise),
        totalDues: formatRupees(totalDuesPaise),
        activeCount: activePackagesCount,
        remainingClasses: totalRemainingClasses,
      },
      currentStatus: statusFilter,
      formatRupees,
    });
  } catch (err) {
    console.error('List packages error:', err);
    res.status(500).render('teacher/packages/index', {
      teacher: res.locals.teacher,
      csrfToken: res.locals.csrfToken,
      activeSection: 'packages',
      packages: [],
      recentPayments: [],
      stats: {
        totalRevenue: '₹0',
        totalDues: '₹0',
        activeCount: 0,
        remainingClasses: 0,
      },
      currentStatus: 'all',
      error: 'Unable to load packages ledger. Please try again.',
      formatRupees,
    });
  }
};

/* ── GET /teacher/students/:id/packages/new ── */
exports.showAssignPackageForm = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).redirect('/teacher/students?error=not_found');
    }

    const student = await Student.findById(id).lean();
    if (!student) {
      return res.status(404).redirect('/teacher/students?error=not_found');
    }

    res.render('teacher/packages/new', {
      teacher: res.locals.teacher,
      csrfToken: res.locals.csrfToken,
      activeSection: 'packages',
      student,
      presets: PRESET_PACKAGES,
      errors: {},
      form: {
        packageName: PRESET_PACKAGES[0].name,
        totalClasses: PRESET_PACKAGES[0].classes,
        priceRupees: PRESET_PACKAGES[0].priceRs,
        initialPaymentRupees: PRESET_PACKAGES[0].priceRs,
        paymentMethod: 'upi',
        referenceNumber: '',
        purchaseDate: new Date().toISOString().split('T')[0],
        notes: '',
      },
    });
  } catch (err) {
    console.error('Show assign package form error:', err);
    res.redirect('/teacher/students');
  }
};

/* ── POST /teacher/students/:id/packages ── */
exports.assignPackage = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).redirect('/teacher/students?error=not_found');
    }

    const student = await Student.findById(id);
    if (!student) {
      return res.status(404).redirect('/teacher/students?error=not_found');
    }

    const errors = {};
    const packageName = (req.body.packageName || '').trim();
    const totalClasses = parseInt(req.body.totalClasses, 10);
    const priceRupees = parseFloat(req.body.priceRupees);
    const initialPaymentRupees = parseFloat(req.body.initialPaymentRupees || 0);

    if (!packageName) {
      errors.packageName = 'Package name is required.';
    }

    if (isNaN(totalClasses) || totalClasses < 1 || totalClasses > 500) {
      errors.totalClasses = 'Please enter a valid class count between 1 and 500.';
    }

    if (isNaN(priceRupees) || priceRupees < 0) {
      errors.priceRupees = 'Please enter a valid package price.';
    }

    if (isNaN(initialPaymentRupees) || initialPaymentRupees < 0) {
      errors.initialPaymentRupees = 'Initial payment cannot be negative.';
    } else if (initialPaymentRupees > priceRupees) {
      errors.initialPaymentRupees = 'Initial payment cannot exceed total package price.';
    }

    if (Object.keys(errors).length > 0) {
      return res.status(400).render('teacher/packages/new', {
        teacher: res.locals.teacher,
        csrfToken: res.locals.csrfToken,
        activeSection: 'packages',
        student,
        presets: PRESET_PACKAGES,
        errors,
        form: { ...req.body },
      });
    }

    const totalPricePaise = Math.round(priceRupees * 100);
    const initialPaymentPaise = Math.round(initialPaymentRupees * 100);

    // Create Package record
    const newPackage = await Package.create({
      student: student._id,
      packageName,
      totalClasses,
      consumedClasses: 0,
      totalPricePaise,
      amountPaidPaise: initialPaymentPaise,
      status: 'active',
      purchaseDate: req.body.purchaseDate ? new Date(req.body.purchaseDate) : new Date(),
      notes: (req.body.notes || '').trim(),
      recordedBy: req.session.teacherId,
    });

    // If initial payment was made, record payment transaction
    if (initialPaymentPaise > 0) {
      await Payment.create({
        student: student._id,
        package: newPackage._id,
        amountPaise: initialPaymentPaise,
        type: 'payment',
        paymentDate: req.body.purchaseDate ? new Date(req.body.purchaseDate) : new Date(),
        paymentMethod: req.body.paymentMethod || 'upi',
        referenceNumber: (req.body.referenceNumber || '').trim(),
        notes: 'Initial payment recorded during package assignment',
        recordedBy: req.session.teacherId,
        status: 'valid',
      });
    }

    // POST-Redirect-GET to package details
    res.redirect(`/teacher/packages/${newPackage._id}?assigned=true`);
  } catch (err) {
    console.error('Assign package error:', err);
    res.status(500).redirect(`/teacher/students/${req.params.id}`);
  }
};

/* ── GET /teacher/packages/:id ── */
exports.showPackageDetails = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).redirect('/teacher/packages?error=not_found');
    }

    const pkg = await Package.findById(id)
      .populate('student')
      .populate('recordedBy', 'name email');

    if (!pkg) {
      return res.status(404).redirect('/teacher/packages?error=not_found');
    }

    // Query payment history for this package
    const payments = await Payment.find({ package: pkg._id })
      .sort({ paymentDate: -1, createdAt: -1 })
      .lean();

    let alertMessage = null;
    if (req.query.assigned) {
      alertMessage = `Package "${pkg.packageName}" successfully assigned to ${pkg.student.name}!`;
    } else if (req.query.payment_recorded) {
      alertMessage = 'Payment transaction successfully recorded in the ledger.';
    } else if (req.query.payment_cancelled) {
      alertMessage = 'Payment transaction has been cancelled and ledger adjusted.';
    }

    res.render('teacher/packages/show', {
      teacher: res.locals.teacher,
      csrfToken: res.locals.csrfToken,
      activeSection: 'packages',
      pkg,
      student: pkg.student,
      payments,
      alertMessage,
      formatRupees,
    });
  } catch (err) {
    console.error('Show package details error:', err);
    res.status(500).redirect('/teacher/packages?error=not_found');
  }
};

/* ── GET /teacher/packages/:id/payments/new ── */
exports.showRecordPaymentForm = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).redirect('/teacher/packages?error=not_found');
    }

    const pkg = await Package.findById(id).populate('student');
    if (!pkg) {
      return res.status(404).redirect('/teacher/packages?error=not_found');
    }

    const duesRs = (pkg.outstandingDuesPaise / 100).toFixed(2);

    res.render('teacher/packages/record-payment', {
      teacher: res.locals.teacher,
      csrfToken: res.locals.csrfToken,
      activeSection: 'packages',
      pkg,
      student: pkg.student,
      suggestedAmount: duesRs > 0 ? duesRs : '0',
      errors: {},
      form: {
        amountRupees: duesRs > 0 ? duesRs : '',
        paymentMethod: 'upi',
        paymentDate: new Date().toISOString().split('T')[0],
        referenceNumber: '',
        notes: '',
      },
      formatRupees,
    });
  } catch (err) {
    console.error('Show record payment error:', err);
    res.redirect('/teacher/packages');
  }
};

/* ── POST /teacher/packages/:id/payments ── */
exports.recordPayment = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).redirect('/teacher/packages?error=not_found');
    }

    const pkg = await Package.findById(id).populate('student');
    if (!pkg) {
      return res.status(404).redirect('/teacher/packages?error=not_found');
    }

    const amountRupees = parseFloat(req.body.amountRupees);
    const paymentMethod = req.body.paymentMethod || 'upi';
    const referenceNumber = (req.body.referenceNumber || '').trim();
    const notes = (req.body.notes || '').trim();
    const paymentDate = req.body.paymentDate ? new Date(req.body.paymentDate) : new Date();

    const errors = {};
    if (isNaN(amountRupees) || amountRupees <= 0) {
      errors.amountRupees = 'Payment amount must be greater than ₹0.';
    }

    if (Object.keys(errors).length > 0) {
      return res.status(400).render('teacher/packages/record-payment', {
        teacher: res.locals.teacher,
        csrfToken: res.locals.csrfToken,
        activeSection: 'packages',
        pkg,
        student: pkg.student,
        suggestedAmount: (pkg.outstandingDuesPaise / 100).toFixed(2),
        errors,
        form: { ...req.body },
        formatRupees,
      });
    }

    const amountPaise = Math.round(amountRupees * 100);

    // Create payment transaction
    await Payment.create({
      student: pkg.student._id,
      package: pkg._id,
      amountPaise,
      type: 'payment',
      paymentDate,
      paymentMethod,
      referenceNumber,
      notes,
      recordedBy: req.session.teacherId,
      status: 'valid',
    });

    // Atomically increment amountPaidPaise on package
    pkg.amountPaidPaise += amountPaise;
    await pkg.save();

    res.redirect(`/teacher/packages/${pkg._id}?payment_recorded=true`);
  } catch (err) {
    console.error('Record payment error:', err);
    res.status(500).redirect(`/teacher/packages/${req.params.id}`);
  }
};

/* ── POST /teacher/payments/:id/cancel ── */
exports.cancelPayment = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).redirect('/teacher/packages?error=not_found');
    }

    const payment = await Payment.findById(id);
    if (!payment || payment.status === 'cancelled') {
      return res.status(404).redirect('/teacher/packages?error=not_found');
    }

    const cancelReason = (req.body.cancelReason || 'Reversed by teacher').trim();

    payment.status = 'cancelled';
    payment.cancelReason = cancelReason;
    await payment.save();

    // Adjust package amountPaidPaise
    await Package.findByIdAndUpdate(payment.package, {
      $inc: { amountPaidPaise: -payment.amountPaise },
    });

    res.redirect(`/teacher/packages/${payment.package}?payment_cancelled=true`);
  } catch (err) {
    console.error('Cancel payment error:', err);
    res.redirect('/teacher/packages');
  }
};
