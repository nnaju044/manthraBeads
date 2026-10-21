const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const Teacher = require('../models/Teacher');

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
  }

  res.render('teacher/login', {
    error,
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
        csrfToken: res.locals.csrfToken,
      });
    }

    // Verify password
    const isValid = await bcrypt.compare(password, teacher.passwordHash);
    if (!isValid) {
      return res.render('teacher/login', {
        error: 'Invalid email or password.',
        csrfToken: res.locals.csrfToken,
      });
    }

    // Regenerate session to prevent session-fixation attacks
    req.session.regenerate((err) => {
      if (err) {
        console.error('Session regeneration error:', err);
        return res.render('teacher/login', {
          error: 'A server error occurred. Please try again.',
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
