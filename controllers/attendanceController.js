const mongoose = require('mongoose');
const ExcelJS = require('exceljs');
const Student = require('../models/Student');
const Package = require('../models/Package');
const Session = require('../models/Session');
const Attendance = require('../models/Attendance');

/* ──────────────────────────────────────────────────────────
   Attendance & Class-Credit Controller — Stage 5
   ────────────────────────────────────────────────────────── */

/**
 * Formula injection sanitizer for spreadsheet export.
 * Prepends a single quote if string starts with sensitive characters.
 */
function sanitizeForSpreadsheet(val) {
  if (val === null || val === undefined) return '';
  const str = String(val).trim();
  if (/^[=+\-@\t\r]/.test(str)) {
    return `'${str}`;
  }
  return str;
}

/**
 * Safe ISO Date formatter (YYYY-MM-DD). Never throws RangeError on invalid dates.
 */
function formatDateISO(d) {
  if (!d) return new Date().toISOString().split('T')[0];
  const dt = new Date(d);
  if (isNaN(dt.getTime())) return new Date().toISOString().split('T')[0];
  return dt.toISOString().split('T')[0];
}

/**
 * Safe Locale Date formatter. Never throws on invalid dates.
 */
function formatDateDisplay(d, options) {
  if (!d) return '—';
  const dt = new Date(d);
  if (isNaN(dt.getTime())) return '—';
  return dt.toLocaleDateString('en-IN', options || { day: '2-digit', month: 'short', year: 'numeric' });
}

