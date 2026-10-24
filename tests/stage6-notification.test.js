const test = require('node:test');
const assert = require('node:assert/strict');
const mongoose = require('mongoose');

const Notification = require('../models/Notification');
const Attendance = require('../models/Attendance');
const Student = require('../models/Student');
const Session = require('../models/Session');
const Package = require('../models/Package');
const emailService = require('../services/emailService');
const notificationController = require('../controllers/notificationController');
const { requireAuth, csrfProtection } = require('../middleware/auth');

/* ──────────────────────────────────────────────────────────
   Stage 6: Automated Post-Class Email Notifications Test Suite
   ────────────────────────────────────────────────────────── */

// ── 1. Model Validations ──
test('Notification Model: validates required fields and enum values', async () => {
  const emptyNotif = new Notification({});
  let err;
  try {
    await emptyNotif.validate();
  } catch (e) {
    err = e;
  }
  assert.ok(err, 'Validation should fail for empty notification');
  assert.ok(err.errors.student, 'Student reference is required');
  assert.ok(err.errors.attendance, 'Attendance reference is required');
  assert.ok(err.errors.notificationType, 'Notification type is required');
  assert.ok(err.errors.idempotencyKey, 'Idempotency key is required');

  // Verify status enum
  const invalidStatus = new Notification({
    student: new mongoose.Types.ObjectId(),
    attendance: new mongoose.Types.ObjectId(),
    notificationType: 'class_completion',
    idempotencyKey: 'test:class_completion',
    status: 'in-flight', // not in enum
  });
  let statusErr;
  try {
    await invalidStatus.validate();
  } catch (e) {
    statusErr = e;
  }
  assert.ok(statusErr && statusErr.errors.status, 'Invalid status must be rejected');

  // Verify valid statuses
  for (const validStatus of ['pending', 'sent', 'failed', 'skipped']) {
    const validNotif = new Notification({
      student: new mongoose.Types.ObjectId(),
      attendance: new mongoose.Types.ObjectId(),
      notificationType: 'class_completion',
      idempotencyKey: `test:${validStatus}:${Date.now()}`,
      status: validStatus,
    });
    let valErr;
    try {
      await validNotif.validate();
    } catch (e) {
      valErr = e;
    }
    assert.equal(valErr ? valErr.errors.status : undefined, undefined, `${validStatus} should be valid`);
  }
});

// ── 2. Safe Rendering & XSS Sanitization ──
test('Email Template: Safely escapes student names, session names, and user inputs', () => {
  const maliciousInput = '<script>alert("XSS")</script>&<foo>"bar"\'baz\'';
  const escaped = emailService.escapeHtml(maliciousInput);

  assert.ok(!escaped.includes('<script>'), 'Script tags must be escaped');
  assert.ok(escaped.includes('&lt;script&gt;'), 'Angle brackets must be converted to HTML entities');
  assert.ok(escaped.includes('&quot;bar&quot;'), 'Quotes must be converted to &quot;');
  assert.ok(escaped.includes('&#039;baz&#039;'), 'Single quotes must be converted');

  const { html, text, subject } = emailService.buildEmailTemplate({
    studentName: '<img src=x onerror=alert(1)> Aarav',
    studentId: 'MB-<b>001</b>',
    recipientName: '<script>alert("parent")</script>',
    sessionName: 'Level 1 <i>Friday</i>',
    sessionDate: new Date('2026-10-22T10:00:00.000Z'),
    attendanceStatus: 'present',
    packageName: '<style>body{display:none}</style> 8-Class Pack',
    remainingClasses: 5,
    outstandingDuesPaise: 0,
  });

  assert.ok(!html.includes('<script>'), 'Email HTML must not contain unescaped script tags');
  assert.ok(!html.includes('<img src=x onerror='), 'Email HTML must not contain executable img error handlers');
  assert.ok(html.includes('&lt;img src=x onerror=alert(1)&gt; Aarav'), 'Student name must be safely escaped');
  assert.ok(subject.includes('Aarav'), 'Subject line should include student name');
  assert.ok(text.includes('5'), 'Plaintext version should include classes remaining');
});

