const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const Teacher = require('../models/Teacher');
const PasswordResetChallenge = require('../models/PasswordResetChallenge');
const emailService = require('../services/emailService');

/* ── Helper: Hash OTP using keyed HMAC ── */
function hashOtp(otp) {
  const secret = process.env.SESSION_SECRET || 'manthrabeads-otp-secret';
  return crypto.createHmac('sha256', secret).update(String(otp).trim()).digest('hex');
}

/* ── Helper: Timing-safe comparison of hashes ── */
function safeCompare(hashA, hashB) {
  if (!hashA || !hashB) return false;
  const bufA = Buffer.from(hashA, 'hex');
  const bufB = Buffer.from(hashB, 'hex');
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

/* ── GET /teacher/login ── */
exports.showLogin = (req, res) => {
  if (req.session && req.session.teacherId) {
    return res.redirect('/teacher/dashboard');
  }

  // Handle error codes passed via query string
  let error = null;
  if (req.query.error === 'session_expired') {
    error = 'Your session has expired. Please log in again.';
  } else if (req.query.error === 'unauthorized') {
    error = 'Please log in to access the teacher panel.';
  } else if (req.query.error === 'reset_expired') {
    error = 'Your password reset session has expired. Please start over.';
  } else if (req.query.error === 'account_not_found') {
    error = 'Account could not be found. Please contact support.';
  }

  // Handle success messages
  let success = null;
  if (req.query.success === 'password_reset') {
    success = 'Your password has been reset successfully. Please log in with your new password.';
  }

  res.render('teacher/login', {
    error,
    success,
    csrfToken: res.locals.csrfToken,
  });
};

/* ── POST /teacher/login ── */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Basic input validation
    if (!email || !password) {
      return res.render('teacher/login', {
        error: 'Please enter both email and password.',
        success: null,
        csrfToken: res.locals.csrfToken,
      });
    }

    // Look up teacher
    const teacher = await Teacher.findOne({
      email: email.toLowerCase().trim(),
    });

    if (!teacher) {
      // Perform a dummy hash to prevent timing-based user enumeration
      await bcrypt.hash('dummy-password-for-timing', 12);
      return res.render('teacher/login', {
        error: 'Invalid email or password.',
        success: null,
        csrfToken: res.locals.csrfToken,
      });
    }

    if (!teacher.passwordHash) {
      return res.render('teacher/login', {
        error: 'This account does not have a local password set. Please use password reset or linked provider.',
        success: null,
        csrfToken: res.locals.csrfToken,
      });
    }

    // Verify password
    const isValid = await bcrypt.compare(password, teacher.passwordHash);
    if (!isValid) {
      return res.render('teacher/login', {
        error: 'Invalid email or password.',
        success: null,
        csrfToken: res.locals.csrfToken,
      });
    }

    // Regenerate session to prevent session-fixation attacks
    req.session.regenerate((err) => {
      if (err) {
        console.error('Session regeneration error:', err);
        return res.render('teacher/login', {
          error: 'A server error occurred. Please try again.',
          success: null,
          csrfToken: res.locals.csrfToken,
        });
      }

      // Store teacher identity in the session
      req.session.teacherId = teacher._id.toString();
      req.session.teacherName = teacher.name;
      req.session.teacherEmail = teacher.email;

      // Generate a fresh CSRF token for the new session
      req.session.csrfToken = crypto.randomBytes(32).toString('hex');

      req.session.save((saveErr) => {
        if (saveErr) {
          console.error('Session save error:', saveErr);
          return res.render('teacher/login', {
            error: 'A server error occurred. Please try again.',
            success: null,
            csrfToken: res.locals.csrfToken,
          });
        }
        res.redirect('/teacher/dashboard');
      });
    });
  } catch (err) {
    console.error('Login error:', err);
    res.render('teacher/login', {
      error: 'A server error occurred. Please try again.',
      success: null,
      csrfToken: res.locals.csrfToken,
    });
  }
};

/* ── POST /teacher/logout ── */
exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) console.error('Logout error:', err);
    res.clearCookie('connect.sid');
    res.redirect('/teacher/login');
  });
};

/* ──────────────────────────────────────────────────────────
   FORGOT PASSWORD & EMAIL OTP FLOW
   ────────────────────────────────────────────────────────── */

