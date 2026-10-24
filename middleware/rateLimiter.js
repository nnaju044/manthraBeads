const rateLimit = require('express-rate-limit');
const crypto = require('crypto');

/* ──────────────────────────────────────────────────────────
   loginLimiter — 5 attempts per 15-minute sliding window.
   Renders the login page with a friendly error rather than
   returning a raw 429 response.
   ────────────────────────────────────────────────────────── */
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    // Ensure a CSRF token exists for the re-rendered form
    if (req.session && !req.session.csrfToken) {
      req.session.csrfToken = crypto.randomBytes(32).toString('hex');
    }
    res.status(429).render('teacher/login', {
      error: 'Too many login attempts. Please try again in 15 minutes.',
      csrfToken: req.session ? req.session.csrfToken : '',
    });
  },
});

/* ──────────────────────────────────────────────────────────
   otpRequestLimiter — 5 OTP requests per 15-minute window.
   ────────────────────────────────────────────────────────── */
const otpRequestLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    if (req.session && !req.session.csrfToken) {
      req.session.csrfToken = crypto.randomBytes(32).toString('hex');
    }
    res.status(429).render('teacher/forgot-password', {
      error: 'Too many OTP requests. Please wait 15 minutes before requesting another code.',
      info: null,
      csrfToken: req.session ? req.session.csrfToken : '',
    });
  },
});

/* ──────────────────────────────────────────────────────────
   otpVerifyLimiter — 10 verification attempts per 15 minutes.
   ────────────────────────────────────────────────────────── */
const otpVerifyLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    if (req.session && !req.session.csrfToken) {
      req.session.csrfToken = crypto.randomBytes(32).toString('hex');
    }
    const email = req.session.resetEmail || req.body.email || '';
    res.status(429).render('teacher/verify-otp', {
      email,
      error: 'Too many verification attempts. Please wait 15 minutes.',
      remainingSeconds: 0,
      resendCooldown: 60,
      csrfToken: req.session ? req.session.csrfToken : '',
    });
  },
});

/* ──────────────────────────────────────────────────────────
   passwordResetLimiter — 5 password reset submissions per 15m.
   ────────────────────────────────────────────────────────── */
const passwordResetLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    if (req.session && !req.session.csrfToken) {
      req.session.csrfToken = crypto.randomBytes(32).toString('hex');
    }
    res.status(429).render('teacher/reset-password', {
      error: 'Too many reset attempts. Please wait 15 minutes.',
      csrfToken: req.session ? req.session.csrfToken : '',
    });
  },
});

module.exports = {
  loginLimiter,
  otpRequestLimiter,
  otpVerifyLimiter,
  passwordResetLimiter,
};