// ── 3. Remaining Classes and Payment Balance Values ──
test('Email Template: Correctly renders dynamic classes remaining and rupee balances from database', () => {
  // Test with dues and remaining classes
  const template1 = emailService.buildEmailTemplate({
    studentName: 'Rohan Gupta',
    studentId: 'MB-2026-042',
    recipientName: 'Mr. Gupta',
    sessionName: 'Level 2 Abacus Practice',
    sessionDate: new Date('2026-10-22'),
    attendanceStatus: 'present',
    packageName: '12-Class Term Pack',
    remainingClasses: 3,
    outstandingDuesPaise: 150000, // ₹1,500
  });

  assert.ok(template1.html.includes('3'), 'Must contain 3 classes remaining');
  assert.ok(template1.html.includes('₹1,500'), 'Must contain ₹1,500 outstanding dues');
  assert.ok(template1.text.includes('Classes remaining: 3'));
  assert.ok(template1.text.includes('Payment balance: ₹1,500'));

  // Test with zero dues
  const template2 = emailService.buildEmailTemplate({
    studentName: 'Ananya Verma',
    studentId: 'MB-2026-088',
    recipientName: 'Mrs. Verma',
    sessionName: 'Level 1 Beginners',
    sessionDate: new Date('2026-10-22'),
    attendanceStatus: 'late',
    packageName: '8-Class Monthly Pack',
    remainingClasses: 7,
    outstandingDuesPaise: 0,
  });

  assert.ok(template2.html.includes('₹0'), 'Zero dues must be rendered as ₹0');
  assert.ok(template2.html.includes('Late'), 'Status Late must be rendered');
  assert.ok(template2.text.includes('Payment balance: ₹0'));
});

// ── 4. Error Sanitization ──
test('Email Service: Sanitizes sensitive credentials and secrets from error logs', () => {
  const sensitiveErr = new Error('Connection failed to smtp://user:superSecretPassword123@smtp.mail.com:587?password=my_secret_token');
  const sanitized = emailService.sanitizeError(sensitiveErr);

  assert.ok(!sanitized.includes('superSecretPassword123'), 'Passwords in URL must be redacted');
  assert.ok(!sanitized.includes('my_secret_token'), 'Tokens in query strings must be redacted');
  assert.ok(sanitized.includes('***'), 'Sensitive parts must be replaced with asterisks');
});

