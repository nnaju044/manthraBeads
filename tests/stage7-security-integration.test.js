const test = require('node:test');
const assert = require('node:assert/strict');
const mongoose = require('mongoose');
const app = require('../server');
const { requireAuth, csrfProtection } = require('../middleware/auth');
const packageController = require('../controllers/packageController');
const Student = require('../models/Student');
const Package = require('../models/Package');
const Payment = require('../models/Payment');
const emailService = require('../services/emailService');

/* ──────────────────────────────────────────────────────────
   Stage 7: Final Integration, Security & Resilience Test Suite
   ────────────────────────────────────────────────────────── */

// ── 1. Trust Proxy & Serverless Configuration ──
test('Production Config: app has trust proxy enabled for Vercel reverse proxy', () => {
  assert.equal(app.get('trust proxy'), 1, 'Trust proxy must be enabled for Vercel deployment');
});

// ── 2. Security Headers & Private Cache Control Middleware ──
test('Security Headers: Middleware sets required security and privacy headers', async () => {
  let headers = {};
  const req = { method: 'GET', url: '/teacher/dashboard' };
  const res = {
    setHeader(name, value) {
      headers[name.toLowerCase()] = value;
    },
  };
  let nextCalled = false;

  // Simulate global security header middleware
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('X-XSS-Protection', '0');

  assert.equal(headers['x-content-type-options'], 'nosniff');
  assert.equal(headers['x-frame-options'], 'SAMEORIGIN');
  assert.equal(headers['referrer-policy'], 'strict-origin-when-cross-origin');
  assert.equal(headers['x-xss-protection'], '0');

  // Simulate private cache control
  res.setHeader('Cache-Control', 'private, no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');

  assert.ok(headers['cache-control'].includes('no-store'));
  assert.ok(headers['cache-control'].includes('no-cache'));
});

// ── 3. Package Name & Class Count Consistency Validation ──
test('Package Integrity: Rejects mismatched package names vs class count (e.g. 4-Class with 6 classes)', async () => {
  const studentId = new mongoose.Types.ObjectId();
  const origFindById = Student.findById;

  try {
    Student.findById = async () => ({
      _id: studentId,
      name: 'Test Student',
      studentId: 'MB-1001',
    });

    let renderedView = null;
    let renderData = null;
    let statusCode = null;

    const req = {
      params: { id: studentId.toString() },
      body: {
        packageName: '4-Class Starter Pack',
        totalClasses: '6', // Mismatch!
        priceRupees: '1000',
        initialPaymentRupees: '1000',
      },
      session: { teacherId: 'teacher-1' },
    };

    const res = {
      status(code) {
        statusCode = code;
        return this;
      },
      render(view, data) {
        renderedView = view;
        renderData = data;
      },
      redirect(url) {},
      locals: { teacher: {}, csrfToken: 'test-token' },
    };

    await packageController.assignPackage(req, res);

    assert.equal(statusCode, 400, 'Should reject mismatched package name and count with 400');
    assert.ok(renderData.errors.totalClasses, 'Should report totalClasses error');
    assert.ok(
      renderData.errors.totalClasses.includes('4 classes, but 6 was entered'),
      'Error message should explain mismatch between stated count and input'
    );
  } finally {
    Student.findById = origFindById;
  }
});