/* ── GET /teacher/attendance ── */
exports.showAttendance = async (req, res) => {
  try {
    let selectedDateStr = req.query.date || new Date().toISOString().split('T')[0];
    let selectedDate = new Date(selectedDateStr + 'T00:00:00.000Z');
    if (isNaN(selectedDate.getTime())) {
      selectedDate = new Date();
      selectedDateStr = selectedDate.toISOString().split('T')[0];
    }
    const nextDay = new Date(selectedDate);
    nextDay.setUTCDate(nextDay.getUTCDate() + 1);

    const levelFilter = req.query.level || 'all';
    const alertMessage = req.query.saved ? 'Attendance recorded and package credits updated successfully.' : null;

    // 1. Fetch sessions for the selected date
    let dateSessions = [];
    let activeSession = null;
    let students = [];
    const studentRoster = [];
    let sessionAttendanceCounts = { present: 0, absent: 0, late: 0, excused: 0, total: 0 };
    let todaySessionsCount = 0;
    let todayAttendancePct = null;
    let todayAttendanceRecords = [];
    let attendedCount = 0;
    let recentSessions = [];

    if (mongoose.connection.readyState === 1) {
      dateSessions = await Session.find({
        date: { $gte: selectedDate, $lt: nextDay },
      })
        .sort({ createdAt: 1 })
        .lean();

      if (req.query.sessionId && mongoose.Types.ObjectId.isValid(req.query.sessionId)) {
        activeSession = dateSessions.find((s) => String(s._id) === String(req.query.sessionId)) || null;
        if (!activeSession) {
          activeSession = await Session.findById(req.query.sessionId).lean();
        }
      }

      // Default to the first session of the day if available
      if (!activeSession && dateSessions.length > 0) {
        activeSession = dateSessions[0];
      }

      // 2. Fetch active students roster
      const studentQuery = { status: 'active' };
      if (levelFilter !== 'all') {
        studentQuery.level = levelFilter;
      }
      students = await Student.find(studentQuery).sort({ name: 1 }).lean();

      // 3. If a session is selected, load existing attendance records and student packages
      if (activeSession) {
        const attendanceRecords = await Attendance.find({
          session: activeSession._id,
        }).lean();

        const attendanceMap = new Map();
        for (const rec of attendanceRecords) {
          attendanceMap.set(String(rec.student), rec);
        }

        for (const student of students) {
          const att = attendanceMap.get(String(student._id)) || null;

          // Fetch student's current active package
          const activePkg = await Package.findOne({
            student: student._id,
            status: 'active',
            $expr: { $lt: ['$consumedClasses', '$totalClasses'] },
          })
            .sort({ createdAt: 1 })
            .lean({ virtuals: true });

          const status = att ? att.status : 'present'; // Default to present for quick rolls

          if (att) {
            sessionAttendanceCounts[att.status] = (sessionAttendanceCounts[att.status] || 0) + 1;
            sessionAttendanceCounts.total += 1;
          }

          studentRoster.push({
            student,
            attendance: att,
            status,
            notes: att ? att.notes : '',
            activePackage: activePkg,
            creditStatus: att ? att.creditStatus : 'none',
            creditConsumed: att ? att.creditConsumed : false,
          });
        }
      }

      // 4. Summary metrics across today
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);
      const todayEnd = new Date();
      todayEnd.setHours(23, 59, 59, 999);

      todayAttendanceRecords = await Attendance.find({
        date: { $gte: todayStart, $lte: todayEnd },
      }).lean();

      todaySessionsCount = await Session.countDocuments({
        date: { $gte: todayStart, $lte: todayEnd },
      });

      attendedCount = todayAttendanceRecords.filter((r) => ['present', 'late'].includes(r.status)).length;
      todayAttendancePct =
        todayAttendanceRecords.length > 0 ? Math.round((attendedCount / todayAttendanceRecords.length) * 100) : null;

      // 5. Recent 10 Sessions History
      recentSessions = await Session.find()
        .sort({ date: -1, createdAt: -1 })
        .limit(10)
        .lean();
    }

    res.render('teacher/attendance/index', {
      teacher: res.locals.teacher,
      csrfToken: res.locals.csrfToken,
      activeSection: 'attendance',
      selectedDate: selectedDateStr,
      levelFilter,
      dateSessions,
      activeSession,
      studentRoster,
      sessionAttendanceCounts,
      todayStats: {
        todaySessionsCount,
        todayAttendancePct,
        totalMarked: todayAttendanceRecords.length,
        attendedCount,
      },
      recentSessions,
      alertMessage,
      formatDateISO,
      formatDateDisplay,
    });
  } catch (err) {
    console.error('Show attendance error:', err);
    res.status(500).render('teacher/attendance/index', {
      teacher: res.locals.teacher,
      csrfToken: res.locals.csrfToken,
      activeSection: 'attendance',
      selectedDate: new Date().toISOString().split('T')[0],
      levelFilter: 'all',
      dateSessions: [],
      activeSession: null,
      studentRoster: [],
      sessionAttendanceCounts: { present: 0, absent: 0, late: 0, excused: 0, total: 0 },
      todayStats: { todaySessionsCount: 0, todayAttendancePct: null, totalMarked: 0, attendedCount: 0 },
      recentSessions: [],
      alertMessage: null,
      formatDateISO,
      formatDateDisplay,
      error: 'Unable to load attendance records. Please try again.',
    });
  }
};

/* ── POST /teacher/attendance/sessions (Create Session) ── */
exports.createSession = async (req, res) => {
  try {
    const sessionName = (req.body.sessionName || '').trim();
    const dateStr = req.body.date || new Date().toISOString().split('T')[0];
    const level = req.body.level || 'All Levels';
    const startTime = (req.body.startTime || '10:00 AM').trim();
    const endTime = (req.body.endTime || '11:00 AM').trim();
    const topic = (req.body.topic || '').trim();
    const notes = (req.body.notes || '').trim();

    if (!sessionName) {
      return res.redirect(`/teacher/attendance?date=${dateStr}&error=session_name_required`);
    }

    const sessionDate = new Date(dateStr + 'T00:00:00.000Z');

    const newSession = await Session.create({
      sessionName,
      date: sessionDate,
      level,
      startTime,
      endTime,
      topic,
      notes,
      status: 'completed',
      recordedBy: req.session.teacherId,
    });

    res.redirect(`/teacher/attendance?date=${dateStr}&sessionId=${newSession._id}&created=true`);
  } catch (err) {
    console.error('Create session error:', err);
    res.redirect('/teacher/attendance?error=create_failed');
  }
};

