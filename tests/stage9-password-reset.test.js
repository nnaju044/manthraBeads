const test = require('node:test');
const assert = require('node:assert/strict');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const mongoose = require('mongoose');

const Teacher = require('../models/Teacher');
const PasswordResetChallenge = require('../models/PasswordResetChallenge');
const authController = require('../controllers/authController');
const emailService = require('../services/emailService');

/* ──────────────────────────────────────────────────────────
   Stage 9: Email OTP-Based Password Reset Test Suite
   ────────────────────────────────────────────────────────── */

// ── 1. Input Validation: Invalid Email Formats ──
test('sendResetOtp: rejects invalid email format with 400', async () => {
  let renderedView = null;
  let renderData = null;
  let statusCode = null;

  const req = {
    body: { email: 'not-an-email' },
    session: {},
  };
  const res = {
    locals: { csrfToken: 'token-123' },
    status(code) {
      statusCode = code;
      return this;
    },
    render(view, data) {
      renderedView = view;
      renderData = data;
    },
  };

  await authController.sendResetOtp(req, res);

  assert.equal(statusCode, 400);
  assert.equal(renderedView, 'teacher/forgot-password');
  assert.ok(renderData.error.includes('valid email'));
});

// ── 2. Anti-Enumeration Defense: Unregistered vs Registered ──
test('sendResetOtp: returns identical generic redirect for unregistered email', async () => {
  const origFindOne = Teacher.findOne;

  try {
    Teacher.findOne = async () => null; // Email not in DB

    let redirectedUrl = null;
    const req = {
      body: { email: 'unknown@example.com' },
      session: {
        save(cb) { cb(null); },
      },
    };
    const res = {
      locals: { csrfToken: 'token-123' },
      redirect(url) {
        redirectedUrl = url;
      },
    };

    await authController.sendResetOtp(req, res);

    assert.equal(redirectedUrl, '/teacher/verify-otp?sent=1');
    assert.equal(req.session.resetEmail, 'unknown@example.com');
  } finally {
    Teacher.findOne = origFindOne;
  }
});

// ── 3. OTP Generation, Keyed Hashing & Storage ──
test('sendResetOtp: generates 6-digit OTP, stores ONLY HMAC hash (never plaintext), and dispatches email', async () => {
  const origFindOne = Teacher.findOne;
  const origDeleteMany = PasswordResetChallenge.deleteMany;
  const origCreate = PasswordResetChallenge.create;
  const origSendMail = emailService.sendPasswordResetOtp;

  const teacherId = new mongoose.Types.ObjectId();
  let createdChallenge = null;
  let sentOtp = null;

  try {
    Teacher.findOne = async () => ({
      _id: teacherId,
      name: 'Sunita Sharma',
      email: 'sunita@manthrabeads.com',
    });

    PasswordResetChallenge.deleteMany = async () => ({ acknowledged: true, deletedCount: 1 });
    PasswordResetChallenge.create = async (doc) => {
      createdChallenge = doc;
      return doc;
    };

    emailService.sendPasswordResetOtp = async ({ email, name, otp }) => {
      sentOtp = otp;
      return { success: true, messageId: 'mock-msg-123' };
    };

    let redirectedUrl = null;
    const req = {
      body: { email: 'sunita@manthrabeads.com' },
      session: {
        save(cb) { cb(null); },
      },
    };
    const res = {
      locals: { csrfToken: 'token-123' },
      redirect(url) {
        redirectedUrl = url;
      },
    };

    await authController.sendResetOtp(req, res);

    // 1. Verify 6-digit numeric OTP was sent
    assert.ok(sentOtp, 'OTP must be sent via email');
    assert.equal(sentOtp.length, 6, 'OTP must be 6 digits');
    assert.match(sentOtp, /^\d{6}$/, 'OTP must be all numeric digits');

    // 2. Verify plaintext OTP is NEVER stored in database challenge
    assert.ok(createdChallenge, 'Challenge record must be created in DB');
    assert.equal(createdChallenge.otp, undefined, 'Plaintext OTP must NEVER exist in DB record');
    assert.ok(createdChallenge.otpHash, 'Keyed hash of OTP must be stored');
    assert.notEqual(createdChallenge.otpHash, sentOtp, 'Hash must not match plaintext');

    // 3. Verify hash correctly matches HMAC-SHA256 of sent OTP
    const secret = process.env.SESSION_SECRET || 'manthrabeads-otp-secret';
    const expectedHash = crypto.createHmac('sha256', secret).update(sentOtp).digest('hex');
    assert.equal(createdChallenge.otpHash, expectedHash);

    // 4. Verify 5-minute expiration
    const expiryDiff = createdChallenge.expiresAt.getTime() - Date.now();
    assert.ok(expiryDiff > 4 * 60 * 1000 && expiryDiff <= 5 * 60 * 1000);

    // 5. Verify redirection
    assert.equal(redirectedUrl, '/teacher/verify-otp?sent=1');
  } finally {
    Teacher.findOne = origFindOne;
    PasswordResetChallenge.deleteMany = origDeleteMany;
    PasswordResetChallenge.create = origCreate;
    emailService.sendPasswordResetOtp = origSendMail;
  }
});

