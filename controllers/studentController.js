const mongoose = require('mongoose');
const Student = require('../models/Student');
const Package = require('../models/Package');
const Payment = require('../models/Payment');
const Attendance = require('../models/Attendance');

/* ──────────────────────────────────────────────────────────
   Student Controller — ManthraBeads Student Management (Stage 3 & 4)
   ────────────────────────────────────────────────────────── */

function formatRupees(paise) {
  if (typeof paise !== 'number' || isNaN(paise)) return '₹0';
  const rs = (paise / 100).toFixed(2);
  return rs.endsWith('.00')
    ? `₹${parseInt(rs, 10).toLocaleString('en-IN')}`
    : `₹${parseFloat(rs).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

const STANDARD_LEVELS = [
  'Level 1 — Foundation',
  'Level 2 — Basic',
  'Level 3 — Intermediate',
  'Level 4 — Advanced',
  'Level 5 — Higher',
  'Level 6 — Master',
  'Grand Master',
];

/**
 * Helper to validate form input
 */
function validateStudentInput(body) {
  const errors = {};
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const name = (body.name || '').trim();
  const phone = (body.phone || '').trim();
  const level = (body.level || '').trim();
  const studentEmail = (body.studentEmail || '').trim().toLowerCase();
  const parentEmail = (body.parentEmail || '').trim().toLowerCase();

  if (!name) {
    errors.name = 'Student full name is required.';
  } else if (name.length > 100) {
    errors.name = 'Student name cannot exceed 100 characters.';
  }

  if (!phone) {
    errors.phone = 'Phone number is required.';
  } else if (phone.length > 20) {
    errors.phone = 'Phone number cannot exceed 20 characters.';
  }

  if (!level) {
    errors.level = 'Please select or enter an abacus level.';
  }

  if (studentEmail && !emailRegex.test(studentEmail)) {
    errors.studentEmail = 'Please provide a valid student email address.';
  }

  if (parentEmail && !emailRegex.test(parentEmail)) {
    errors.parentEmail = 'Please provide a valid parent email address.';
  }

  return { errors, isValid: Object.keys(errors).length === 0 };
}

/* ── GET /teacher/students ── */
exports.listStudents = async (req, res) => {
  try {
    const q = (req.query.q || '').trim();
    const statusFilter = req.query.status || 'all';
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = 10;

    const filter = {};

    // Search query: matches name, studentId, or phone
    if (q) {
      const escaped = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      filter.$or = [
        { name: { $regex: escaped, $options: 'i' } },
        { studentId: { $regex: escaped, $options: 'i' } },
        { phone: { $regex: escaped, $options: 'i' } },
      ];
    }

    // Status filter
    if (statusFilter === 'active' || statusFilter === 'inactive') {
      filter.status = statusFilter;
    }

    const totalStudents = await Student.countDocuments(filter);
    const totalPages = Math.ceil(totalStudents / limit) || 1;
    const skip = (page - 1) * limit;

    const students = await Student.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Contextual alert message from query params
    let alertMessage = null;
    let alertType = 'success';
    if (req.query.deleted) {
      alertMessage = 'Student record has been deactivated.';
    } else if (req.query.error === 'not_found') {
      alertMessage = 'Requested student record could not be found.';
      alertType = 'error';
    }

    res.render('teacher/students/index', {
      teacher: res.locals.teacher,
      csrfToken: res.locals.csrfToken,
      activeSection: 'students',
      students,
      query: { q, status: statusFilter, page },
      pagination: {
        page,
        totalPages,
        totalStudents,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
      alertMessage,
      alertType,
    });
  } catch (err) {
    console.error('List students error:', err);
    res.status(500).render('teacher/students/index', {
      teacher: res.locals.teacher,
      csrfToken: res.locals.csrfToken,
      activeSection: 'students',
      students: [],
      query: { q: '', status: 'all', page: 1 },
      pagination: { page: 1, totalPages: 1, totalStudents: 0, hasNext: false, hasPrev: false },
      alertMessage: 'Unable to load student directory. Please try again.',
      alertType: 'error',
    });
  }
};

/* ── GET /teacher/students/new ── */
exports.showAddForm = async (req, res) => {
  try {
    const studentIdPreview = await Student.generateNextStudentId();

    res.render('teacher/students/form', {
      teacher: res.locals.teacher,
      csrfToken: res.locals.csrfToken,
      activeSection: 'students',
      isEdit: false,
      formAction: '/teacher/students',
      student: {
        studentId: studentIdPreview,
        name: '',
        parentName: '',
        studentEmail: '',
        parentEmail: '',
        phone: '',
        level: STANDARD_LEVELS[0],
        enrollmentDate: new Date().toISOString().split('T')[0],
        notes: '',
        status: 'active',
      },
      levels: STANDARD_LEVELS,
      errors: {},
    });
  } catch (err) {
    console.error('Show add student error:', err);
    res.redirect('/teacher/students?error=not_found');
  }
};

/* ── POST /teacher/students ── */
exports.createStudent = async (req, res) => {
  try {
    const { errors, isValid } = validateStudentInput(req.body);

    if (!isValid) {
      return res.status(400).render('teacher/students/form', {
        teacher: res.locals.teacher,
        csrfToken: res.locals.csrfToken,
        activeSection: 'students',
        isEdit: false,
        formAction: '/teacher/students',
        student: { ...req.body },
        levels: STANDARD_LEVELS,
        errors,
      });
    }

    // Auto-generate student ID
    const studentId = await Student.generateNextStudentId();

    const studentData = {
      studentId,
      name: req.body.name.trim(),
      parentName: (req.body.parentName || '').trim(),
      studentEmail: (req.body.studentEmail || '').trim().toLowerCase(),
      parentEmail: (req.body.parentEmail || '').trim().toLowerCase(),
      phone: req.body.phone.trim(),
      level: req.body.level.trim(),
      enrollmentDate: req.body.enrollmentDate ? new Date(req.body.enrollmentDate) : new Date(),
      notes: (req.body.notes || '').trim(),
      status: req.body.status === 'inactive' ? 'inactive' : 'active',
    };

    const newStudent = await Student.create(studentData);

    // POST-Redirect-GET
    res.redirect(`/teacher/students/${newStudent._id}?created=true`);
  } catch (err) {
    console.error('Create student error:', err);
    res.status(500).render('teacher/students/form', {
      teacher: res.locals.teacher,
      csrfToken: res.locals.csrfToken,
      activeSection: 'students',
      isEdit: false,
      formAction: '/teacher/students',
      student: { ...req.body },
      levels: STANDARD_LEVELS,
      errors: { general: 'Failed to create student. Please verify all fields and retry.' },
    });
  }
};

/* ── GET /teacher/students/:id ── */
exports.showStudentProfile = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).redirect('/teacher/students?error=not_found');
    }

    const student = await Student.findById(id).lean();
    if (!student) {
      return res.status(404).redirect('/teacher/students?error=not_found');
    }

    // Query all packages for this student (with virtuals for remaining classes, dues, etc.)
    const packages = await Package.find({ student: id }).sort({ createdAt: -1 });
    const activePackage = packages.find((p) => p.status === 'active') || null;

    // Query payment history for this student
    const payments = await Payment.find({ student: id })
      .populate('package', 'packageName')
      .sort({ paymentDate: -1, createdAt: -1 })
      .lean();

    // Query attendance records for this student (Stage 5)
    let attendanceRecords = [];
    let attendedCount = 0;
    let attendanceRate = null;
    try {
      attendanceRecords = await Attendance.find({ student: id })
        .populate('session', 'sessionName startTime endTime topic')
        .populate('package', 'packageName')
        .sort({ date: -1, createdAt: -1 })
        .lean();
      attendedCount = attendanceRecords.filter((r) => ['present', 'late'].includes(r.status)).length;
      attendanceRate = attendanceRecords.length > 0 ? Math.round((attendedCount / attendanceRecords.length) * 100) : null;
    } catch (attErr) {
      console.warn('Could not load attendance for student profile:', attErr.message);
    }

    let alertMessage = null;
    if (req.query.created) {
      alertMessage = `Student ${student.name} (${student.studentId}) successfully registered!`;
    } else if (req.query.updated) {
      alertMessage = 'Student profile updated successfully.';
    } else if (req.query.status_changed) {
      alertMessage = `Student marked as ${student.status.toUpperCase()}.`;
    }

    res.render('teacher/students/show', {
      teacher: res.locals.teacher,
      csrfToken: res.locals.csrfToken,
      activeSection: 'students',
      student,
      packages,
      activePackage,
      payments,
      attendanceRecords,
      attendedCount,
      attendanceRate,
      alertMessage,
      formatRupees,
    });
  } catch (err) {
    console.error('Show student profile error:', err);
    res.status(500).redirect('/teacher/students?error=not_found');
  }
};

/* ── GET /teacher/students/:id/edit ── */
exports.showEditForm = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).redirect('/teacher/students?error=not_found');
    }

    const student = await Student.findById(id).lean();
    if (!student) {
      return res.status(404).redirect('/teacher/students?error=not_found');
    }

    // Format enrollment date for HTML date input: YYYY-MM-DD
    const dateStr = student.enrollmentDate
      ? new Date(student.enrollmentDate).toISOString().split('T')[0]
      : '';

    res.render('teacher/students/form', {
      teacher: res.locals.teacher,
      csrfToken: res.locals.csrfToken,
      activeSection: 'students',
      isEdit: true,
      formAction: `/teacher/students/${student._id}`,
      student: {
        ...student,
        enrollmentDate: dateStr,
      },
      levels: STANDARD_LEVELS,
      errors: {},
    });
  } catch (err) {
    console.error('Show edit student error:', err);
    res.redirect('/teacher/students?error=not_found');
  }
};

/* ── POST /teacher/students/:id ── */
exports.updateStudent = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).redirect('/teacher/students?error=not_found');
    }

    const { errors, isValid } = validateStudentInput(req.body);

    if (!isValid) {
      return res.status(400).render('teacher/students/form', {
        teacher: res.locals.teacher,
        csrfToken: res.locals.csrfToken,
        activeSection: 'students',
        isEdit: true,
        formAction: `/teacher/students/${id}`,
        student: { ...req.body, _id: id },
        levels: STANDARD_LEVELS,
        errors,
      });
    }

    const updateData = {
      name: req.body.name.trim(),
      parentName: (req.body.parentName || '').trim(),
      studentEmail: (req.body.studentEmail || '').trim().toLowerCase(),
      parentEmail: (req.body.parentEmail || '').trim().toLowerCase(),
      phone: req.body.phone.trim(),
      level: req.body.level.trim(),
      enrollmentDate: req.body.enrollmentDate ? new Date(req.body.enrollmentDate) : new Date(),
      notes: (req.body.notes || '').trim(),
      status: req.body.status === 'inactive' ? 'inactive' : 'active',
    };

    const updated = await Student.findByIdAndUpdate(id, updateData, {
      returnDocument: 'after',
      runValidators: true,
    });

    if (!updated) {
      return res.status(404).redirect('/teacher/students?error=not_found');
    }

    res.redirect(`/teacher/students/${id}?updated=true`);
  } catch (err) {
    console.error('Update student error:', err);
    res.status(500).render('teacher/students/form', {
      teacher: res.locals.teacher,
      csrfToken: res.locals.csrfToken,
      activeSection: 'students',
      isEdit: true,
      formAction: `/teacher/students/${req.params.id}`,
      student: { ...req.body, _id: req.params.id },
      levels: STANDARD_LEVELS,
      errors: { general: 'Failed to update student profile. Please try again.' },
    });
  }
};

/* ── POST /teacher/students/:id/status ── */
exports.toggleStudentStatus = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).redirect('/teacher/students?error=not_found');
    }

    const student = await Student.findById(id);
    if (!student) {
      return res.status(404).redirect('/teacher/students?error=not_found');
    }

    student.status = student.status === 'active' ? 'inactive' : 'active';
    await student.save();

    res.redirect(`/teacher/students/${id}?status_changed=true`);
  } catch (err) {
    console.error('Toggle student status error:', err);
    res.redirect('/teacher/students?error=not_found');
  }
};