/* ── POST /teacher/attendance (Save / Update Attendance Roster) ── */
exports.saveAttendance = async (req, res) => {
  try {
    const { sessionId, date } = req.body;
    if (!sessionId || !mongoose.Types.ObjectId.isValid(sessionId)) {
      return res.status(404).redirect('/teacher/attendance?error=invalid_session');
    }

    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).redirect('/teacher/attendance?error=session_not_found');
    }

    const attendanceData = req.body.attendance || {};
    const notesData = req.body.attendanceNotes || {};
    const studentIds = Object.keys(attendanceData);

    for (const studentId of studentIds) {
      if (!mongoose.Types.ObjectId.isValid(studentId)) continue;

      const newStatus = attendanceData[studentId];
      if (!['present', 'absent', 'late', 'excused'].includes(newStatus)) continue;

      const notes = (notesData[studentId] || '').trim();

      // Check existing attendance record for this student and session
      let existingRecord = await Attendance.findOne({
        student: studentId,
        session: session._id,
      });

      const countsAsAttended = ['present', 'late'].includes(newStatus);
      const previouslyAttended = existingRecord && ['present', 'late'].includes(existingRecord.status);

      let pkgId = existingRecord ? existingRecord.package : null;
      let creditConsumed = existingRecord ? existingRecord.creditConsumed : false;
      let creditStatus = existingRecord ? existingRecord.creditStatus : 'none';

      // ── Credit Deduction / Reversal Logic ──
      if (countsAsAttended) {
        // Needs a credit if not already consumed
        if (!creditConsumed) {
          const activePkg = await Package.getActivePackageForStudent(studentId);
          if (activePkg) {
            const consumeRes = await Package.consumeOneClassCredit(activePkg._id, session._id);
            if (consumeRes.success) {
              pkgId = activePkg._id;
              creditConsumed = true;
              creditStatus = 'consumed';
            } else {
              creditConsumed = false;
              creditStatus = 'no_package';
            }
          } else {
            creditConsumed = false;
            creditStatus = 'no_package';
          }
        }
      } else {
        // Absent or Excused: Revert credit if previously consumed
        if (creditConsumed && pkgId) {
          await Package.revertOneClassCredit(pkgId, session._id);
          creditConsumed = false;
          creditStatus = 'reverted';
        } else {
          creditConsumed = false;
          creditStatus = 'none';
        }
      }

      // Upsert Attendance record
      await Attendance.findOneAndUpdate(
        { student: studentId, session: session._id },
        {
          student: studentId,
          session: session._id,
          date: session.date,
          status: newStatus,
          package: pkgId,
          creditConsumed,
          creditStatus,
          notes,
          recordedBy: req.session.teacherId,
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    }

    session.status = 'completed';
    await session.save();

    const dateStr = session.date.toISOString().split('T')[0];
    res.redirect(`/teacher/attendance?date=${dateStr}&sessionId=${session._id}&saved=true`);
  } catch (err) {
    console.error('Save attendance error:', err);
    res.redirect('/teacher/attendance?error=save_failed');
  }
};

