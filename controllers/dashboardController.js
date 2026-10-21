const mongoose = require('mongoose');
const Student = require('../models/Student');
const Package = require('../models/Package');
const Session = require('../models/Session');
const Attendance = require('../models/Attendance');

/* ──────────────────────────────────────────────────────────
   Teacher Dashboard Controller
   Serves authenticated dashboard overview and placeholder
   endpoints for upcoming stages (Reports)
   ────────────────────────────────────────────────────────── */

exports.showDashboard = async (req, res) => {
  try {
    let activeStudentsCount = 0;
    let studentsLoaded = false;
    let pendingDuesPaise = 0;
    let packagesLoaded = false;
    let todayClassesCount = 0;
    let todayClassesLoaded = false;
    let todayAttendancePct = null;
    let attendanceLoaded = false;
    let todayClassesList = [];
    let recentAttendanceList = [];

    if (mongoose.connection.readyState === 1) {
      try {
        activeStudentsCount = await Student.countDocuments({ status: 'active' });
        studentsLoaded = true;
      } catch (err) {
        console.warn('Could not query Student count:', err.message);
      }

      try {
        const activePackages = await Package.find(
          { status: 'active' },
          { totalPricePaise: 1, amountPaidPaise: 1 }
        ).lean();

        for (const pkg of activePackages) {
          const price = pkg.totalPricePaise || 0;
          const paid = pkg.amountPaidPaise || 0;
          pendingDuesPaise += Math.max(0, price - paid);
        }
        packagesLoaded = true;
      } catch (err) {
        console.warn('Could not query Package dues:', err.message);
      }

      try {
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);
        const todayEnd = new Date();
        todayEnd.setHours(23, 59, 59, 999);

        todayClassesCount = await Session.countDocuments({
          date: { $gte: todayStart, $lte: todayEnd },
        });
        todayClassesList = await Session.find({
          date: { $gte: todayStart, $lte: todayEnd },
        })
          .sort({ startTime: 1 })
          .lean();
        todayClassesLoaded = true;

        const todayAttendance = await Attendance.find({
          date: { $gte: todayStart, $lte: todayEnd },
        }).lean();

        if (todayAttendance.length > 0) {
          const attended = todayAttendance.filter((r) => ['present', 'late'].includes(r.status)).length;
          todayAttendancePct = Math.round((attended / todayAttendance.length) * 100);
        }
        attendanceLoaded = true;

        recentAttendanceList = await Attendance.find()
          .populate('student', 'name studentId level')
          .populate('session', 'sessionName startTime')
          .sort({ createdAt: -1 })
          .limit(6)
          .lean();
      } catch (err) {
        console.warn('Could not query Attendance/Session data:', err.message);
      }
    }

    const duesFormatted = (pendingDuesPaise / 100).toLocaleString('en-IN', {
      maximumFractionDigits: 0,
    });

    const stats = {
      activeStudents: {
        value: activeStudentsCount,
        isReady: studentsLoaded,
        stage: 3,
        label: 'Active Students',
        emptyMessage: 'No students enrolled yet',
      },
      todayClasses: {
        value: todayClassesCount,
        isReady: todayClassesLoaded,
        stage: 5,
        label: "Today's Classes",
        emptyMessage: 'No sessions scheduled today',
      },
      todayAttendancePct: {
        value: todayAttendancePct,
        isReady: attendanceLoaded,
        stage: 5,
        label: "Today's Attendance",
        emptyMessage: 'No attendance marked today',
      },
      pendingPayments: {
        value: pendingDuesPaise > 0 ? duesFormatted : 0,
        rawPaise: pendingDuesPaise,
        isReady: packagesLoaded,
        stage: 4,
        label: 'Outstanding Dues',
        emptyMessage: 'No outstanding dues',
      },
    };

    res.render('teacher/dashboard', {
      teacher: res.locals.teacher,
      csrfToken: res.locals.csrfToken,
      activeSection: 'dashboard',
      stats,
      todayClasses: todayClassesList,
      recentAttendance: recentAttendanceList,
      dbConnected: mongoose.connection.readyState === 1,
      duesSummary: {
        totalDuesPaise: pendingDuesPaise,
        duesCount: pendingDuesPaise > 0 ? 1 : 0,
      },
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
      duesSummary: { totalDuesPaise: 0, duesCount: 0 },
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
