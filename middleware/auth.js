const crypto = require('crypto');

/* ──────────────────────────────────────────────────────────
   requireAuth — protect teacher-only routes
   ────────────────────────────────────────────────────────── */
function requireAuth(req, res, next) {
  if (req.session && req.session.teacherId) {
    // Make teacher info available to every view
    res.locals.teacher = {
      id: req.session.teacherId,
      name: req.session.teacherName,
      email: req.session.teacherEmail,
    };
    return next();
  }
  res.redirect('/teacher/login?error=unauthorized');
}

/* ──────────────────────────────────────────────────────────
   csrfProtection — synchronizer token pattern
   Generates a per-session CSRF token and validates it on
   every state-changing request (POST / PUT / PATCH / DELETE).
   ────────────────────────────────────────────────────────── */
function csrfProtection(req, res, next) {
  // Ensure session has a CSRF token
  if (!req.session.csrfToken) {
    req.session.csrfToken = crypto.randomBytes(32).toString('hex');
  }

  // Make the token available to all EJS views
  res.locals.csrfToken = req.session.csrfToken;

  // Validate on state-changing methods
  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
    const submitted = req.body._csrf || req.query._csrf;
    if (!submitted || submitted !== req.session.csrfToken) {
      return res.redirect('/teacher/login?error=session_expired');
    }
  }

  next();
}

module.exports = { requireAuth, csrfProtection };