/* ── GET /teacher/attendance/export.xlsx (Excel Export) ── */
exports.exportAttendanceExcel = async (req, res) => {
  try {
    const { startDate, endDate, studentId, status, sessionId } = req.query;
    const filter = {};

    if (startDate && endDate) {
      filter.date = {
        $gte: new Date(startDate + 'T00:00:00.000Z'),
        $lte: new Date(endDate + 'T23:59:59.999Z'),
      };
    } else if (startDate) {
      filter.date = { $gte: new Date(startDate + 'T00:00:00.000Z') };
    } else if (endDate) {
      filter.date = { $lte: new Date(endDate + 'T23:59:59.999Z') };
    }

    if (studentId && mongoose.Types.ObjectId.isValid(studentId)) {
      filter.student = studentId;
    }

    if (sessionId && mongoose.Types.ObjectId.isValid(sessionId)) {
      filter.session = sessionId;
    }

    if (status && ['present', 'absent', 'late', 'excused'].includes(status)) {
      filter.status = status;
    }

    const records = await Attendance.find(filter)
      .populate('student', 'name studentId level phone')
      .populate('session', 'sessionName startTime endTime')
      .populate('package', 'packageName totalClasses consumedClasses')
      .populate('recordedBy', 'name email')
      .sort({ date: -1, createdAt: -1 })
      .lean();

    // Create Excel Workbook with ExcelJS
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'ManthraBeads Teacher Panel';
    workbook.created = new Date();

    const worksheet = workbook.addWorksheet('Attendance Ledger', {
      pageSetup: { paperSize: 9, orientation: 'landscape' },
    });

    // Define Columns
    worksheet.columns = [
      { header: 'Student ID', key: 'studentId', width: 14 },
      { header: 'Student Name', key: 'studentName', width: 24 },
      { header: 'Level', key: 'level', width: 12 },
      { header: 'Date', key: 'date', width: 14 },
      { header: 'Session / Batch', key: 'sessionName', width: 26 },
      { header: 'Timing', key: 'timing', width: 18 },
      { header: 'Attendance Status', key: 'status', width: 18 },
      { header: 'Package Credit Status', key: 'creditStatus', width: 22 },
      { header: 'Package Details', key: 'packageDetails', width: 24 },
      { header: 'Notes / Remarks', key: 'notes', width: 30 },
      { header: 'Recorded By', key: 'recordedBy', width: 20 },
    ];

    // Style Header Row
    const headerRow = worksheet.getRow(1);
    headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 11 };
    headerRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF1A2150' }, // Deep navy
    };
    headerRow.alignment = { vertical: 'middle', horizontal: 'center' };
    headerRow.height = 28;

    // Populate Data Rows with Formula Injection Protection
    for (const rec of records) {
      const studentName = rec.student ? rec.student.name : 'Unknown';
      const studentCode = rec.student ? rec.student.studentId : '—';
      const level = rec.student ? rec.student.level : '—';
      const sessionTitle = rec.session ? rec.session.sessionName : 'General Session';
      const timing = rec.session ? `${rec.session.startTime || ''} - ${rec.session.endTime || ''}`.trim() : '—';
      const dateStr = rec.date ? new Date(rec.date).toISOString().split('T')[0] : '—';
      const statusStr = (rec.status || 'present').toUpperCase();

      let creditDesc = 'None';
      if (rec.creditStatus === 'consumed') creditDesc = '1 Credit Deducted';
      else if (rec.creditStatus === 'reverted') creditDesc = 'Reverted (Absent)';
      else if (rec.creditStatus === 'no_package') creditDesc = 'No Active Package';

      const pkgName = rec.package ? `${rec.package.packageName} (${rec.package.consumedClasses}/${rec.package.totalClasses})` : 'None';
      const notes = rec.notes || '—';
      const teacherName = rec.recordedBy ? rec.recordedBy.name || rec.recordedBy.email : 'Teacher';

      const row = worksheet.addRow({
        studentId: sanitizeForSpreadsheet(studentCode),
        studentName: sanitizeForSpreadsheet(studentName),
        level: sanitizeForSpreadsheet(level),
        date: dateStr,
        sessionName: sanitizeForSpreadsheet(sessionTitle),
        timing: sanitizeForSpreadsheet(timing),
        status: sanitizeForSpreadsheet(statusStr),
        creditStatus: sanitizeForSpreadsheet(creditDesc),
        packageDetails: sanitizeForSpreadsheet(pkgName),
        notes: sanitizeForSpreadsheet(notes),
        recordedBy: sanitizeForSpreadsheet(teacherName),
      });

      // Highlight status column
      const statusCell = row.getCell('status');
      if (rec.status === 'present') {
        statusCell.font = { color: { argb: 'FF065F46' }, bold: true };
      } else if (rec.status === 'absent') {
        statusCell.font = { color: { argb: 'FF991B1B' }, bold: true };
      } else if (rec.status === 'late') {
        statusCell.font = { color: { argb: 'FF92400E' }, bold: true };
      } else if (rec.status === 'excused') {
        statusCell.font = { color: { argb: 'FF1E40AF' }, bold: true };
      }
    }

    const todayDate = new Date().toISOString().split('T')[0];
    const filename = `manthra-beads-attendance-${todayDate}.xlsx`;

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    console.error('Export attendance error:', err);
    res.status(500).redirect('/teacher/attendance?error=export_failed');
  }
};
