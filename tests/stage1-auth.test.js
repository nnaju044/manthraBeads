const test = require('node:test');
const assert = require('node:assert/strict');
const bcrypt = require('bcryptjs');

// ── Models ──
const Teacher = require('../models/Teacher');

test('Teacher Model: hides passwordHash when serialized to JSON', () => {
  const teacher = new Teacher({
    email: 'teacher@manthrabeads.com',
    name: 'Master Teacher',
    passwordHash: '$2a$12$abcdefghijklmnopqrstuv',
  });

  const json = teacher.toJSON();
  assert.equal(json.email, 'teacher@manthrabeads.com');
  assert.equal(json.name, 'Master Teacher');
  assert.equal(json.passwordHash, undefined, 'passwordHash must never be exposed');
});

// ── Middleware: requireAuth ──
const { requireAuth, csrfProtection } = require('../middleware/auth');

test('requireAuth: redirects unauthenticated request to /teacher/login?error=unauthorized', () => {
  let redirectedUrl = null;
  const req = { session: {} };
  const res = {
    locals: {},
    redirect: (url) => { redirectedUrl = url; }
  };
  let nextCalled = false;

  requireAuth(req, res, () => { nextCalled = true; });

  assert.equal(nextCalled, false);
  assert.equal(redirectedUrl, '/teacher/login?error=unauthorized');
});

test('requireAuth: allows authenticated teacher and populates res.locals.teacher', () => {
  const req = {
    session: {
      teacherId: 'teacher-123',
      teacherName: 'Sunita Sharma',
      teacherEmail: 'sunita@manthrabeads.com',
    }
  };
  const res = { locals: {} };
  let nextCalled = false;

  requireAuth(req, res, () => { nextCalled = true; });

  assert.equal(nextCalled, true);
  assert.deepEqual(res.locals.teacher, {
    id: 'teacher-123',
    name: 'Sunita Sharma',
    email: 'sunita@manthrabeads.com',
  });
});

// ── Middleware: csrfProtection ──
test('csrfProtection: generates token for session and passes GET requests', () => {
  const req = { session: {}, method: 'GET', body: {}, query: {} };
  const res = { locals: {} };
  let nextCalled = false;

  csrfProtection(req, res, () => { nextCalled = true; });

  assert.equal(nextCalled, true);
  assert.ok(req.session.csrfToken, 'CSRF token should be generated');
  assert.equal(res.locals.csrfToken, req.session.csrfToken);
});

test('csrfProtection: blocks POST request without CSRF token', () => {
  const req = {
    session: { csrfToken: 'valid-secret-token' },
    method: 'POST',
    body: {},
    query: {}
  };
  let redirectedUrl = null;
  const res = {
    locals: {},
    redirect: (url) => { redirectedUrl = url; }
  };
  let nextCalled = false;

  csrfProtection(req, res, () => { nextCalled = true; });

  assert.equal(nextCalled, false);
  assert.equal(redirectedUrl, '/teacher/login?error=session_expired');
});

test('csrfProtection: allows POST request with valid CSRF token in body', () => {
  const req = {
    session: { csrfToken: 'valid-secret-token' },
    method: 'POST',
    body: { _csrf: 'valid-secret-token' },
    query: {}
  };
  const res = { locals: {} };
  let nextCalled = false;

  csrfProtection(req, res, () => { nextCalled = true; });

  assert.equal(nextCalled, true);
});

// ── Controller: authController unit tests ──
const authController = require('../controllers/authController');

test('authController.showLogin: sets error message for query params', () => {
  let renderedView = null;
  let renderData = null;

  const req = { query: { error: 'session_expired' } };
  const res = {
    locals: { csrfToken: 'test-token' },
    render: (view, data) => {
      renderedView = view;
      renderData = data;
    }
  };

  authController.showLogin(req, res);
  assert.equal(renderedView, 'teacher/login');
  assert.equal(renderData.error, 'Your session has expired. Please log in again.');
  assert.equal(renderData.csrfToken, 'test-token');
});

test('authController.login: rejects empty email or password', async () => {
  let renderedView = null;
  let renderData = null;

  const req = {
    body: { email: '', password: '' },
    session: {}
  };
  const res = {
    locals: { csrfToken: 'test-token' },
    render: (view, data) => {
      renderedView = view;
      renderData = data;
    }
  };

  await authController.login(req, res);
  assert.equal(renderedView, 'teacher/login');
  assert.equal(renderData.error, 'Please enter both email and password.');
});

test('authController.logout: destroys session, clears cookie, and redirects', () => {
  let sessionDestroyed = false;
  let clearedCookie = null;
  let redirectedUrl = null;

  const req = {
    session: {
      destroy: (cb) => {
        sessionDestroyed = true;
        cb(null);
      }
    }
  };
  const res = {
    clearCookie: (name) => { clearedCookie = name; },
    redirect: (url) => { redirectedUrl = url; }
  };

  authController.logout(req, res);
  assert.equal(sessionDestroyed, true);
  assert.equal(clearedCookie, 'connect.sid');
  assert.equal(redirectedUrl, '/teacher/login');
});
