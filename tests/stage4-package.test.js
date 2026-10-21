const test = require('node:test');
const assert = require('node:assert/strict');
const mongoose = require('mongoose');

const Package = require('../models/Package');
const Payment = require('../models/Payment');
const Student = require('../models/Student');
const packageController = require('../controllers/packageController');
const dashboardController = require('../controllers/dashboardController');

// ── 1. Model Validation & Constraints ──
test('Package Model: validates required fields', async () => {
  const pkg = new Package({});
  let err;
  try {
    await pkg.validate();
  } catch (e) {
    err = e;
  }

  assert.ok(err, 'Validation should fail on empty package');
  assert.ok(err.errors.student, 'Student reference should be required');
  assert.ok(err.errors.packageName, 'Package name should be required');
  assert.ok(err.errors.totalClasses, 'Total classes should be required');
  assert.ok(err.errors.totalPricePaise, 'Total price in paise should be required');
});

test('Package Model: enforces non-negative integer paise and valid class count', async () => {
  const mockStudentId = new mongoose.Types.ObjectId();
  
  // Non-integer paise test
  const decimalPkg = new Package({
    student: mockStudentId,
    packageName: 'Standard',
    totalClasses: 8,
    totalPricePaise: 1000.5,
  });
  let decErr;
  try {
    await decimalPkg.validate();
  } catch (e) {
    decErr = e;
  }
  assert.ok(decErr && decErr.errors.totalPricePaise, 'Total price paise must be an integer');

  // Negative classes test
  const negativeClassesPkg = new Package({
    student: mockStudentId,
    packageName: 'Invalid',
    totalClasses: 0,
    totalPricePaise: 50000,
  });
  let negClassesErr;
  try {
    await negativeClassesPkg.validate();
  } catch (e) {
    negClassesErr = e;
  }
  assert.ok(negClassesErr && negClassesErr.errors.totalClasses, 'Total classes must be >= 1');
});

test('Payment Model: validates required fields and integer paise', async () => {
  const payment = new Payment({});
  let err;
  try {
    await payment.validate();
  } catch (e) {
    err = e;
  }
  assert.ok(err, 'Validation should fail on empty payment');
  assert.ok(err.errors.student, 'Student should be required');
  assert.ok(err.errors.package, 'Package should be required');
  assert.ok(err.errors.amountPaise, 'Amount in paise should be required');

  const validPayment = new Payment({
    student: new mongoose.Types.ObjectId(),
    package: new mongoose.Types.ObjectId(),
    amountPaise: 25000, // ₹250.00
    paymentMethod: 'upi',
  });
  let validErr;
  try {
    await validPayment.validate();
  } catch (e) {
    validErr = e;
  }
  assert.equal(validErr, undefined, 'Valid payment should pass validation');
  assert.equal(validPayment.status, 'valid', 'Default status should be valid');
});

// ── 2. The ₹1,000 / 4-Class Financial Walkthrough ──
test('Financial Calculations: ₹1,000 / 4-class complete lifecycle', () => {
  const mockStudentId = new mongoose.Types.ObjectId();
  
  // Initially: ₹1,000 price, 4 classes, fully paid ₹1,000
  const pkg = new Package({
    student: mockStudentId,
    packageName: '4-Class Starter',
    totalClasses: 4,
    totalPricePaise: 100000, // ₹1,000
    amountPaidPaise: 100000,  // ₹1,000
    consumedClasses: 0,
    status: 'active',
  });

  // Verification at purchase (0 classes consumed)
  assert.equal(pkg.pricePerClassPaise, 25000, 'Price per class is ₹250 (25000 paise)');
  assert.equal(pkg.remainingClasses, 4, 'Remaining classes should be 4');
  assert.equal(pkg.outstandingDuesPaise, 0, 'Outstanding dues should be ₹0');
  assert.equal(pkg.consumedValuePaise, 0, 'Consumed value should be ₹0');
  assert.equal(pkg.unusedPrepaidBalancePaise, 100000, 'Unused prepaid balance should be ₹1,000');

  // After 1 completed class
  pkg.consumedClasses = 1;
  assert.equal(pkg.remainingClasses, 3, 'Remaining classes should be 3');
  assert.equal(pkg.consumedValuePaise, 25000, 'Consumed value should be ₹250');
  assert.equal(pkg.unusedPrepaidBalancePaise, 75000, 'Unused prepaid balance should be ₹750');
  assert.equal(pkg.outstandingDuesPaise, 0, 'Outstanding dues should remain ₹0');

  // After 2 completed classes
  pkg.consumedClasses = 2;
  assert.equal(pkg.remainingClasses, 2, 'Remaining classes should be 2');
  assert.equal(pkg.consumedValuePaise, 50000, 'Consumed value should be ₹500');
  assert.equal(pkg.unusedPrepaidBalancePaise, 50000, 'Unused prepaid balance should be ₹500');

  // After all 4 classes completed
  pkg.consumedClasses = 4;
  pkg.status = 'exhausted';
  assert.equal(pkg.remainingClasses, 0, 'Remaining classes should be 0');
  assert.equal(pkg.consumedValuePaise, 100000, 'Consumed value should be ₹1,000');
  assert.equal(pkg.unusedPrepaidBalancePaise, 0, 'Unused prepaid balance should be ₹0');
  assert.equal(pkg.status, 'exhausted', 'Package should be marked exhausted');
});