// ── 5. Notification Status Rules ──
test('Notification Rules: Determines correct notificationType based on attendance status', async () => {
  const studentId = new mongoose.Types.ObjectId();
  const sessionId = new mongoose.Types.ObjectId();
  const attId = new mongoose.Types.ObjectId();

  const mockStudent = {
    _id: studentId,
    name: 'Priya Sharma',
    studentId: 'MB-001',
    studentEmail: 'priya@example.com',
    parentEmail: 'parent@example.com',
  };

  const mockSession = {
    _id: sessionId,
    sessionName: 'Abacus Masterclass',
    date: new Date(),
  };

  // Mock Attendance.findById
  const origFindById = Attendance.findById;
  try {
    // 5a. Present -> class_completion
    Attendance.findById = (id) => ({
      populate: () => ({
        populate: () => ({
          populate: async () => ({
            _id: attId,
            student: mockStudent,
            session: mockSession,
            status: 'present',
            date: new Date(),
          }),
        }),
      }),
    });

    // Provide mock transporter
    const sentEmails = [];
    emailService.setTransporter({
      sendMail: async (opts) => {
        sentEmails.push(opts);
        return { messageId: 'mock-msg-001' };
      },
    });

    const notifPresent = await emailService.dispatchClassNotification(attId);
    assert.ok(notifPresent, 'Notification record should be created');
    assert.equal(notifPresent.notificationType, 'class_completion');
    assert.equal(notifPresent.status, 'sent');
    assert.equal(sentEmails.length, 1);
    assert.equal(sentEmails[0].to, 'priya@example.com');
    assert.ok(sentEmails[0].subject.includes('Priya Sharma'));

    // 5b. Late -> late_arrival
    Attendance.findById = (id) => ({
      populate: () => ({
        populate: () => ({
          populate: async () => ({
            _id: new mongoose.Types.ObjectId(),
            student: mockStudent,
            session: mockSession,
            status: 'late',
            date: new Date(),
          }),
        }),
      }),
    });

    const notifLate = await emailService.dispatchClassNotification(new mongoose.Types.ObjectId());
    assert.ok(notifLate);
    assert.equal(notifLate.notificationType, 'late_arrival');
    assert.equal(notifLate.status, 'sent');

    // 5c. Absent when ENABLE_ABSENCE_EMAILS is not set -> no email
    delete process.env.ENABLE_ABSENCE_EMAILS;
    Attendance.findById = (id) => ({
      populate: () => ({
        populate: () => ({
          populate: async () => ({
            _id: new mongoose.Types.ObjectId(),
            student: mockStudent,
            session: mockSession,
            status: 'absent',
            date: new Date(),
          }),
        }),
      }),
    });

    const notifAbsent = await emailService.dispatchClassNotification(new mongoose.Types.ObjectId());
    assert.equal(notifAbsent, null, 'Absent records must not trigger email unless explicitly enabled');

    // 5d. Excused -> no email
    Attendance.findById = (id) => ({
      populate: () => ({
        populate: () => ({
          populate: async () => ({
            _id: new mongoose.Types.ObjectId(),
            student: mockStudent,
            session: mockSession,
            status: 'excused',
            date: new Date(),
          }),
        }),
      }),
    });

    const notifExcused = await emailService.dispatchClassNotification(new mongoose.Types.ObjectId());
    assert.equal(notifExcused, null, 'Excused records must never trigger email');

  } finally {
    Attendance.findById = origFindById;
    emailService.setTransporter(null);
  }
});

// ── 6. Recipient Selection: Student email vs Parent email vs Missing ──
test('Notification Rules: Fallbacks from student email to parent email, and skips when both missing', async () => {
  const origFindById = Attendance.findById;

  try {
    emailService.setTransporter({
      sendMail: async (opts) => ({ messageId: 'mock-fallback' }),
    });

    // 6a. Fallback to parent email when studentEmail is empty
    const studentWithOnlyParent = {
      _id: new mongoose.Types.ObjectId(),
      name: 'Aditya Patel',
      studentEmail: '',
      parentEmail: 'parent.patel@example.com',
      parentName: 'Suresh Patel',
    };

    Attendance.findById = () => ({
      populate: () => ({
        populate: () => ({
          populate: async () => ({
            _id: new mongoose.Types.ObjectId(),
            student: studentWithOnlyParent,
            session: { sessionName: 'Demo Class', date: new Date() },
            status: 'present',
            date: new Date(),
          }),
        }),
      }),
    });

    const notifParent = await emailService.dispatchClassNotification(new mongoose.Types.ObjectId());
    assert.ok(notifParent);
    assert.equal(notifParent.recipientEmail, 'parent.patel@example.com');
    assert.equal(notifParent.recipientType, 'parent');
    assert.equal(notifParent.status, 'sent');

    // 6b. When neither student nor parent email exists -> record as skipped
    const studentWithNoEmail = {
      _id: new mongoose.Types.ObjectId(),
      name: 'Kavya Singh',
      studentEmail: '',
      parentEmail: '   ',
    };

    Attendance.findById = () => ({
      populate: () => ({
        populate: () => ({
          populate: async () => ({
            _id: new mongoose.Types.ObjectId(),
            student: studentWithNoEmail,
            session: { sessionName: 'Demo Class', date: new Date() },
            status: 'present',
            date: new Date(),
          }),
        }),
      }),
    });

    const notifSkipped = await emailService.dispatchClassNotification(new mongoose.Types.ObjectId());
    assert.ok(notifSkipped);
    assert.equal(notifSkipped.status, 'skipped');
    assert.equal(notifSkipped.skipReason, 'no_recipient_email');
    assert.equal(notifSkipped.recipientEmail, '');

  } finally {
    Attendance.findById = origFindById;
    emailService.setTransporter(null);
  }
});