// ── 4. Email Delivery Failure Handling ──
test('sendResetOtp: handles SMTP failure safely without crashing', async () => {
  const origFindOne = Teacher.findOne;
  const origDeleteMany = PasswordResetChallenge.deleteMany;
  const origCreate = PasswordResetChallenge.create;
  const origSendMail = emailService.sendPasswordResetOtp;

  try {
    Teacher.findOne = async () => ({
      _id: new mongoose.Types.ObjectId(),
      name: 'Sunita Sharma',
      email: 'sunita@manthrabeads.com',
    });

    PasswordResetChallenge.deleteMany = async () => {};
    PasswordResetChallenge.create = async (doc) => doc;

    // Simulate complete SMTP delivery failure
    emailService.sendPasswordResetOtp = async () => ({
      success: false,
      reason: 'SMTP_ERROR',
      error: 'Connection timeout',
    });

    let renderedView = null;
    let renderData = null;
    const req = {
      body: { email: 'sunita@manthrabeads.com' },
      session: {},
    };
    const res = {
      locals: { csrfToken: 'token-123' },
      render(view, data) {
        renderedView = view;
        renderData = data;
      },
    };

    await authController.sendResetOtp(req, res);

    assert.equal(renderedView, 'teacher/forgot-password');
    assert.ok(renderData.error.includes('Unable to send verification code'));
  } finally {
    Teacher.findOne = origFindOne;
    PasswordResetChallenge.deleteMany = origDeleteMany;
    PasswordResetChallenge.create = origCreate;
    emailService.sendPasswordResetOtp = origSendMail;
  }
});

// ── 5. Correct OTP Verification ──
test('verifyOtp: verifies correct 6-digit OTP, invalidates challenge, and issues single-purpose reset token', async () => {
  const origFindOne = PasswordResetChallenge.findOne;

  const rawOtp = '482910';
  const secret = process.env.SESSION_SECRET || 'manthrabeads-otp-secret';
  const validHash = crypto.createHmac('sha256', secret).update(rawOtp).digest('hex');

  let savedDoc = null;
  const mockChallenge = {
    email: 'sunita@manthrabeads.com',
    teacherId: new mongoose.Types.ObjectId(),
    otpHash: validHash,
    expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    attempts: 0,
    maxAttempts: 5,
    resendAvailableAt: new Date(Date.now() + 60 * 1000),
    save: async function () {
      savedDoc = this;
      return this;
    },
  };

  try {
    PasswordResetChallenge.findOne = () => ({
      sort: () => mockChallenge,
    });

    let redirectedUrl = null;
    const req = {
      body: { otp: '482910' },
      session: {
        resetEmail: 'sunita@manthrabeads.com',
        save(cb) { cb(null); },
      },
    };
    const res = {
      locals: { csrfToken: 'token-123' },
      redirect(url) {
        redirectedUrl = url;
      },
    };

    await authController.verifyOtp(req, res);

    // 1. Verify redirect to reset-password
    assert.equal(redirectedUrl, '/teacher/reset-password');

    // 2. Verify challenge marked verified (cannot reuse OTP)
    assert.equal(mockChallenge.verified, true);
    assert.ok(mockChallenge.verifiedAt);

    // 3. Verify single-use reset authorization token generated in session and hashed in DB
    assert.ok(req.session.resetAuthToken, 'resetAuthToken must be stored in session');
    assert.equal(typeof req.session.resetAuthToken, 'string');
    assert.equal(req.session.resetAuthToken.length, 64, '32-byte hex token is 64 chars');

    // 4. Verify DB stores SHA-256 hash of resetAuthToken
    const expectedTokenHash = crypto.createHash('sha256').update(req.session.resetAuthToken).digest('hex');
    assert.equal(mockChallenge.resetTokenHash, expectedTokenHash);
  } finally {
    PasswordResetChallenge.findOne = origFindOne;
  }
});