// ── 3. Partial Payments & Separation of Metrics ──
test('Financial Calculations: Partial payment distinction (₹400 paid on ₹1,000 package)', () => {
  const mockStudentId = new mongoose.Types.ObjectId();
  
  const pkg = new Package({
    student: mockStudentId,
    packageName: '4-Class Partial',
    totalClasses: 4,
    totalPricePaise: 100000, // ₹1,000
    amountPaidPaise: 40000,   // ₹400 received so far
    consumedClasses: 0,
    status: 'active',
  });

  // Initial state with partial payment
  assert.equal(pkg.totalPricePaise, 100000, 'Package price is ₹1,000');
  assert.equal(pkg.amountPaidPaise, 40000, 'Amount paid is ₹400');
  assert.equal(pkg.outstandingDuesPaise, 60000, 'Outstanding dues are ₹600');
  assert.equal(pkg.consumedValuePaise, 0, 'Consumed value is ₹0');
  assert.equal(pkg.unusedPrepaidBalancePaise, 40000, 'Unused prepaid balance is ₹400 (not ₹1,000!)');

  // After 1 class consumed (₹250 value)
  pkg.consumedClasses = 1;
  assert.equal(pkg.consumedValuePaise, 25000, '1 class consumed value is ₹250');
  assert.equal(pkg.unusedPrepaidBalancePaise, 15000, 'Unused prepaid balance drops to ₹150 (40000 - 25000)');
  assert.equal(pkg.outstandingDuesPaise, 60000, 'Outstanding dues remain ₹600');

  // After 2 classes consumed (₹500 value)
  // Student paid ₹400, but has taken ₹500 worth of classes.
  // Unused prepaid balance must be bounded at 0, not negative!
  pkg.consumedClasses = 2;
  assert.equal(pkg.consumedValuePaise, 50000, '2 classes consumed value is ₹500');
  assert.equal(pkg.unusedPrepaidBalancePaise, 0, 'Unused prepaid balance is bounded at 0, never negative');
  assert.equal(pkg.outstandingDuesPaise, 60000, 'Outstanding dues remain ₹600');
});

// ── 4. Fractional Per-Class Rounding Policy ──
test('Financial Calculations: Fractional per-class rounding policy (₹1,000 / 3 classes)', () => {
  const mockStudentId = new mongoose.Types.ObjectId();
  
  const pkg = new Package({
    student: mockStudentId,
    packageName: '3-Class Intensive',
    totalClasses: 3,
    totalPricePaise: 100000, // ₹1,000
    amountPaidPaise: 100000,
    consumedClasses: 0,
  });

  // Base price per class: Math.floor(100000 / 3) = 33333 paise (₹333.33)
  assert.equal(pkg.pricePerClassPaise, 33333, 'Base class price is rounded down to integer paise (33333)');

  // 1 class consumed: 33333 paise
  pkg.consumedClasses = 1;
  assert.equal(pkg.consumedValuePaise, 33333);
  assert.equal(pkg.unusedPrepaidBalancePaise, 100000 - 33333); // 66667 paise

  // 2 classes consumed: 66666 paise
  pkg.consumedClasses = 2;
  assert.equal(pkg.consumedValuePaise, 66666);
  assert.equal(pkg.unusedPrepaidBalancePaise, 100000 - 66666); // 33334 paise

  // 3 classes consumed (all consumed): absorbed to full package price, zero remainder loss
  pkg.consumedClasses = 3;
  assert.equal(pkg.consumedValuePaise, 100000, 'Consumed value absorbs full ₹1,000 with 0 remainder loss');
  assert.equal(pkg.unusedPrepaidBalancePaise, 0, 'Unused balance is exactly 0 paise');
});

