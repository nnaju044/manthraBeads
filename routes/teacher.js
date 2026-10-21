const express = require('express');
const router = express.Router();
const { requireAuth, csrfProtection } = require('../middleware/auth');
const { loginLimiter } = require('../middleware/rateLimiter');
const authController = require('../controllers/authController');
const dashboardController = require('../controllers/dashboardController');
const studentController = require('../controllers/studentController');

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

// ── Upcoming Section Placeholders (Stages 4 & 5) ──
router.get('/attendance', requireAuth, dashboardController.showSectionPlaceholder('attendance'));
router.get('/packages', requireAuth, dashboardController.showSectionPlaceholder('packages'));
router.get('/reports', requireAuth, dashboardController.showSectionPlaceholder('reports'));

module.exports = router;