/* ── GET /teacher/forgot-password ── */
exports.showForgotPassword = (req, res) => {
  let error = null;
  if (req.query.error === 'session_expired') {
    error = 'Your session has expired. Please enter your email again.';
  } else if (req.query.error === 'reset_expired') {
    error = 'Your reset authorization has expired. Please request a new verification code.';
  }

  res.render('teacher/forgot-password', {
    error,
    info: null,
    csrfToken: res.locals.csrfToken,
  });
};

/* ── POST /teacher/forgot-password (Request OTP) ── */
exports.sendResetOtp = async (req, res) => {
  try {
    const rawEmail = req.body.email;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Validate email format
    if (!rawEmail || !emailRegex.test(rawEmail.trim())) {
      return res.status(400).render('teacher/forgot-password', {
        error: 'Please enter a valid email address.',
        info: null,
        csrfToken: res.locals.csrfToken,
      });
    }

    const email = rawEmail.toLowerCase().trim();

    // Look up teacher account
    const teacher = await Teacher.findOne({ email });

    // Anti-Enumeration Defense:
    // If teacher doesn't exist, execute dummy delay to prevent timing discrepancy
    if (!teacher) {
      await bcrypt.hash('dummy-timing-delay-salt', 10);
      req.session.resetEmail = email;
      return req.session.save(() => {
        res.redirect('/teacher/verify-otp?sent=1');
      });
    }

    // Invalidate any active pending challenges for this email
    await PasswordResetChallenge.deleteMany({ email });

    // Generate cryptographically secure 6-digit numeric OTP (100000 - 999999)
    const otp = crypto.randomInt(100000, 1000000).toString();

    // Store only keyed HMAC hash of OTP — never plaintext OTP
    const otpHash = hashOtp(otp);

    // Save challenge with 5-minute expiration and 60-second resend cooldown
    await PasswordResetChallenge.create({
      email,
      teacherId: teacher._id,
      otpHash,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
      resendAvailableAt: new Date(Date.now() + 60 * 1000), // 60s cooldown
    });

    // Send OTP email
    const delivery = await emailService.sendPasswordResetOtp({
      email,
      name: teacher.name,
      otp,
      expiresInMinutes: 5,
    });

    // If delivery failed completely (and not simulated in dev/test mode)
    if (!delivery.success && !delivery.simulated) {
      return res.render('teacher/forgot-password', {
        error: 'Unable to send verification code. Please check your email configuration or try again later.',
        info: null,
        csrfToken: res.locals.csrfToken,
      });
    }

    req.session.resetEmail = email;
    req.session.save(() => {
      res.redirect('/teacher/verify-otp?sent=1');
    });
  } catch (err) {
    console.error('sendResetOtp error:', err.message);
    res.render('teacher/forgot-password', {
      error: 'An error occurred while sending the verification code. Please try again.',
      info: null,
      csrfToken: res.locals.csrfToken,
    });
  }
};

/* ── GET /teacher/verify-otp ── */
exports.showVerifyOtp = async (req, res) => {
  const email = req.session.resetEmail || req.query.email;
  if (!email) {
    return res.redirect('/teacher/forgot-password');
  }

  let remainingSeconds = 300;
  let resendCooldown = 0;

  try {
    const challenge = await PasswordResetChallenge.findOne({
      email: email.toLowerCase().trim(),
      used: false,
    }).sort({ createdAt: -1 });

    if (challenge) {
      remainingSeconds = Math.max(0, Math.floor((challenge.expiresAt.getTime() - Date.now()) / 1000));
      resendCooldown = Math.max(0, Math.floor((challenge.resendAvailableAt.getTime() - Date.now()) / 1000));
    }
  } catch (err) {
    console.error('showVerifyOtp challenge lookup error:', err);
  }

  const info = req.query.sent === '1'
    ? 'If an account is associated with this email, a 6-digit code has been sent.'
    : (req.query.resent === '1' ? 'A new 6-digit code has been dispatched.' : null);

  res.render('teacher/verify-otp', {
    email,
    remainingSeconds,
    resendCooldown,
    error: null,
    info,
    csrfToken: res.locals.csrfToken,
  });
};