// ── 7. SMTP Failure, Error Recording and Safe Retry ──
test('Notification Delivery: Handles SMTP failure, updates record to failed, and succeeds on retry', async () => {
  const origFindByIdAtt = Attendance.findById;
  const origFindByIdNotif = Notification.findById;

  try {
    const student = {
      _id: new mongoose.Types.ObjectId(),
      name: 'Dev Kumar',
      studentEmail: 'dev@example.com',
    };

    Attendance.findById = () => ({
      populate: () => ({
        populate: () => ({
          populate: async () => ({
            _id: new mongoose.Types.ObjectId(),
            student,
            session: { sessionName: 'Level 1 Session', date: new Date() },
            status: 'present',
            date: new Date(),
          }),
        }),
      }),
    });

    // 7a. Mock transporter that fails with SMTP error
    emailService.setTransporter({
      sendMail: async () => {
        throw new Error('554 5.7.1 Relay access denied; password=leaked_secret');
      },
    });

    const failedNotif = await emailService.dispatchClassNotification(new mongoose.Types.ObjectId());
    assert.ok(failedNotif);
    assert.equal(failedNotif.status, 'failed');
    assert.equal(failedNotif.attemptCount, 1);
    assert.ok(failedNotif.lastError.includes('Relay access denied'));
    assert.ok(!failedNotif.lastError.includes('leaked_secret'), 'Secrets in error must be sanitized');

    // 7b. Retry with healthy transporter
    emailService.setTransporter({
      sendMail: async () => ({ messageId: 'retry-success-msg' }),
    });

    Notification.findById = () => ({
      populate: () => ({
        populate: async () => failedNotif,
      }),
    });

    const retryResult = await emailService.retryNotification(failedNotif._id);
    assert.equal(retryResult.success, true);
    assert.equal(failedNotif.status, 'sent');
    assert.equal(failedNotif.attemptCount, 2);
    assert.equal(failedNotif.lastError, '');
    assert.equal(failedNotif.messageId, 'retry-success-msg');

  } finally {
    Attendance.findById = origFindByIdAtt;
    Notification.findById = origFindByIdNotif;
    emailService.setTransporter(null);
  }
});

// ── 8. Idempotency & Duplicate Notification Prevention ──
test('Idempotency: Prevents sending duplicate emails for the same attendance save', async () => {
  const origFindByIdAtt = Attendance.findById;
  const origFindOneNotif = Notification.findOne;

  try {
    let sendMailCallCount = 0;
    emailService.setTransporter({
      sendMail: async () => {
        sendMailCallCount++;
        return { messageId: 'msg-idem-1' };
      },
    });

    const existingSentNotif = new Notification({
      student: new mongoose.Types.ObjectId(),
      attendance: new mongoose.Types.ObjectId(),
      notificationType: 'class_completion',
      idempotencyKey: 'att-123:class_completion',
      status: 'sent',
      recipientEmail: 'student@example.com',
      sentAt: new Date(),
      attemptCount: 1,
    });

    // Mock Notification.findOne to return existing 'sent' notification
    Notification.findOne = async () => existingSentNotif;

    Attendance.findById = () => ({
      populate: () => ({
        populate: () => ({
          populate: async () => ({
            _id: new mongoose.Types.ObjectId(),
            student: { name: 'Student', studentEmail: 'student@example.com' },
            session: { sessionName: 'Session', date: new Date() },
            status: 'present',
            date: new Date(),
          }),
        }),
      }),
    });

    // Dispatch should recognize existing sent record and NOT send again
    const testAttId = new mongoose.Types.ObjectId();
    const result = await emailService.dispatchClassNotification(testAttId);
    assert.ok(result, 'Sent notification should be returned');
    assert.equal(result.status, 'sent');
    assert.equal(sendMailCallCount, 0, 'Must NOT trigger sendMail when already sent');

  } finally {
    Attendance.findById = origFindByIdAtt;
    Notification.findOne = origFindOneNotif;
    emailService.setTransporter(null);
  }
});