// ── 6. Incorrect OTP Verification & Attempt Limiting ──
test('verifyOtp: rejects wrong OTP and decrements remaining attempts', async () => {
  const origFindOne = PasswordResetChallenge.findOne;

  const secret = process.env.SESSION_SECRET || 'manthrabeads-otp-secret';
  const correctHash = crypto.createHmac('sha256', secret).update('999999').digest('hex');

  let savedCalled = false;
  const mockChallenge = {
    email: 'sunita@manthrabeads.com',
    otpHash: correctHash,
    expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    attempts: 2,
    maxAttempts: 5,
    resendAvailableAt: new Date(Date.now() + 60 * 1000),
    save: async function () {
      savedCalled = true;
    },
  };

  try {
    PasswordResetChallenge.findOne = () => ({
      sort: () => mockChallenge,
    });

    let renderedView = null;
    let renderData = null;
    let statusCode = null;

    const req = {
      body: { otp: '111111' }, // Incorrect
      session: { resetEmail: 'sunita@manthrabeads.com' },
    };
    const res = {
      locals: { csrfToken: 'token-123' },
      status(code) {
        statusCode = code;
        return this;
      },
      render(view, data) {
        renderedView = view;
        renderData = data;
      },
    };

    await authController.verifyOtp(req, res);

    assert.equal(statusCode, 400);
    assert.equal(renderedView, 'teacher/verify-otp');
    assert.equal(savedCalled, true);
    assert.equal(mockChallenge.attempts, 3, 'Attempts must increment to 3');
    assert.ok(renderData.error.includes('2 attempts remaining'));
  } finally {
    PasswordResetChallenge.findOne = origFindOne;
  }
});

// ── 7. Maximum Verification Attempts Exceeded ──
test('verifyOtp: locks out challenge when maximum attempts (5) are reached', async () => {
  const origFindOne = PasswordResetChallenge.findOne;

  const mockChallenge = {
    email: 'sunita@manthrabeads.com',
    otpHash: 'dummyhash',
    expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    attempts: 5, // Already reached max
    maxAttempts: 5,
    resendAvailableAt: new Date(Date.now() + 60 * 1000),
    save: async () => {},
  };

  try {
    PasswordResetChallenge.findOne = () => ({
      sort: () => mockChallenge,
    });

    let renderedView = null;
    let renderData = null;
    let statusCode = null;

    const req = {
      body: { otp: '123456' },
      session: { resetEmail: 'sunita@manthrabeads.com' },
    };
    const res = {
      locals: { csrfToken: 'token-123' },
      status(code) {
        statusCode = code;
        return this;
      },
      render(view, data) {
        renderedView = view;
        renderData = data;
      },
    };

    await authController.verifyOtp(req, res);

    assert.equal(statusCode, 400);
    assert.ok(renderData.error.includes('Maximum verification attempts exceeded'));
  } finally {
    PasswordResetChallenge.findOne = origFindOne;
  }
});