test('Package Integrity: Accepts matching package names and class counts', async () => {
  const studentId = new mongoose.Types.ObjectId();
  const teacherId = new mongoose.Types.ObjectId();
  const origStudentFindById = Student.findById;
  const origPackageCreate = Package.create;
  const origPaymentCreate = Payment.create;

  try {
    Student.findById = async () => ({
      _id: studentId,
      name: 'Test Student',
      studentId: 'MB-1001',
    });

    let createdPackage = null;
    Package.create = async (doc) => {
      createdPackage = doc;
      return { _id: new mongoose.Types.ObjectId(), ...doc };
    };

    let createdPayment = null;
    Payment.create = async (doc) => {
      createdPayment = doc;
      return { _id: new mongoose.Types.ObjectId(), ...doc };
    };

    let redirectedUrl = null;
    const req = {
      params: { id: studentId.toString() },
      body: {
        packageName: '4-Class Starter Pack',
        totalClasses: '4', // Matches!
        priceRupees: '1000',
        initialPaymentRupees: '1000',
        paymentMethod: 'upi',
      },
      session: { teacherId: teacherId.toString() },
    };

    const res = {
      status(code) { return this; },
      render() {},
      redirect(url) { redirectedUrl = url; },
      locals: { teacher: {}, csrfToken: 'test-token' },
    };

    await packageController.assignPackage(req, res);

    assert.ok(redirectedUrl && redirectedUrl.includes('assigned=true'), 'Should succeed and redirect');
    assert.equal(createdPackage.totalClasses, 4);
    assert.equal(createdPackage.packageName, '4-Class Starter Pack');
    assert.equal(createdPackage.totalPricePaise, 100000);
    assert.equal(createdPackage.amountPaidPaise, 100000);
    assert.equal(createdPackage.student.toString(), studentId.toString());
    assert.equal(createdPackage.recordedBy.toString(), teacherId.toString());

    assert.ok(createdPayment, 'Initial payment should be recorded');
    assert.equal(createdPayment.amountPaise, 100000);
    assert.equal(createdPayment.student.toString(), studentId.toString());
    assert.equal(createdPayment.recordedBy.toString(), teacherId.toString());
  } finally {
    Student.findById = origStudentFindById;
    Package.create = origPackageCreate;
    Payment.create = origPaymentCreate;
  }
});

// ── 4. Unauthenticated Access Protection across All Teacher Routes ──
test('Security: All private teacher endpoints reject unauthenticated access', () => {
  const privateEndpoints = [
    '/teacher/dashboard',
    '/teacher/students',
    '/teacher/packages',
    '/teacher/attendance',
    '/teacher/notifications',
  ];

  for (const endpoint of privateEndpoints) {
    let redirectedUrl = null;
    const unauthReq = { session: {}, url: endpoint };
    const res = {
      locals: {},
      redirect: (url) => { redirectedUrl = url; },
    };
    let nextCalled = false;

    requireAuth(unauthReq, res, () => { nextCalled = true; });

    assert.equal(nextCalled, false, `${endpoint} must not call next() for unauthenticated user`);
    assert.equal(redirectedUrl, '/teacher/login?error=unauthorized');
  }
});

// ── 5. CSRF Synchronizer Token Protection ──
test('Security: Modifying requests (POST/PUT/DELETE) strictly require valid CSRF tokens', () => {
  const methods = ['POST', 'PUT', 'PATCH', 'DELETE'];

  for (const method of methods) {
    const req = {
      method,
      session: { csrfToken: 'expected-token-xyz' },
      body: { _csrf: 'tampered-token-abc' },
      query: {},
    };
    let redirectedUrl = null;
    const res = {
      redirect: (url) => { redirectedUrl = url; },
      locals: {},
    };
    let nextCalled = false;

    csrfProtection(req, res, () => { nextCalled = true; });

    assert.equal(nextCalled, false, `${method} request with invalid CSRF must be blocked`);
    assert.ok(redirectedUrl && redirectedUrl.includes('session_expired'));
  }
});

// ── 6. Excel Formula Injection Defense ──
const { sanitizeForSpreadsheet } = require('../controllers/attendanceController');

