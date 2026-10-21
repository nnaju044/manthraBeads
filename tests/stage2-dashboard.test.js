const test = require('node:test');
const assert = require('node:assert/strict');

const dashboardController = require('../controllers/dashboardController');
const { requireAuth } = require('../middleware/auth');

test('dashboardController.showDashboard: renders dashboard with genuine empty stats', async () => {
  let renderedView = null;
  let renderData = null;

  const req = {
    session: {
      teacherId: 'teacher-456',
      teacherName: 'Sunita Sharma',
      teacherEmail: 'sunita@manthrabeads.com',
    },
  };
  const res = {
    locals: {
      teacher: {
        id: 'teacher-456',
        name: 'Sunita Sharma',
        email: 'sunita@manthrabeads.com',
      },
      csrfToken: 'test-csrf-token',
    },
    render: (view, data) => {
      renderedView = view;
      renderData = data;
    },
  };

  await dashboardController.showDashboard(req, res);

  assert.equal(renderedView, 'teacher/dashboard');
  assert.equal(renderData.activeSection, 'dashboard');
  assert.equal(renderData.teacher.name, 'Sunita Sharma');
  assert.equal(renderData.csrfToken, 'test-csrf-token');

  // Verify stats are authentic empty states without fabricated metrics
  assert.ok(renderData.stats);
  assert.equal(renderData.stats.activeStudents.value, 0);
  assert.equal(renderData.stats.todayClasses.value, 0);
  assert.equal(renderData.stats.todayAttendancePct.value, null);
  assert.equal(renderData.stats.pendingPayments.value, 0);
  assert.deepEqual(renderData.todayClasses, []);
  assert.deepEqual(renderData.recentAttendance, []);
});

test('dashboardController.showSectionPlaceholder: provides consistent section metadata', () => {
  const sections = ['students', 'attendance', 'packages', 'reports'];

  for (const key of sections) {
    let renderedView = null;
    let renderData = null;

    const req = { session: {} };
    const res = {
      locals: {
        teacher: { name: 'Teacher' },
        csrfToken: 'token-123',
      },
      render: (view, data) => {
        renderedView = view;
        renderData = data;
      },
    };

    const handler = dashboardController.showSectionPlaceholder(key);
    handler(req, res);

    assert.equal(renderedView, 'teacher/section-placeholder');
    assert.equal(renderData.activeSection, key);
    assert.ok(renderData.section.title, `Section ${key} must have a title`);
    assert.ok(renderData.section.stage, `Section ${key} must have a stage label`);
    assert.ok(renderData.section.description, `Section ${key} must have a description`);
  }
});

test('requireAuth: protects all dashboard endpoints from unauthenticated access', () => {
  const req = { session: {} };
  let redirectedUrl = null;
  const res = {
    redirect: (url) => { redirectedUrl = url; },
    locals: {},
  };
  let nextCalled = false;

  requireAuth(req, res, () => { nextCalled = true; });

  assert.equal(nextCalled, false);
  assert.equal(redirectedUrl, '/teacher/login?error=unauthorized');
});
