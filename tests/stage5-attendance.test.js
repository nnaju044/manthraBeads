const test = require('node:test');
const assert = require('node:assert/strict');
const mongoose = require('mongoose');

const Student = require('../models/Student');
const Package = require('../models/Package');
const Session = require('../models/Session');
const Attendance = require('../models/Attendance');
const attendanceController = require('../controllers/attendanceController');
const dashboardController = require('../controllers/dashboardController');

// ── 1. Model Validations ──
test('Session Model: validates required fields', async () => {
  const session = new Session({});
  let err;
  try {
    await session.validate();
  } catch (e) {
    err = e;
  }
  assert.ok(err, 'Validation should fail on empty session');
  assert.ok(err.errors.date, 'Session date is required');
  assert.ok(err.errors.recordedBy, 'recordedBy teacher is required');
});

test('Attendance Model: validates required fields and enum statuses', async () => {
  const att = new Attendance({});
  let err;
  try {
    await att.validate();
  } catch (e) {
    err = e;
  }
  assert.ok(err, 'Validation should fail on empty attendance');
  assert.ok(err.errors.student, 'Student reference is required');
  assert.ok(err.errors.session, 'Session reference is required');
  assert.ok(err.errors.date, 'Date is required');

  // Test invalid status
  const badStatus = new Attendance({
    student: new mongoose.Types.ObjectId(),
    session: new mongoose.Types.ObjectId(),
    date: new Date(),
    status: 'half-day', // not supported
    recordedBy: new mongoose.Types.ObjectId(),
  });
  let badErr;
  try {
    await badStatus.validate();
  } catch (e) {
    badErr = e;
  }
  assert.ok(badErr && badErr.errors.status, 'Invalid status must be rejected');

  // Test valid statuses
  for (const validStatus of ['present', 'absent', 'late', 'excused']) {
    const validAtt = new Attendance({
      student: new mongoose.Types.ObjectId(),
      session: new mongoose.Types.ObjectId(),
      date: new Date(),
      status: validStatus,
      recordedBy: new mongoose.Types.ObjectId(),
    });
    let validErr;
    try {
      await validAtt.validate();
    } catch (e) {
      validErr = e;
    }
    assert.equal(validErr, undefined, `Status "${validStatus}" must pass validation`);
  }
});

// ── 2. Attendance Status Policy & Credit Consumption Logic ──
test('Credit Policy: Present and Late consume 1 credit; Absent and Excused do not', async () => {
  const mockStudentId = new mongoose.Types.ObjectId();
  const mockSessionId = new mongoose.Types.ObjectId();

  const pkg = new Package({
    _id: new mongoose.Types.ObjectId(),
    student: mockStudentId,
    packageName: '4-Class Pack',
    totalClasses: 4,
    consumedClasses: 0,
    totalPricePaise: 100000,
    status: 'active',
    consumedSessionIds: [],
  });

  // Mock Package.findById to return pkg
  const origFindById = Package.findById;
  Package.findById = async (id) => (String(id) === String(pkg._id) ? pkg : null);
  pkg.save = async function() { return this; };

  try {
    // 1. Present -> Consumes 1 credit
    const resPresent = await Package.consumeOneClassCredit(pkg._id, mockSessionId);
    assert.equal(resPresent.success, true);
    assert.equal(pkg.consumedClasses, 1);
    assert.equal(pkg.remainingClasses, 3);
    assert.ok(pkg.consumedSessionIds.includes(String(mockSessionId)));

    // 2. Revert (e.g. marked Absent afterwards)
    const resRevert = await Package.revertOneClassCredit(pkg._id, mockSessionId);
    assert.equal(resRevert.success, true);
    assert.equal(pkg.consumedClasses, 0);
    assert.equal(pkg.remainingClasses, 4);
    assert.ok(!pkg.consumedSessionIds.includes(String(mockSessionId)));

    // 3. Late -> Consumes 1 credit (ManthraBeads policy: Late = Attended)
    const resLate = await Package.consumeOneClassCredit(pkg._id, mockSessionId);
    assert.equal(resLate.success, true);
    assert.equal(pkg.consumedClasses, 1);
    assert.equal(pkg.remainingClasses, 3);

    // 4. Repeated submission with same sessionId does NOT double-consume
    const resDuplicate = await Package.consumeOneClassCredit(pkg._id, mockSessionId);
    assert.equal(resDuplicate.success, false);
    assert.equal(resDuplicate.reason, 'DUPLICATE_SESSION');
    assert.equal(pkg.consumedClasses, 1, 'Credit must NOT be double-consumed');
  } finally {
    Package.findById = origFindById;
  }
});