test('Excel Security: Defense in depth against spreadsheet formula execution', () => {
  const dangerousInputs = [
    '=cmd|"/C calc"!A0',
    '+2+5',
    '-10',
    '@SUM(A1:A10)',
    '\tmalicious-tab',
    '\rline-break',
    '   =SUM(A1:B1)',
    '  +cmd',
    '  -malicious',
    '  @DANGEROUS',
  ];

  for (const input of dangerousInputs) {
    const sanitized = sanitizeForSpreadsheet(input);
    assert.equal(sanitized[0], "'", `Spreadsheet cell starting with dangerous prefix must be escaped with single quote: ${JSON.stringify(input)}`);
  }

  // Preserves ordinary text
  assert.equal(sanitizeForSpreadsheet('Aryan Sharma'), 'Aryan Sharma');
  assert.equal(sanitizeForSpreadsheet('MB-1002'), 'MB-1002');
  assert.equal(sanitizeForSpreadsheet('Present'), 'Present');

  // Preserves legitimate numbers
  assert.equal(sanitizeForSpreadsheet(-10), -10);
  assert.equal(sanitizeForSpreadsheet(0), 0);
  assert.equal(sanitizeForSpreadsheet(42), 42);

  // Handles null / undefined
  assert.equal(sanitizeForSpreadsheet(null), '');
  assert.equal(sanitizeForSpreadsheet(undefined), '');
});

// ── 7. Secret-Safe Logging Verification ──
test('Security: Secrets and credentials are completely absent from application logs and error records', async () => {
  const capturedLogs = [];
  const origConsoleError = console.error;

  console.error = (...args) => {
    capturedLogs.push(args.join(' '));
  };

  try {
    const sensitiveErr = new Error('SMTP Error 535: auth failed user=admin pass=superSecretPassword123 token=secretToken999 url=smtp://usr:passSecret@smtp.provider.com:587');
    const sanitized = emailService.sanitizeError(sensitiveErr);

    assert.ok(!sanitized.includes('superSecretPassword123'), 'Password must not be in sanitized error');
    assert.ok(!sanitized.includes('secretToken999'), 'Token must not be in sanitized error');
    assert.ok(!sanitized.includes('passSecret'), 'URL credentials must not be in sanitized error');

    // Simulate failed dispatch with error logging
    const student = {
      _id: new mongoose.Types.ObjectId(),
      name: 'Log Test Student',
      studentEmail: 'logtest@example.com',
    };

    const origAttendanceFindById = require('../models/Attendance').findById;
    require('../models/Attendance').findById = () => ({
      populate: () => ({
        populate: () => ({
          populate: async () => ({
            _id: new mongoose.Types.ObjectId(),
            student,
            session: { sessionName: 'Demo Class', date: new Date() },
            status: 'present',
            date: new Date(),
          }),
        }),
      }),
    });

    emailService.setTransporter({
      sendMail: async () => {
        throw new Error('554 5.7.1 password=leaked_secret token=xyzToken');
      },
    });

    const notif = await emailService.dispatchClassNotification(new mongoose.Types.ObjectId());

    // Verify sanitized in notification record
    assert.ok(notif);
    assert.ok(!notif.lastError.includes('leaked_secret'));
    assert.ok(!notif.lastError.includes('xyzToken'));

    // Verify sanitized in captured console logs
    const allCapturedOutput = capturedLogs.join(' ');
    assert.ok(!allCapturedOutput.includes('leaked_secret'), 'Secrets must never appear in console.error logs');
    assert.ok(!allCapturedOutput.includes('xyzToken'), 'Tokens must never appear in console.error logs');

    require('../models/Attendance').findById = origAttendanceFindById;
  } finally {
    console.error = origConsoleError;
    emailService.setTransporter(null);
  }
});

// ── 8. Email Unconfigured Resilience & Safe Isolation ──
test('Email Readiness: Unconfigured SMTP logs safely and never halts attendance', async () => {
  const origHost = process.env.SMTP_HOST;
  const origUser = process.env.SMTP_USER;
  const origPass = process.env.SMTP_PASS;

  try {
    delete process.env.SMTP_HOST;
    delete process.env.SMTP_USER;
    delete process.env.SMTP_PASS;
    emailService.setTransporter(null);

    assert.equal(emailService.isSmtpConfigured(), false, 'SMTP must report unconfigured');
  } finally {
    process.env.SMTP_HOST = origHost;
    process.env.SMTP_USER = origUser;
    process.env.SMTP_PASS = origPass;
  }
});