// ── 9. Attendance Persistence when SMTP is Unconfigured ──
test('SMTP Unconfigured: Records status as failed/pending without throwing or crashing attendance save', async () => {
  const origFindByIdAtt = Attendance.findById;
  const origHost = process.env.SMTP_HOST;
  const origUser = process.env.SMTP_USER;
  const origPass = process.env.SMTP_PASS;

  try {
    delete process.env.SMTP_HOST;
    delete process.env.SMTP_USER;
    delete process.env.SMTP_PASS;
    emailService.setTransporter(null);

    assert.equal(emailService.isSmtpConfigured(), false);

    Attendance.findById = () => ({
      populate: () => ({
        populate: () => ({
          populate: async () => ({
            _id: new mongoose.Types.ObjectId(),
            student: { name: 'Student', studentEmail: 'test@example.com' },
            session: { sessionName: 'Session', date: new Date() },
            status: 'present',
            date: new Date(),
          }),
        }),
      }),
    });

    const notif = await emailService.dispatchClassNotification(new mongoose.Types.ObjectId());
    assert.ok(notif, 'Notification record should be returned');
    assert.equal(notif.status, 'failed');
    assert.equal(notif.skipReason, 'smtp_unconfigured');
    assert.ok(notif.lastError.includes('SMTP not configured'));

  } finally {
    process.env.SMTP_HOST = origHost;
    process.env.SMTP_USER = origUser;
    process.env.SMTP_PASS = origPass;
    Attendance.findById = origFindByIdAtt;
  }
});

// ── 10. Teacher Auth & CSRF Protection on Notification Routes ──
test('Security: Protects /teacher/notifications routes with authentication', () => {
  let redirectedUrl = null;
  const unauthReq = { session: {} };
  const res = {
    locals: {},
    redirect: (url) => { redirectedUrl = url; },
  };
  let nextCalled = false;

  requireAuth(unauthReq, res, () => { nextCalled = true; });
  assert.equal(nextCalled, false);
  assert.equal(redirectedUrl, '/teacher/login?error=unauthorized');
});

test('Security: Rejects POST notification retries when CSRF token is invalid or missing', () => {
  const req = {
    method: 'POST',
    session: { csrfToken: 'real-token-123' },
    body: { _csrf: 'wrong-token' },
    headers: {},
  };
  let redirectedUrl = null;
  const res = {
    redirect(url) { redirectedUrl = url; },
    locals: {},
  };
  let nextCalled = false;

  csrfProtection(req, res, () => { nextCalled = true; });
  assert.equal(nextCalled, false);
  assert.ok(redirectedUrl && redirectedUrl.includes('/teacher/login?error=session_expired'));
});

// ── 11. Notification Controller UI Rendering ──
test('Notification Controller: Renders notification list view with fallback statistics when disconnected', async () => {
  const req = {
    query: { status: 'all' },
    session: { teacherId: 'mock-teacher' },
  };
  let renderedView = null;
  let viewData = null;
  const res = {
    render(view, data) {
      renderedView = view;
      viewData = data;
    },
    locals: { teacher: { name: 'Teacher' }, csrfToken: 'mock-csrf' },
  };

  await notificationController.listNotifications(req, res);
  assert.equal(renderedView, 'teacher/notifications/index');
  assert.equal(viewData.activeSection, 'notifications');
  assert.ok(viewData.counts);
  assert.equal(typeof viewData.counts.total, 'number');
  assert.equal(typeof viewData.isSmtpConfigured, 'boolean');
});
