const mongoose = require('mongoose');
const Notification = require('../models/Notification');
const Attendance = require('../models/Attendance');
const emailService = require('../services/emailService');

/* ──────────────────────────────────────────────────────────
   Notification Controller — Stage 6
   ────────────────────────────────────────────────────────── */

/**
 * GET /teacher/notifications
 * Renders the email notification history log and dispatch status.
 */
exports.listNotifications = async (req, res) => {
  try {
    const statusFilter = req.query.status || 'all';
    const searchQuery = (req.query.search || '').trim();
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = 25;
    const alertCode = req.query.alert || null;

    let alertMessage = null;
    let alertType = 'success';

    if (alertCode === 'retry_success') {
      alertMessage = 'Notification resent successfully!';
    } else if (alertCode === 'retry_failed') {
      alertMessage = 'Notification retry failed. Please inspect the error message below.';
      alertType = 'error';
    } else if (alertCode === 'batch_success') {
      const count = req.query.count || '0';
      alertMessage = `Retried ${count} failed notifications.`;
    } else if (alertCode === 'resend_success') {
      alertMessage = 'Post-class notification resent successfully.';
    }

    if (mongoose.connection.readyState !== 1) {
      return res.render('teacher/notifications/index', {
        teacher: res.locals.teacher,
        csrfToken: res.locals.csrfToken,
        activeSection: 'notifications',
        notifications: [],
        statusFilter,
        searchQuery,
        counts: { total: 0, sent: 0, failed: 0, pending: 0, skipped: 0 },
        isSmtpConfigured: emailService.isSmtpConfigured(),
        currentPage: 1,
        totalPages: 1,
        totalCount: 0,
        alertMessage,
        alertType,
      });
    }

    // Build filter
    const filter = {};
    if (['sent', 'failed', 'pending', 'skipped'].includes(statusFilter)) {
      filter.status = statusFilter;
    }

    if (searchQuery) {
      filter.$or = [
        { recipientEmail: { $regex: searchQuery, $options: 'i' } },
        { recipientName: { $regex: searchQuery, $options: 'i' } },
        { sessionName: { $regex: searchQuery, $options: 'i' } },
      ];
    }

    // Aggregate counts
    const [total, sent, failed, pending, skipped] = await Promise.all([
      Notification.countDocuments({}),
      Notification.countDocuments({ status: 'sent' }),
      Notification.countDocuments({ status: 'failed' }),
      Notification.countDocuments({ status: 'pending' }),
      Notification.countDocuments({ status: 'skipped' }),
    ]);

    const filteredTotal = await Notification.countDocuments(filter);
    const totalPages = Math.ceil(filteredTotal / limit) || 1;
    const skip = (page - 1) * limit;

    const notifications = await Notification.find(filter)
      .populate('student', 'name studentId level')
      .populate('session', 'sessionName date')
      .populate('attendance', 'status date')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    res.render('teacher/notifications/index', {
      teacher: res.locals.teacher,
      csrfToken: res.locals.csrfToken,
      activeSection: 'notifications',
      notifications,
      statusFilter,
      searchQuery,
      counts: { total, sent, failed, pending, skipped },
      isSmtpConfigured: emailService.isSmtpConfigured(),
      currentPage: page,
      totalPages,
      totalCount: filteredTotal,
      alertMessage,
      alertType,
    });
  } catch (err) {
    console.error('List notifications error:', err);
    res.status(500).render('teacher/notifications/index', {
      teacher: res.locals.teacher,
      csrfToken: res.locals.csrfToken,
      activeSection: 'notifications',
      notifications: [],
      statusFilter: 'all',
      searchQuery: '',
      counts: { total: 0, sent: 0, failed: 0, pending: 0, skipped: 0 },
      isSmtpConfigured: emailService.isSmtpConfigured(),
      currentPage: 1,
      totalPages: 1,
      totalCount: 0,
      alertMessage: 'Unable to load notification records: ' + err.message,
      alertType: 'error',
    });
  }
};

/**
 * POST /teacher/notifications/:id/retry
 * Retries a specific failed or pending notification.
 */
exports.retryNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await emailService.retryNotification(id);
    if (result && result.success) {
      return res.redirect('/teacher/notifications?alert=retry_success');
    }
    res.redirect(`/teacher/notifications?alert=retry_failed&reason=${encodeURIComponent(result ? result.reason : 'unknown')}`);
  } catch (err) {
    console.error('Retry notification error:', err);
    res.redirect('/teacher/notifications?alert=retry_failed');
  }
};

/**
 * POST /teacher/notifications/retry-failed
 * Retries all failed notifications with recipient emails (batch up to 25).
 */
exports.retryAllFailed = async (req, res) => {
  try {
    const failedList = await Notification.find({
      status: 'failed',
      recipientEmail: { $ne: '' },
    })
      .sort({ createdAt: -1 })
      .limit(25);

    let retriedCount = 0;
    for (const item of failedList) {
      const resVal = await emailService.retryNotification(item._id);
      if (resVal && resVal.success) {
        retriedCount++;
      }
    }

    res.redirect(`/teacher/notifications?alert=batch_success&count=${retriedCount}`);
  } catch (err) {
    console.error('Batch retry error:', err);
    res.redirect('/teacher/notifications?alert=retry_failed');
  }
};

/**
 * POST /teacher/notifications/resend-attendance/:attendanceId
 * Explicitly forces a resend of a class completion notification for an attendance record.
 */
exports.resendAttendanceNotification = async (req, res) => {
  try {
    const { attendanceId } = req.params;
    const notification = await emailService.dispatchClassNotification(attendanceId, { forceResend: true });
    if (notification && notification.status === 'sent') {
      return res.redirect('/teacher/notifications?alert=resend_success');
    }
    res.redirect('/teacher/notifications?alert=retry_failed');
  } catch (err) {
    console.error('Resend attendance notification error:', err);
    res.redirect('/teacher/notifications?alert=retry_failed');
  }
};