// ── 5. Payment Ledger Reversal / Refund Tracking ──
test('Payment Ledger: Soft reversal preserves audit trail without deleting records', () => {
  const payment = new Payment({
    student: new mongoose.Types.ObjectId(),
    package: new mongoose.Types.ObjectId(),
    amountPaise: 50000,
    paymentMethod: 'cash',
    referenceNumber: 'RCPT-001',
    recordedBy: new mongoose.Types.ObjectId(),
  });

  assert.equal(payment.status, 'valid');
  assert.equal(payment.cancelReason, '');

  // Apply reversal
  payment.status = 'cancelled';
  payment.cancelReason = 'Entered wrong amount by mistake';

  assert.equal(payment.status, 'cancelled');
  assert.equal(payment.amountPaise, 50000, 'Original amount is preserved for audit trail');
  assert.equal(payment.cancelReason, 'Entered wrong amount by mistake');
});

// ── 6. Stage 5 Attendance Consumption Boundary & Idempotency ──
test('Attendance Boundary: consumeOneClassCredit handles exhaustion and duplicate sessions', async () => {
  // Unit test without real DB connection by mocking Package.findById
  const mockPkg = new Package({
    _id: new mongoose.Types.ObjectId(),
    student: new mongoose.Types.ObjectId(),
    packageName: 'Attendance Test Pack',
    totalClasses: 2,
    totalPricePaise: 50000,
    consumedClasses: 0,
    status: 'active',
    consumedSessionIds: [],
  });

  // Mock save
  mockPkg.save = async function() { return this; };

  const origFindById = Package.findById;
  Package.findById = async function(id) {
    if (String(id) === String(mockPkg._id)) return mockPkg;
    return null;
  };

  try {
    // 1st consumption: Session 101
    const res1 = await Package.consumeOneClassCredit(mockPkg._id, 'session-101');
    assert.equal(res1.success, true, 'First class consumed successfully');
    assert.equal(mockPkg.consumedClasses, 1);
    assert.equal(mockPkg.status, 'active');
    assert.ok(mockPkg.consumedSessionIds.includes('session-101'));

    // Duplicate consumption attempt for Session 101
    const dupRes = await Package.consumeOneClassCredit(mockPkg._id, 'session-101');
    assert.equal(dupRes.success, false, 'Duplicate session credit consumption rejected');
    assert.equal(dupRes.reason, 'DUPLICATE_SESSION');
    assert.equal(mockPkg.consumedClasses, 1, 'Credit was NOT deducted again');

    // 2nd consumption: Session 102 (exhausts package)
    const res2 = await Package.consumeOneClassCredit(mockPkg._id, 'session-102');
    assert.equal(res2.success, true, 'Second class consumed successfully');
    assert.equal(mockPkg.consumedClasses, 2);
    assert.equal(mockPkg.status, 'exhausted', 'Package is marked exhausted upon reaching total classes');

    // Attempting to consume on exhausted package
    const resExhausted = await Package.consumeOneClassCredit(mockPkg._id, 'session-103');
    assert.equal(resExhausted.success, false, 'Cannot consume beyond package limit');
    assert.equal(resExhausted.reason, 'PACKAGE_NOT_ACTIVE');

    // Reverting Session 102
    const revertRes = await Package.revertOneClassCredit(mockPkg._id, 'session-102');
    assert.equal(revertRes.success, true, 'Session 102 credit reverted');
    assert.equal(mockPkg.consumedClasses, 1);
    assert.equal(mockPkg.status, 'active', 'Status returned to active');
    assert.ok(!mockPkg.consumedSessionIds.includes('session-102'), 'Session ID removed');
  } finally {
    Package.findById = origFindById;
  }
});

// ── 7. Input Validation & Resilience in Controllers ──
test('Package Controller: Rejects invalid ObjectIds gracefully', async () => {
  const req = {
    params: { id: 'invalid-id' },
    session: { teacherId: 'mock-teacher-id' },
  };
  let redirectedUrl = null;
  let statusSet = null;
  const res = {
    status(code) { statusSet = code; return this; },
    redirect(url) { redirectedUrl = url; },
    render() { throw new Error('Render should not be called on invalid ID'); },
    locals: { teacher: {}, csrfToken: 'mock' },
  };

  await packageController.showPackageDetails(req, res);
  assert.equal(statusSet, 404);
  assert.ok(redirectedUrl.includes('error=not_found'));
});

test('Dashboard Controller: handles package dues calculation without crash on disconnected state', async () => {
  const req = {
    session: { teacherId: 'mock' },
    query: {},
  };
  let renderedView = null;
  let viewData = null;
  const res = {
    render(view, data) {
      renderedView = view;
      viewData = data;
    },
    locals: { teacher: { username: 'teacher' } },
  };

  await dashboardController.showDashboard(req, res);
  assert.equal(renderedView, 'teacher/dashboard');
  assert.ok(viewData.duesSummary !== undefined, 'Dues summary object must be present in dashboard view data');
  assert.equal(typeof viewData.duesSummary.totalDuesPaise, 'number', 'totalDuesPaise should be a number');
  assert.equal(typeof viewData.duesSummary.duesCount, 'number', 'duesCount should be a number');
});