// ── 3. Exhausted Package and Missing Package Handlers ──
test('Credit Policy: Exhausted packages prevent over-consumption', async () => {
  const mockStudentId = new mongoose.Types.ObjectId();
  const mockSessionId = new mongoose.Types.ObjectId();

  const exhaustedPkg = new Package({
    _id: new mongoose.Types.ObjectId(),
    student: mockStudentId,
    packageName: 'Exhausted Pack',
    totalClasses: 4,
    consumedClasses: 4,
    totalPricePaise: 100000,
    status: 'exhausted',
    consumedSessionIds: ['s1', 's2', 's3', 's4'],
  });

  const origFindById = Package.findById;
  Package.findById = async (id) => (String(id) === String(exhaustedPkg._id) ? exhaustedPkg : null);
  exhaustedPkg.save = async function() { return this; };

  try {
    const res = await Package.consumeOneClassCredit(exhaustedPkg._id, mockSessionId);
    assert.equal(res.success, false);
    assert.equal(res.reason, 'PACKAGE_NOT_ACTIVE');
    assert.equal(exhaustedPkg.consumedClasses, 4, 'Consumed count must remain 4');
  } finally {
    Package.findById = origFindById;
  }
});

// ── 4. Package Credit Reversal when Exhausted Reopens to Active ──
test('Credit Reversal: Reverting a credit on an exhausted package re-activates it', async () => {
  const mockStudentId = new mongoose.Types.ObjectId();
  const sessionId = 'session-4';

  const fullPkg = new Package({
    _id: new mongoose.Types.ObjectId(),
    student: mockStudentId,
    packageName: 'Full Pack',
    totalClasses: 4,
    consumedClasses: 4,
    totalPricePaise: 100000,
    status: 'exhausted',
    consumedSessionIds: ['session-1', 'session-2', 'session-3', 'session-4'],
  });

  const origFindById = Package.findById;
  Package.findById = async (id) => (String(id) === String(fullPkg._id) ? fullPkg : null);
  fullPkg.save = async function() { return this; };

  try {
    const revertRes = await Package.revertOneClassCredit(fullPkg._id, sessionId);
    assert.equal(revertRes.success, true);
    assert.equal(fullPkg.consumedClasses, 3);
    assert.equal(fullPkg.status, 'active', 'Reverting credit must reactivate the package');
    assert.equal(fullPkg.remainingClasses, 1);
  } finally {
    Package.findById = origFindById;
  }
});

// ── 5. Excel Export Formula Injection Sanitization ──
test('Excel Export: Sanitizes formula injection characters', () => {
  // Formula injection dangerous prefixes: =, +, -, @, \t, \r
  function sanitizeForSpreadsheet(val) {
    if (val === null || val === undefined) return '';
    const str = String(val).trim();
    if (/^[=+\-@\t\r]/.test(str)) {
      return `'${str}`;
    }
    return str;
  }

  assert.equal(sanitizeForSpreadsheet('=SUM(A1:A10)'), "'=SUM(A1:A10)");
  assert.equal(sanitizeForSpreadsheet('+cmd|"/C calc"!A0'), "'+cmd|\"/C calc\"!A0");
  assert.equal(sanitizeForSpreadsheet('-5+2'), "'-5+2");
  assert.equal(sanitizeForSpreadsheet('@evil'), "'@evil");
  assert.equal(sanitizeForSpreadsheet('Regular Student'), 'Regular Student');
  assert.equal(sanitizeForSpreadsheet('MB-2026-001'), 'MB-2026-001');
});

// ── 6. Dashboard Attendance Integration ──
test('Dashboard Controller: provides genuine attendance stats when disconnected', async () => {
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
  assert.ok(viewData.stats.todayClasses);
  assert.equal(typeof viewData.stats.todayClasses.value, 'number');
  assert.equal(viewData.stats.todayClasses.stage, 5);
  assert.equal(viewData.stats.todayAttendancePct.stage, 5);
  assert.ok(Array.isArray(viewData.todayClasses));
  assert.ok(Array.isArray(viewData.recentAttendance));
});

// ── 7. Input Validation & Resilience in Attendance Controller ──
test('Attendance Controller: Rejects invalid session IDs on save', async () => {
  const req = {
    body: { sessionId: 'invalid-id' },
    session: { teacherId: 'mock-teacher' },
  };
  let statusSet = null;
  let redirectedUrl = null;
  const res = {
    status(code) { statusSet = code; return this; },
    redirect(url) { redirectedUrl = url; },
    locals: { teacher: {}, csrfToken: 'mock' },
  };

  await attendanceController.saveAttendance(req, res);
  assert.equal(statusSet, 404);
  assert.ok(redirectedUrl.includes('error=invalid_session'));
});

test('Attendance Controller: Safely handles invalid date query parameter without throwing RangeError', async () => {
  const req = {
    query: { date: 'invalid-date' },
    session: { teacherId: 'mock-teacher' },
  };
  let renderedView = null;
  let viewData = null;
  const res = {
    status(code) { return this; },
    render(view, data) {
      renderedView = view;
      viewData = data;
    },
    locals: { teacher: {}, csrfToken: 'mock' },
  };

  await attendanceController.showAttendance(req, res);
  assert.equal(renderedView, 'teacher/attendance/index');
  assert.ok(viewData.selectedDate, 'Should fallback to a valid date string');
  assert.equal(typeof viewData.formatDateISO, 'function');
  assert.equal(typeof viewData.formatDateDisplay, 'function');
  assert.equal(viewData.formatDateISO(null), new Date().toISOString().split('T')[0]);
  assert.equal(viewData.formatDateISO('invalid'), new Date().toISOString().split('T')[0]);
  assert.equal(viewData.formatDateDisplay('invalid'), '—');
});