// ── 8. Expired OTP Rejection ──
test('verifyOtp: rejects expired OTP code', async () => {
  const origFindOne = PasswordResetChallenge.findOne;

  const mockChallenge = {
    email: 'sunita@manthrabeads.com',
    otpHash: 'dummyhash',
    expiresAt: new Date(Date.now() - 1000), // Expired 1 second ago
    attempts: 0,
    maxAttempts: 5,
    resendAvailableAt: new Date(Date.now() - 10000),
    save: async () => {},
  };

  try {
    PasswordResetChallenge.findOne = () => ({
      sort: () => mockChallenge,
    });

    let renderedView = null;
    let renderData = null;
    let statusCode = null;

    const req = {
      body: { otp: '123456' },
      session: { resetEmail: 'sunita@manthrabeads.com' },
    };
    const res = {
      locals: { csrfToken: 'token-123' },
      status(code) {
        statusCode = code;
        return this;
      },
      render(view, data) {
        renderedView = view;
        renderData = data;
      },
    };

    await authController.verifyOtp(req, res);

    assert.equal(statusCode, 400);
    assert.ok(renderData.error.includes('expired'));
  } finally {
    PasswordResetChallenge.findOne = origFindOne;
  }
});

// ── 9. Resend OTP and Cooldown Enforcement ──
test('resendOtp: enforces 60-second cooldown before permitting resend', async () => {
  const origFindOne = PasswordResetChallenge.findOne;

  const mockChallenge = {
    email: 'sunita@manthrabeads.com',
    expiresAt: new Date(Date.now() + 4 * 60 * 1000),
    resendAvailableAt: new Date(Date.now() + 45 * 1000), // 45 seconds remaining on cooldown
  };

  try {
    PasswordResetChallenge.findOne = () => ({
      sort: () => mockChallenge,
    });

    let renderedView = null;
    let renderData = null;
    let statusCode = null;

    const req = {
      body: {},
      session: { resetEmail: 'sunita@manthrabeads.com' },
    };
    const res = {
      locals: { csrfToken: 'token-123' },
      status(code) {
        statusCode = code;
        return this;
      },
      render(view, data) {
        renderedView = view;
        renderData = data;
      },
    };

    await authController.resendOtp(req, res);

    assert.equal(statusCode, 429);
    assert.equal(renderedView, 'teacher/verify-otp');
    assert.ok(renderData.error.includes('Please wait'));
    assert.ok(renderData.error.includes('second'));
  } finally {
    PasswordResetChallenge.findOne = origFindOne;
  }
});

// ── 10. Unauthorized Password Reset Attempt ──
test('resetPassword: blocks attempt without valid reset token in session', async () => {
  let redirectedUrl = null;

  const req = {
    body: { newPassword: 'ValidPassword123!', confirmPassword: 'ValidPassword123!' },
    session: {}, // Missing resetAuthToken & resetEmail
  };
  const res = {
    redirect(url) {
      redirectedUrl = url;
    },
  };

  await authController.resetPassword(req, res);

  assert.equal(redirectedUrl, '/teacher/forgot-password?error=session_expired');
});

// ── 11. Password Mismatch and Password Strength Validation ──
test('resetPassword: rejects password mismatch and passwords shorter than 8 characters', async () => {
  const origFindOne = PasswordResetChallenge.findOne;

  const rawToken = 'mock-reset-token-123';
  const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');

  const mockChallenge = {
    email: 'sunita@manthrabeads.com',
    resetTokenHash: tokenHash,
    teacherId: new mongoose.Types.ObjectId(),
    verified: true,
    used: false,
    resetTokenExpiresAt: new Date(Date.now() + 10 * 60 * 1000),
  };

  try {
    PasswordResetChallenge.findOne = async () => mockChallenge;

    // Subtest A: Short password (< 8 chars)
    let statusCode = null;
    let renderData = null;

    let req = {
      body: { newPassword: 'short', confirmPassword: 'short' },
      session: { resetAuthToken: rawToken, resetEmail: 'sunita@manthrabeads.com' },
    };
    let res = {
      locals: { csrfToken: 'token-123' },
      status(code) {
        statusCode = code;
        return this;
      },
      render(view, data) {
        renderData = data;
      },
    };

    await authController.resetPassword(req, res);
    assert.equal(statusCode, 400);
    assert.ok(renderData.error.includes('at least 8 characters'));

    // Subtest B: Password mismatch
    req = {
      body: { newPassword: 'ValidPassword123!', confirmPassword: 'DifferentPassword456!' },
      session: { resetAuthToken: rawToken, resetEmail: 'sunita@manthrabeads.com' },
    };
    res = {
      locals: { csrfToken: 'token-123' },
      status(code) {
        statusCode = code;
        return this;
      },
      render(view, data) {
        renderData = data;
      },
    };

    await authController.resetPassword(req, res);
    assert.equal(statusCode, 400);
    assert.ok(renderData.error.includes('do not match'));
  } finally {
    PasswordResetChallenge.findOne = origFindOne;
  }
});

