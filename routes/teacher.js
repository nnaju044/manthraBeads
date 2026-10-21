const express = require('express');
const router = express.Router();
const { requireAuth, csrfProtection } = require('../middleware/auth');
const { loginLimiter } = require('../middleware/rateLimiter');
const authController = require('../controllers/authController');
const dashboardController = require('../controllers/dashboardController');
const studentController = require('../controllers/studentController');
const packageController = require('../controllers/packageController');
const attendanceController = require('../controllers/attendanceController');

// ── CSRF protection on all teacher routes ──
router.use(csrfProtection);

// ── Authentication ──
router.get('/', (req, res) => {
  if (req.session && req.session.teacherId) {
    return res.redirect('/teacher/dashboard');
  }
  res.redirect('/teacher/login');
});

router.get('/login', authController.showLogin);
router.post('/login', loginLimiter, authController.login);
router.post('/logout', requireAuth, authController.logout);

// ── Teacher Dashboard (Stage 2) ──
router.get('/dashboard', requireAuth, dashboardController.showDashboard);

// ── Student Management (Stage 3) ──
router.get('/students', requireAuth, studentController.listStudents);
router.get('/students/new', requireAuth, studentController.showAddForm);
router.post('/students', requireAuth, studentController.createStudent);
router.get('/students/:id', requireAuth, studentController.showStudentProfile);
router.get('/students/:id/edit', requireAuth, studentController.showEditForm);
router.post('/students/:id', requireAuth, studentController.updateStudent);
router.post('/students/:id/status', requireAuth, studentController.toggleStudentStatus);

// ── Class Packages & Payment Ledger (Stage 4) ──
router.get('/packages', requireAuth, packageController.listPackages);
router.get('/students/:id/packages/new', requireAuth, packageController.showAssignPackageForm);
router.post('/students/:id/packages', requireAuth, packageController.assignPackage);
router.get('/packages/:id', requireAuth, packageController.showPackageDetails);
router.get('/packages/:id/payments/new', requireAuth, packageController.showRecordPaymentForm);
router.post('/packages/:id/payments', requireAuth, packageController.recordPayment);
router.post('/payments/:id/cancel', requireAuth, packageController.cancelPayment);

// ── Attendance Tracking & Excel Export (Stage 5) ──
router.get('/attendance', requireAuth, attendanceController.showAttendance);
router.post('/attendance/sessions', requireAuth, attendanceController.createSession);
router.post('/attendance', requireAuth, attendanceController.saveAttendance);
router.get('/attendance/export.xlsx', requireAuth, attendanceController.exportAttendanceExcel);

// ── Upcoming Section Placeholders (Stage 6) ──
router.get('/reports', requireAuth, dashboardController.showSectionPlaceholder('reports'));

module.exports = router;
