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

module.exports = { loginLimiter };
