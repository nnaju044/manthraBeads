const test = require('node:test');
const assert = require('node:assert/strict');
const mongoose = require('mongoose');

const Student = require('../models/Student');
const studentController = require('../controllers/studentController');
const dashboardController = require('../controllers/dashboardController');

// ── Model Validation Tests ──
test('Student Model: validates required fields', async () => {
  const student = new Student({});
  let err;
  try {
    await student.validate();
  } catch (e) {
    err = e;
  }

  assert.ok(err, 'Validation should fail on empty student');
  assert.ok(err.errors.name, 'Name should be required');
  assert.ok(err.errors.phone, 'Phone should be required');
  assert.ok(err.errors.level, 'Level should be required');
  assert.ok(err.errors.studentId, 'StudentId should be required');
});

test('Student Model: validates email format when provided', async () => {
  const studentWithBadEmail = new Student({
    studentId: 'MB-TEST',
    name: 'Test Student',
    phone: '9876543210',
    level: 'Level 1',
    studentEmail: 'not-an-email',
  });
  let err;
  try {
    await studentWithBadEmail.validate();
  } catch (e) {
    err = e;
  }
  assert.ok(err.errors.studentEmail, 'Invalid email format should fail');

  const studentWithValidEmail = new Student({
    studentId: 'MB-TEST-2',
    name: 'Valid Student',
    phone: '9876543210',
    level: 'Level 1',
    studentEmail: 'STUDENT@EXAMPLE.COM',
    parentEmail: 'parent@example.com',
  });
  let validErr;
  try {
    await studentWithValidEmail.validate();
  } catch (e) {
    validErr = e;
  }
  assert.equal(validErr, undefined, 'Valid email should pass validation');
  assert.equal(studentWithValidEmail.studentEmail, 'student@example.com', 'Email should be lowercase');
});

test('Student Model: defaults status to active', () => {
  const student = new Student({
    studentId: 'MB-1001',
    name: 'Aarav',
    phone: '9876543210',
    level: 'Level 1',
  });
  assert.equal(student.status, 'active');
});

// ── Controller Unit Tests ──
test('studentController.createStudent: rejects invalid form submission with 400', async () => {
  let statusCode = 200;
  let renderedView = null;
  let renderData = null;

  const req = {
    body: {
      name: '', // Missing name
      phone: '', // Missing phone
      level: '', // Missing level
    },
    session: {},
  };
  const res = {
    status: (code) => {
      statusCode = code;
      return res;
    },
    render: (view, data) => {
      renderedView = view;
      renderData = data;
    },
    locals: { csrfToken: 'token' },
  };

  await studentController.createStudent(req, res);

  assert.equal(statusCode, 400);
  assert.equal(renderedView, 'teacher/students/form');
  assert.ok(renderData.errors.name);
  assert.ok(renderData.errors.phone);
  assert.ok(renderData.errors.level);
});

test('studentController.showStudentProfile: returns 404 for invalid ObjectId', async () => {
  let statusCode = 200;
  let redirectedUrl = null;

  const req = {
    params: { id: 'invalid-mongodb-id' },
  };
  const res = {
    status: (code) => {
      statusCode = code;
      return res;
    },
    redirect: (url) => {
      redirectedUrl = url;
    },
  };

  await studentController.showStudentProfile(req, res);

  assert.equal(statusCode, 404);
  assert.equal(redirectedUrl, '/teacher/students?error=not_found');
});

test('studentController.showEditForm: returns 404 for invalid ObjectId', async () => {
  let statusCode = 200;
  let redirectedUrl = null;

  const req = {
    params: { id: 'invalid-mongodb-id' },
  };
  const res = {
    status: (code) => {
      statusCode = code;
      return res;
    },
    redirect: (url) => {
      redirectedUrl = url;
    },
  };

  await studentController.showEditForm(req, res);

  assert.equal(statusCode, 404);
  assert.equal(redirectedUrl, '/teacher/students?error=not_found');
});

test('studentController.updateStudent: returns 404 for invalid ObjectId', async () => {
  let statusCode = 200;
  let redirectedUrl = null;

  const req = {
    params: { id: 'invalid-mongodb-id' },
    body: { name: 'Name', phone: '12345', level: 'Level 1' },
  };
  const res = {
    status: (code) => {
      statusCode = code;
      return res;
    },
    redirect: (url) => {
      redirectedUrl = url;
    },
  };

  await studentController.updateStudent(req, res);

  assert.equal(statusCode, 404);
  assert.equal(redirectedUrl, '/teacher/students?error=not_found');
});

test('studentController.toggleStudentStatus: returns 404 for invalid ObjectId', async () => {
  let statusCode = 200;
  let redirectedUrl = null;

  const req = {
    params: { id: 'invalid-mongodb-id' },
  };
  const res = {
    status: (code) => {
      statusCode = code;
      return res;
    },
    redirect: (url) => {
      redirectedUrl = url;
    },
  };

  await studentController.toggleStudentStatus(req, res);

  assert.equal(statusCode, 404);
  assert.equal(redirectedUrl, '/teacher/students?error=not_found');
});

test('dashboardController.showDashboard: safely integrates Student model count', async () => {
  let renderedView = null;
  let renderData = null;

  const req = {
    session: {
      teacherId: 'teacher-1',
      teacherName: 'Sunita',
      teacherEmail: 'sunita@example.com',
    },
  };
  const res = {
    locals: {
      teacher: { id: 'teacher-1', name: 'Sunita', email: 'sunita@example.com' },
      csrfToken: 'token',
    },
    render: (view, data) => {
      renderedView = view;
      renderData = data;
    },
  };

  await dashboardController.showDashboard(req, res);

  assert.equal(renderedView, 'teacher/dashboard');
  assert.ok(renderData.stats.activeStudents);
  assert.equal(typeof renderData.stats.activeStudents.value, 'number');
  assert.equal(renderData.activeSection, 'dashboard');
});