/* ── POST /teacher/verify-otp ── */
exports.verifyOtp = async (req, res) => {
  const email = (req.session.resetEmail || req.body.email || '').toLowerCase().trim();
  if (!email) {
    return res.redirect('/teacher/forgot-password');
  }

  // Support 6-digit combined string or individual digit inputs
  let otp = (req.body.otp || '').trim();
  if (!otp && req.body.digit1 !== undefined) {
    otp = [
      req.body.digit1,
      req.body.digit2,
      req.body.digit3,
      req.body.digit4,
      req.body.digit5,
      req.body.digit6,
    ].join('').trim();
  }

  otp = otp.replace(/\D/g, '');

  let remainingSeconds = 300;
  let resendCooldown = 0;

  try {
    const challenge = await PasswordResetChallenge.findOne({
      email,
      used: false,
    }).sort({ createdAt: -1 });

    if (challenge) {
      remainingSeconds = Math.max(0, Math.floor((challenge.expiresAt.getTime() - Date.now()) / 1000));
      resendCooldown = Math.max(0, Math.floor((challenge.resendAvailableAt.getTime() - Date.now()) / 1000));
    }

    // Validation: Exactly 6 digits
    if (!otp || otp.length !== 6) {
      return res.status(400).render('teacher/verify-otp', {
        email,
        remainingSeconds,
        resendCooldown,
        error: 'Please enter the complete 6-digit verification code.',
        info: null,
        csrfToken: res.locals.csrfToken,
      });
    }

    // Check challenge existence and expiration
    if (!challenge || challenge.expiresAt < new Date()) {
      return res.status(400).render('teacher/verify-otp', {
        email,
        remainingSeconds: 0,
        resendCooldown: 0,
        error: 'The verification code has expired. Please request a new code.',
        info: null,
        csrfToken: res.locals.csrfToken,
      });
    }

    // Check attempt limits
    if (challenge.attempts >= challenge.maxAttempts) {
      return res.status(400).render('teacher/verify-otp', {
        email,
        remainingSeconds: 0,
        resendCooldown: 0,
        error: 'Maximum verification attempts exceeded. Please request a new code.',
        info: null,
        csrfToken: res.locals.csrfToken,
      });
    }

    // Hash submitted OTP and verify using timing-safe comparison
    const submittedHash = hashOtp(otp);
    const isMatch = safeCompare(submittedHash, challenge.otpHash);

    if (!isMatch) {
      challenge.attempts += 1;
      await challenge.save();

      const remainingAttempts = challenge.maxAttempts - challenge.attempts;
      const errorMsg = remainingAttempts > 0
        ? `Invalid verification code. ${remainingAttempts} attempt${remainingAttempts === 1 ? '' : 's'} remaining.`
        : 'Maximum verification attempts exceeded. Please request a new code.';

      return res.status(400).render('teacher/verify-otp', {
        email,
        remainingSeconds,
        resendCooldown,
        error: errorMsg,
        info: null,
        csrfToken: res.locals.csrfToken,
      });
    }

    // Successful OTP verification
    // Invalidate OTP immediately to prevent reuse
    challenge.verified = true;
    challenge.verifiedAt = new Date();

    // Issue single-purpose reset authorization token (32 bytes hex, stored hashed with SHA-256)
    const resetToken = crypto.randomBytes(32).toString('hex');
    challenge.resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');
    challenge.resetTokenExpiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
    await challenge.save();

    // Store reset token and email in session
    req.session.resetAuthToken = resetToken;
    req.session.resetEmail = email;
    req.session.resetTeacherId = challenge.teacherId.toString();

    req.session.save(() => {
      res.redirect('/teacher/reset-password');
    });
  } catch (err) {
    console.error('verifyOtp error:', err);
    res.render('teacher/verify-otp', {
      email,
      remainingSeconds,
      resendCooldown,
      error: 'An error occurred during verification. Please try again.',
      info: null,
      csrfToken: res.locals.csrfToken,
    });
  }
};

/* ── POST /teacher/resend-otp ── */
exports.resendOtp = async (req, res) => {
  const email = (req.session.resetEmail || req.body.email || '').toLowerCase().trim();
  if (!email) {
    return res.redirect('/teacher/forgot-password');
  }

  try {
    const existingChallenge = await PasswordResetChallenge.findOne({
      email,
      used: false,
    }).sort({ createdAt: -1 });

    // Enforce 60-second cooldown
    if (existingChallenge && existingChallenge.resendAvailableAt > new Date()) {
      const remainingSeconds = Math.max(0, Math.floor((existingChallenge.expiresAt.getTime() - Date.now()) / 1000));
      const resendCooldown = Math.max(1, Math.ceil((existingChallenge.resendAvailableAt.getTime() - Date.now()) / 1000));

      return res.status(429).render('teacher/verify-otp', {
        email,
        remainingSeconds,
        resendCooldown,
        error: `Please wait ${resendCooldown} second${resendCooldown === 1 ? '' : 's'} before requesting a new code.`,
        info: null,
        csrfToken: res.locals.csrfToken,
      });
    }

    // Invalidate previous challenges
    await PasswordResetChallenge.deleteMany({ email });

    const teacher = await Teacher.findOne({ email });
    if (!teacher) {
      await bcrypt.hash('dummy-timing-delay-salt', 10);
      return res.redirect('/teacher/verify-otp?resent=1');
    }

    // Generate fresh OTP
    const otp = crypto.randomInt(100000, 1000000).toString();
    const otpHash = hashOtp(otp);

    await PasswordResetChallenge.create({
      email,
      teacherId: teacher._id,
      otpHash,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
      resendAvailableAt: new Date(Date.now() + 60 * 1000),
    });

    await emailService.sendPasswordResetOtp({
      email,
      name: teacher.name,
      otp,
      expiresInMinutes: 5,
    });

    res.redirect('/teacher/verify-otp?resent=1');
  } catch (err) {
    console.error('resendOtp error:', err);
    res.redirect('/teacher/verify-otp');
  }
};