// ── 12. Password Hashing and Successful Login with New Password ──
test('resetPassword: hashes password with bcrypt 12, marks challenge used, and verifies login with new password', async () => {
  const origFindOneChallenge = PasswordResetChallenge.findOne;
  const origFindByIdTeacher = Teacher.findById;
  const origFindOneTeacher = Teacher.findOne;

  const rawToken = 'super-secret-authorization-token';
  const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
  const teacherId = new mongoose.Types.ObjectId();

  let teacherSaved = false;
  let challengeSaved = false;

  const teacherDoc = {
    _id: teacherId,
    name: 'Sunita Sharma',
    email: 'sunita@manthrabeads.com',
    passwordHash: '$2a$12$OldPasswordHashBeforeReset',
    save: async function () {
      teacherSaved = true;
      return this;
    },
  };

  const mockChallenge = {
    _id: new mongoose.Types.ObjectId(),
    email: 'sunita@manthrabeads.com',
    resetTokenHash: tokenHash,
    teacherId: teacherId,
    verified: true,
    used: false,
    resetTokenExpiresAt: new Date(Date.now() + 10 * 60 * 1000),
    save: async function () {
      challengeSaved = true;
      return this;
    },
  };

  try {
    PasswordResetChallenge.findOne = async () => mockChallenge;
    Teacher.findById = async () => teacherDoc;

    let redirectedUrl = null;
    let sessionRegenerated = false;

    const req = {
      body: {
        newPassword: 'BrandNewSecurePassword2026!',
        confirmPassword: 'BrandNewSecurePassword2026!',
      },
      session: {
        resetAuthToken: rawToken,
        resetEmail: 'sunita@manthrabeads.com',
        resetTeacherId: teacherId.toString(),
        regenerate(cb) {
          sessionRegenerated = true;
          cb(null);
        },
      },
    };
    const res = {
      locals: { csrfToken: 'token-123' },
      redirect(url) {
        redirectedUrl = url;
      },
    };

    await authController.resetPassword(req, res);

    // 1. Verify Teacher password hash updated
    assert.equal(teacherSaved, true);
    assert.notEqual(teacherDoc.passwordHash, '$2a$12$OldPasswordHashBeforeReset');
    assert.notEqual(teacherDoc.passwordHash, 'BrandNewSecurePassword2026!');

    // 2. Verify password verification works with bcrypt.compare
    const matchesNew = await bcrypt.compare('BrandNewSecurePassword2026!', teacherDoc.passwordHash);
    assert.equal(matchesNew, true, 'New password must verify with bcrypt');

    // 3. Verify challenge was invalidated (cannot be reused)
    assert.equal(challengeSaved, true);
    assert.equal(mockChallenge.used, true);
    assert.equal(mockChallenge.resetTokenHash, null);

    // 4. Verify session tokens cleaned up and regenerated
    assert.equal(sessionRegenerated, true);
    assert.equal(req.session.resetAuthToken, undefined);
    assert.equal(req.session.resetEmail, undefined);
    assert.equal(redirectedUrl, '/teacher/login?success=password_reset');

    // 5. Verify existing login flow with new password
    Teacher.findOne = async () => teacherDoc;
    let loginRedirect = null;
    const loginReq = {
      body: {
        email: 'sunita@manthrabeads.com',
        password: 'BrandNewSecurePassword2026!',
      },
      session: {
        regenerate(cb) { cb(null); },
        save(cb) { cb(null); },
      },
    };
    const loginRes = {
      locals: { csrfToken: 'csrf-1' },
      redirect(url) {
        loginRedirect = url;
      },
      render() {},
    };

    await authController.login(loginReq, loginRes);
    assert.equal(loginRedirect, '/teacher/dashboard', 'User must be able to log in with new password');
  } finally {
    PasswordResetChallenge.findOne = origFindOneChallenge;
    Teacher.findById = origFindByIdTeacher;
    Teacher.findOne = origFindOneTeacher;
  }
});
