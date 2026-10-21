const mongoose = require('mongoose');
const Student = require('../models/Student');

/* ──────────────────────────────────────────────────────────
   Teacher Dashboard Controller
   Serves authenticated dashboard overview and placeholder
   endpoints for upcoming stages (Payments, Attendance, Reports)
   ────────────────────────────────────────────────────────── */

exports.showDashboard = async (req, res) => {
  try {
    const hasAttendanceModel = Boolean(mongoose.models.Attendance);
    const hasPaymentModel = Boolean(mongoose.models.Payment);

    let activeStudentsCount = 0;
    let studentsLoaded = false;

    try {
      if (mongoose.connection.readyState === 1) {
        activeStudentsCount = await Student.countDocuments({ status: 'active' });
        studentsLoaded = true;
      }
    } catch (err) {
      console.warn('Could not query Student count:', err.message);
    }

    const stats = {
      activeStudents: {
        value: activeStudentsCount,
        isReady: studentsLoaded,
        stage: 3,
        label: 'Active Students',
        emptyMessage: 'No students enrolled yet (Stage 3)',
      },
      todayClasses: {
        value: 0,
        isReady: hasAttendanceModel,
        stage: 5,
        label: "Today's Classes",
        emptyMessage: 'No sessions scheduled today',
      },
      todayAttendancePct: {
        value: null,
        isReady: hasAttendanceModel,
        stage: 5,
        label: "Today's Attendance",
        emptyMessage: 'No attendance marked today',
      },
      pendingPayments: {
        value: 0,
        isReady: hasPaymentModel,
        stage: 4,
        label: 'Pending Payments',
        emptyMessage: 'No outstanding dues',
      },
    };

    res.render('teacher/dashboard', {
      teacher: res.locals.teacher,
      csrfToken: res.locals.csrfToken,
      activeSection: 'dashboard',
      stats,
      todayClasses: [],
      recentAttendance: [],
      dbConnected: mongoose.connection.readyState === 1,
    });
  } catch (err) {
    console.error('Teacher dashboard render error:', err);
    res.status(500).render('teacher/dashboard', {
      teacher: res.locals.teacher,
      csrfToken: res.locals.csrfToken,
      activeSection: 'dashboard',
      stats: null,
      todayClasses: [],
      recentAttendance: [],
      dbConnected: false,
      error: 'Unable to load dashboard data. Please try again.',
    });
  }
};

/* ── Placeholder handler for upcoming stages ── */
exports.showSectionPlaceholder = (sectionKey) => {
  const meta = {
    students: {
      title: 'Student Management',
      icon: 'fa-user-graduate',
      stage: 'Stage 3',
      description: 'Create student profiles, manage enrollment, track abacus levels, and search/filter students with full validation.',
      route: '/teacher/students',
    },
    attendance: {
      title: 'Attendance Tracker',
      icon: 'fa-clipboard-check',
      stage: 'Stage 5',
      description: 'Daily class session marking, automatic student package deduction, attendance status tracking, and Excel export.',
      route: '/teacher/attendance',
    },
    packages: {
      title: 'Packages & Payments',
      icon: 'fa-credit-card',
      stage: 'Stage 4',
      description: 'Prepaid class package ledger, payment recording, partial payments, dues tracking, and balance calculations.',
      route: '/teacher/packages',
    },
    reports: {
      title: 'Reports & Analytics',
      icon: 'fa-chart-pie',
      stage: 'Stage 5',
      description: 'Generate comprehensive monthly attendance reports, student progress analytics, and Excel exports.',
      route: '/teacher/reports',
    },
  };

  return (req, res) => {
    const section = meta[sectionKey] || {
      title: 'Feature Module',
      icon: 'fa-layer-group',
      stage: 'Planned',
      description: 'This feature will be available in an upcoming implementation stage.',
      route: '/teacher/dashboard',
    };

    res.render('teacher/section-placeholder', {
      teacher: res.locals.teacher,
      csrfToken: res.locals.csrfToken,
      activeSection: sectionKey,
      section,
    });
  };
};