/* ── GET /teacher/reset-password ── */
exports.showResetPassword = async (req, res) => {
  const resetToken = req.session.resetAuthToken;
  const email = req.session.resetEmail;

  if (!resetToken || !email) {
    return res.redirect('/teacher/forgot-password?error=session_expired');
  }

  try {
    const tokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');
    const challenge = await PasswordResetChallenge.findOne({
      email,
      resetTokenHash: tokenHash,
      verified: true,
      used: false,
      resetTokenExpiresAt: { $gt: new Date() },
    });

    if (!challenge) {
      delete req.session.resetAuthToken;
      delete req.session.resetEmail;
      return res.redirect('/teacher/forgot-password?error=reset_expired');
    }

    res.render('teacher/reset-password', {
      error: null,
      csrfToken: res.locals.csrfToken,
    });
  } catch (err) {
    console.error('showResetPassword error:', err);
    res.redirect('/teacher/forgot-password?error=session_expired');
  }
};

/* ── POST /teacher/reset-password ── */
exports.resetPassword = async (req, res) => {
  const resetToken = req.session.resetAuthToken;
  const email = req.session.resetEmail;

  if (!resetToken || !email) {
    return res.redirect('/teacher/forgot-password?error=session_expired');
  }

  try {
    const tokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');
    const challenge = await PasswordResetChallenge.findOne({
      email,
      resetTokenHash: tokenHash,
      verified: true,
      used: false,
      resetTokenExpiresAt: { $gt: new Date() },
    });

    if (!challenge) {
      delete req.session.resetAuthToken;
      delete req.session.resetEmail;
      return res.redirect('/teacher/forgot-password?error=reset_expired');
    }

    const { newPassword, confirmPassword } = req.body;

    // Validation
    if (!newPassword || !confirmPassword) {
      return res.status(400).render('teacher/reset-password', {
        error: 'Please enter and confirm your new password.',
        csrfToken: res.locals.csrfToken,
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).render('teacher/reset-password', {
        error: 'Password must be at least 8 characters long.',
        csrfToken: res.locals.csrfToken,
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).render('teacher/reset-password', {
        error: 'Passwords do not match. Please verify and try again.',
        csrfToken: res.locals.csrfToken,
      });
    }

    // Hash the new password using application's standard bcrypt salt rounds (12)
    const passwordHash = await bcrypt.hash(newPassword, 12);

    // Atomically update teacher password
    const teacher = await Teacher.findById(challenge.teacherId);
    if (!teacher) {
      return res.redirect('/teacher/login?error=account_not_found');
    }

    teacher.passwordHash = passwordHash;
    if (teacher.authProvider === 'google') {
      teacher.authProvider = 'both';
    }
    await teacher.save();

    // Mark challenge as used and invalidate reset token hash
    challenge.used = true;
    challenge.usedAt = new Date();
    challenge.resetTokenHash = null;
    await challenge.save();

    // Clear reset tokens from session and regenerate session ID
    delete req.session.resetAuthToken;
    delete req.session.resetEmail;
    delete req.session.resetTeacherId;

    req.session.regenerate((err) => {
      if (err) {
        console.error('Session regenerate after password reset error:', err);
      }
      res.redirect('/teacher/login?success=password_reset');
    });
  } catch (err) {
    console.error('resetPassword error:', err);
    res.render('teacher/reset-password', {
      error: 'An unexpected error occurred. Please try again.',
      csrfToken: res.locals.csrfToken,
    });
  }
};
