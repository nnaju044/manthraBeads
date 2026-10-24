const nodemailer = require('nodemailer');
const mongoose = require('mongoose');
const Notification = require('../models/Notification');
const Attendance = require('../models/Attendance');
const Package = require('../models/Package');
const Student = require('../models/Student');
const Session = require('../models/Session');

/* ──────────────────────────────────────────────────────────
   Email Service — Automated Post-Class Notifications (Stage 6)
   ────────────────────────────────────────────────────────── */

let customTransporter = null;

/**
 * Escape user-provided strings for safe insertion into HTML emails.
 * Prevents HTML/XSS injection.
 */
function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Sanitize error message to ensure no credentials or sensitive URLs leak into logs or DB.
 */
function sanitizeError(err) {
  if (!err) return 'Unknown error';
  const msg = typeof err === 'string' ? err : err.message || String(err);
  return msg
    .replace(/(password|pass|secret|token|api_?key|auth|bearer)\s*[:=]\s*([^\s,;&]+)/gi, '$1=***')
    .replace(/:\/\/([^:]+):([^@]+)@/g, '://***:***@')
    .replace(/AUTH\s+[A-Za-z0-9+/=]+/gi, 'AUTH ***')
    .slice(0, 300);
}

/**
 * Format paise into Indian Rupee display (e.g. ₹1,000 or ₹0).
 */
function formatRupees(paise) {
  if (typeof paise !== 'number' || isNaN(paise)) return '₹0';
  const rs = (paise / 100).toFixed(2);
  return rs.endsWith('.00')
    ? `₹${parseInt(rs, 10).toLocaleString('en-IN')}`
    : `₹${parseFloat(rs).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

/**
 * Check if SMTP is configured via environment variables.
 */
function isSmtpConfigured() {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
}

/**
 * Safely persist a mongoose document if connected, or execute custom mock save.
 * Avoids 10-second buffering hangs in disconnected unit test environments.
 */
async function safeSave(doc) {
  if (!doc) return doc;
  if (mongoose.connection.readyState === 1 || (typeof doc.save === 'function' && doc.save !== mongoose.Model.prototype.save)) {
    return doc.save();
  }
  return doc;
}

/**
 * Get or create the Nodemailer transporter.
 */
function getTransporter() {
  if (customTransporter) {
    return customTransporter;
  }

  if (!isSmtpConfigured()) {
    return null;
  }

  const port = parseInt(process.env.SMTP_PORT || '587', 10);
  const secure = process.env.SMTP_SECURE === 'true' || port === 465;

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    // Bounded connection timeouts for serverless environments
    connectionTimeout: 5000,
    greetingTimeout: 5000,
    socketTimeout: 8000,
  });
}

/**
 * Override the transporter (used for testing with mock transport).
 */
function setTransporter(transporter) {
  customTransporter = transporter;
}

/**
 * Generate responsive HTML and Plaintext email bodies.
 */
function buildEmailTemplate({
  studentName,
  studentId,
  recipientName,
  sessionName,
  sessionDate,
  attendanceStatus,
  packageName,
  remainingClasses,
  outstandingDuesPaise,
}) {
  const safeStudent = escapeHtml(studentName);
  const safeRecipient = escapeHtml(recipientName || studentName);
  const safeSession = escapeHtml(sessionName || 'Abacus Session');
  const safePackage = escapeHtml(packageName || 'Active Package');
  const safeStatus = escapeHtml(attendanceStatus.charAt(0).toUpperCase() + attendanceStatus.slice(1));
  const safeStudentId = escapeHtml(studentId || '—');

  const formattedDate = sessionDate
    ? new Date(sessionDate).toLocaleDateString('en-IN', {
        weekday: 'long',
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    : 'Today';

  const duesDisplay =
    outstandingDuesPaise !== null && outstandingDuesPaise !== undefined
      ? formatRupees(outstandingDuesPaise)
      : '₹0';

  const classesRemainingDisplay =
    remainingClasses !== null && remainingClasses !== undefined
      ? `${remainingClasses}`
      : '—';

  const subject = `ManthraBeads — Class Update for ${safeStudent}`;

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #070a1f; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #f1f5f9;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #070a1f; padding: 32px 16px;">
    <tr>
      <td align="center">
        <!-- Main Container -->
        <table role="presentation" width="100%" style="max-width: 580px; background: linear-gradient(180deg, #12183f 0%, #0b0f2e 100%); border: 1px solid rgba(255, 255, 255, 0.12); border-radius: 20px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.4);" cellspacing="0" cellpadding="0" border="0">
          
          <!-- Header Banner -->
          <tr>
            <td style="padding: 32px 32px 24px 32px; background: linear-gradient(135deg, #1e1b4b 0%, #31104b 100%); border-bottom: 1px solid rgba(255, 255, 255, 0.08); text-align: center;">
              <div style="display: inline-block; padding: 6px 14px; background: rgba(99, 102, 241, 0.2); border: 1px solid rgba(129, 140, 248, 0.4); border-radius: 9999px; font-size: 11px; font-weight: 700; color: #c7d2fe; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 12px;">
                ManthraBeads Abacus Academy
              </div>
              <h1 style="margin: 0; font-size: 24px; font-weight: 800; color: #ffffff; letter-spacing: -0.5px;">Class Completion Report</h1>
              <p style="margin: 6px 0 0 0; font-size: 13px; color: #cbd5e1;">Updates & package credit summary</p>
            </td>
          </tr>

          <!-- Body Content -->
          <tr>
            <td style="padding: 28px 32px;">
              <p style="margin: 0 0 16px 0; font-size: 15px; color: #e2e8f0; line-height: 1.6;">
                Hello <strong>${safeRecipient}</strong>,
              </p>
              <p style="margin: 0 0 24px 0; font-size: 14px; color: #cbd5e1; line-height: 1.6;">
                <strong>${safeStudent}</strong> has completed today's ManthraBeads abacus class. Here is a summary of the session and class package balance:
              </p>

              <!-- Session Details Card -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 14px; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 18px 20px;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="6" border="0" style="font-size: 13px;">
                      <tr>
                        <td width="38%" style="color: #94a3b8; font-weight: 500;">Student:</td>
                        <td style="color: #ffffff; font-weight: 700;">${safeStudent} <span style="color: #94a3b8; font-weight: 400; font-size: 11px;">(${safeStudentId})</span></td>
                      </tr>
                      <tr>
                        <td style="color: #94a3b8; font-weight: 500;">Class / Session:</td>
                        <td style="color: #ffffff; font-weight: 600;">${safeSession}</td>
                      </tr>
                      <tr>
                        <td style="color: #94a3b8; font-weight: 500;">Class Date:</td>
                        <td style="color: #ffffff;">${formattedDate}</td>
                      </tr>
                      <tr>
                        <td style="color: #94a3b8; font-weight: 500;">Attendance Status:</td>
                        <td>
                          <span style="display: inline-block; padding: 3px 10px; border-radius: 6px; font-weight: 700; font-size: 11px; text-transform: uppercase; ${attendanceStatus === 'late' ? 'background: rgba(245, 158, 11, 0.2); color: #fcd34d; border: 1px solid rgba(245, 158, 11, 0.4);' : 'background: rgba(16, 185, 129, 0.2); color: #6ee7b7; border: 1px solid rgba(16, 185, 129, 0.4);'}">
                            ${safeStatus}
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td style="color: #94a3b8; font-weight: 500;">Active Package:</td>
                        <td style="color: #ffffff;">${safePackage}</td>
                      </tr>
                      <tr>
                        <td style="color: #94a3b8; font-weight: 500;">Classes Remaining:</td>
                        <td style="color: #34d399; font-weight: 800; font-size: 14px;">${classesRemainingDisplay}</td>
                      </tr>
                      <tr>
                        <td style="color: #94a3b8; font-weight: 500;">Payment Balance:</td>
                        <td style="color: ${outstandingDuesPaise > 0 ? '#fbbf24' : '#94a3b8'}; font-weight: 700;">${duesDisplay} ${outstandingDuesPaise > 0 ? '<span style="font-size: 10px; font-weight: 400; color: #f59e0b;">(due)</span>' : '<span style="font-size: 10px; font-weight: 400; color: #10b981;">(cleared)</span>'}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <p style="margin: 0; font-size: 13px; color: #94a3b8; line-height: 1.6;">
                Thank you for being part of ManthraBeads Abacus Academy. Consistent practice strengthens mental calculation, speed, and concentration!
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 20px 32px; background: rgba(0, 0, 0, 0.25); border-top: 1px solid rgba(255, 255, 255, 0.05); text-align: center; font-size: 11px; color: #64748b;">
              &copy; ${new Date().getFullYear()} ManthraBeads Abacus Academy. All rights reserved.<br>
              This is an automated attendance notice sent on behalf of your teacher.
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();

  const text = `
ManthraBeads Abacus Academy — Class Completion Report
====================================================

Hello ${recipientName || studentName},

${studentName} has completed today's ManthraBeads abacus class.

Class: ${sessionName || 'Abacus Session'}
Date: ${formattedDate}
Attendance: ${safeStatus}
Package: ${packageName || 'Active Package'}
Classes remaining: ${classesRemainingDisplay}

Payment balance: ${duesDisplay}

Thank you for being part of ManthraBeads Abacus Academy.

© ${new Date().getFullYear()} ManthraBeads Abacus Academy
  `.trim();

  return { subject, html, text };
}

/**
 * Dispatch or queue an automated post-class notification for a specific attendance record.
 * Idempotent: re-invoking with the same attendanceId and type returns the existing notification
 * without sending duplicate emails.
 */
async function dispatchClassNotification(attendanceId, options = {}) {
  const { forceResend = false } = options;

  if (!mongoose.Types.ObjectId.isValid(attendanceId)) {
    return null;
  }

  // 1. Fetch Attendance with populated student, session, and package
  const attendance = await Attendance.findById(attendanceId)
    .populate('student')
    .populate('session')
    .populate('package');

  if (!attendance || !attendance.student) {
    return null;
  }

  const student = attendance.student;
  const session = attendance.session;
  const status = attendance.status;

  // 2. Notification Rules based on attendance status
  let notificationType = null;
  if (status === 'present') {
    notificationType = 'class_completion';
  } else if (status === 'late') {
    notificationType = 'late_arrival';
  } else if (status === 'absent' && process.env.ENABLE_ABSENCE_EMAILS === 'true') {
    notificationType = 'absence';
  } else {
    // 'excused' or absent when absence emails are disabled -> do not send
    return null;
  }

  const idempotencyKey = `${attendance._id}:${notificationType}`;

  // 3. Idempotency Check: look for existing notification
  let notification = null;
  if (mongoose.connection.readyState === 1 || Notification.findOne !== mongoose.Model.findOne) {
    notification = await Notification.findOne({ idempotencyKey });
  }

  if (notification && notification.status === 'sent' && !forceResend) {
    // Already sent, prevent duplicate email
    return notification;
  }

  // 4. Determine recipient email & name
  let recipientEmail = '';
  let recipientName = '';
  let recipientType = 'none';

  if (student.studentEmail && student.studentEmail.trim()) {
    recipientEmail = student.studentEmail.trim().toLowerCase();
    recipientName = student.name;
    recipientType = 'student';
  } else if (student.parentEmail && student.parentEmail.trim()) {
    recipientEmail = student.parentEmail.trim().toLowerCase();
    recipientName = student.parentName || student.name;
    recipientType = 'parent';
  }

  // Package metrics
  let pkg = attendance.package;
  if (!pkg && student._id && (mongoose.connection.readyState === 1 || Package.findOne !== mongoose.Model.findOne)) {
    // Check if student has an active package if not directly populated
    pkg = await Package.findOne({
      student: student._id,
      status: 'active',
    }).sort({ createdAt: -1 });
  }

  const remainingClasses = pkg ? pkg.remainingClasses : null;
  const totalClasses = pkg ? pkg.totalClasses : null;
  const packageName = pkg ? pkg.packageName : 'No Package Assigned';
  const outstandingDuesPaise = pkg ? pkg.outstandingDuesPaise : null;

  // 5. Create or update Notification record
  if (!notification) {
    notification = new Notification({
      student: student._id,
      attendance: attendance._id,
      session: session ? session._id : null,
      package: pkg ? pkg._id : null,
      recipientEmail,
      recipientName,
      recipientType,
      notificationType,
      idempotencyKey,
      sessionName: session ? session.sessionName : 'Abacus Session',
      sessionDate: session ? session.date : attendance.date,
      attendanceStatus: status,
      remainingClasses,
      totalClasses,
      packageName,
      outstandingDuesPaise,
      status: 'pending',
      attemptCount: 0,
    });
  } else {
    notification.recipientEmail = recipientEmail;
    notification.recipientName = recipientName;
    notification.recipientType = recipientType;
    notification.sessionName = session ? session.sessionName : 'Abacus Session';
    notification.sessionDate = session ? session.date : attendance.date;
    notification.attendanceStatus = status;
    notification.remainingClasses = remainingClasses;
    notification.totalClasses = totalClasses;
    notification.packageName = packageName;
    notification.outstandingDuesPaise = outstandingDuesPaise;
  }

  // 6. Check if email is missing -> record as skipped
  if (!recipientEmail) {
    notification.status = 'skipped';
    notification.skipReason = 'no_recipient_email';
    notification.lastError = 'Neither student nor parent email address is available on profile';
    await safeSave(notification);
    return notification;
  }

  // 7. Check if SMTP is configured
  const transporter = getTransporter();
  if (!transporter) {
    console.warn(
      '⚠️  [EmailService] SMTP not configured. Notification recorded as pending/failed. Add SMTP_HOST, SMTP_USER, and SMTP_PASS to .env.'
    );
    notification.status = 'failed';
    notification.skipReason = 'smtp_unconfigured';
    notification.lastError = 'SMTP not configured in environment variables';
    await safeSave(notification);
    return notification;
  }

  // 8. Build Email Body
  const { subject, html, text } = buildEmailTemplate({
    studentName: student.name,
    studentId: student.studentId,
    recipientName,
    sessionName: session ? session.sessionName : 'Abacus Session',
    sessionDate: session ? session.date : attendance.date,
    attendanceStatus: status,
    packageName,
    remainingClasses,
    outstandingDuesPaise,
  });

  notification.subject = subject;

  // 9. Send Email
  try {
    const fromAddress =
      process.env.MAIL_FROM ||
      process.env.EMAIL_FROM ||
      '"ManthraBeads Academy" <notifications@manthrabeads.com>';

    const info = await transporter.sendMail({
      from: fromAddress,
      to: recipientEmail,
      subject,
      text,
      html,
    });

    notification.status = 'sent';
    notification.sentAt = new Date();
    notification.messageId = info.messageId || `msg-${Date.now()}`;
    notification.attemptCount += 1;
    notification.lastError = '';
    await safeSave(notification);

    return notification;
  } catch (err) {
    console.error(`[EmailService] Failed to send email to ${recipientEmail}:`, sanitizeError(err));
    notification.status = 'failed';
    notification.attemptCount += 1;
    notification.lastError = sanitizeError(err);
    await safeSave(notification);

    return notification;
  }
}

/**
 * Retry sending a failed or pending notification.
 */
async function retryNotification(notificationId) {
  if (!mongoose.Types.ObjectId.isValid(notificationId)) {
    return { success: false, reason: 'INVALID_ID' };
  }

  let notification = null;
  if (mongoose.connection.readyState === 1 || Notification.findById !== mongoose.Model.findById) {
    notification = await Notification.findById(notificationId)
      .populate('student')
      .populate('attendance');
  }

  if (!notification) {
    return { success: false, reason: 'NOT_FOUND' };
  }

  if (notification.status === 'skipped' && !notification.recipientEmail) {
    return { success: false, reason: 'MISSING_EMAIL' };
  }

  const transporter = getTransporter();
  if (!transporter) {
    notification.attemptCount += 1;
    notification.lastError = 'SMTP not configured in environment variables';
    await safeSave(notification);
    return { success: false, reason: 'SMTP_UNCONFIGURED' };
  }

  const student = notification.student;
  const { subject, html, text } = buildEmailTemplate({
    studentName: student ? student.name : 'Student',
    studentId: student ? student.studentId : '—',
    recipientName: notification.recipientName,
    sessionName: notification.sessionName,
    sessionDate: notification.sessionDate,
    attendanceStatus: notification.attendanceStatus || 'present',
    packageName: notification.packageName,
    remainingClasses: notification.remainingClasses,
    outstandingDuesPaise: notification.outstandingDuesPaise,
  });

  try {
    const fromAddress =
      process.env.MAIL_FROM ||
      process.env.EMAIL_FROM ||
      '"ManthraBeads Academy" <notifications@manthrabeads.com>';

    const info = await transporter.sendMail({
      from: fromAddress,
      to: notification.recipientEmail,
      subject,
      text,
      html,
    });

    notification.status = 'sent';
    notification.sentAt = new Date();
    notification.messageId = info.messageId || `retry-${Date.now()}`;
    notification.attemptCount += 1;
    notification.lastError = '';
    await safeSave(notification);

    return { success: true, notification };
  } catch (err) {
    notification.attemptCount += 1;
    notification.lastError = sanitizeError(err);
    await safeSave(notification);

    return { success: false, reason: 'SMTP_ERROR', error: notification.lastError };
  }
}

/**
 * Send a 6-digit OTP email for Teacher Password Reset.
 */
async function sendPasswordResetOtp({ email, name, otp, expiresInMinutes = 5 }) {
  if (!email || !otp) {
    throw new Error('Email and OTP are required');
  }

  const transporter = getTransporter();

  // If SMTP is not configured
  if (!transporter) {
    if (process.env.EMAIL_DEV_MODE === 'true' || process.env.NODE_ENV === 'test') {
      return { success: true, simulated: true };
    }
    console.warn('[EmailService] SMTP not configured. Cannot send password reset OTP.');
    return { success: false, reason: 'SMTP_NOT_CONFIGURED', error: 'Email service is not configured' };
  }

  const safeName = escapeHtml(name || 'Teacher');
  const safeOtp = escapeHtml(otp);
  const subject = 'ManthraBeads Teacher Portal - Password Reset Code';

  const text = `Hello ${name || 'Teacher'},

You recently requested to reset your password for the ManthraBeads Teacher Portal.

Your 6-digit verification code is: ${otp}

This code will expire in ${expiresInMinutes} minutes.

If you did not request this password reset, please ignore this email or contact support immediately. Never share this code with anyone.

Best regards,
ManthraBeads Academy`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Password Reset Code</title>
</head>
<body style="margin: 0; padding: 24px; background-color: #070a1f; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #ffffff;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 520px; margin: 0 auto; background-color: #12183f; border: 1px solid rgba(255,255,255,0.12); border-radius: 16px; overflow: hidden;">
    <tr>
      <td style="padding: 32px 32px 24px; text-align: center; background: linear-gradient(135deg, rgba(99,102,241,0.2), rgba(168,85,247,0.2)); border-bottom: 1px solid rgba(255,255,255,0.08);">
        <h1 style="margin: 0; font-size: 22px; font-weight: 700; color: #ffffff; letter-spacing: -0.02em;">ManthraBeads Academy</h1>
        <p style="margin: 6px 0 0; font-size: 13px; color: rgba(199,210,254,0.7);">Teacher Portal &bull; Security Verification</p>
      </td>
    </tr>
    <tr>
      <td style="padding: 32px;">
        <p style="margin: 0 0 16px; font-size: 15px; color: #e0e7ff; line-height: 1.6;">Hello <strong>${safeName}</strong>,</p>
        <p style="margin: 0 0 24px; font-size: 14px; color: rgba(199,210,254,0.8); line-height: 1.6;">
          We received a request to reset the password for your ManthraBeads teacher account. Use the verification code below to set a new password:
        </p>

        <div style="background-color: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.15); border-radius: 12px; padding: 20px; text-align: center; margin: 0 0 24px;">
          <span style="font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace; font-size: 34px; font-weight: 700; letter-spacing: 0.3em; color: #818cf8; display: inline-block;">
            ${safeOtp}
          </span>
          <p style="margin: 10px 0 0; font-size: 12px; color: rgba(199,210,254,0.6);">
            ⏱ Code expires in <strong>${expiresInMinutes} minutes</strong>
          </p>
        </div>

        <div style="background-color: rgba(239,68,68,0.1); border-left: 3px solid #ef4444; padding: 12px 16px; border-radius: 6px; margin: 0 0 24px;">
          <p style="margin: 0; font-size: 12px; color: #fca5a5; line-height: 1.5;">
            <strong>Security Notice:</strong> Never share this code with anyone. ManthraBeads staff will never ask for your verification code.
          </p>
        </div>

        <p style="margin: 0; font-size: 13px; color: rgba(199,210,254,0.6); line-height: 1.5;">
          If you didn't request a password reset, you can safely ignore this email. Your current password remains unchanged.
        </p>
      </td>
    </tr>
    <tr>
      <td style="padding: 20px 32px; background-color: rgba(0,0,0,0.2); border-top: 1px solid rgba(255,255,255,0.05); text-align: center;">
        <p style="margin: 0; font-size: 11px; color: rgba(199,210,254,0.4);">
          &copy; ${new Date().getFullYear()} ManthraBeads Academy. All rights reserved.
        </p>
      </td>
    </tr>
  </table>
</body>
</html>`;

  try {
    const fromAddress =
      process.env.MAIL_FROM ||
      process.env.EMAIL_FROM ||
      '"ManthraBeads Academy" <notifications@manthrabeads.com>';

    const info = await transporter.sendMail({
      from: fromAddress,
      to: email,
      subject,
      text,
      html,
    });

    return { success: true, messageId: info.messageId };
  } catch (err) {
    const sanitized = sanitizeError(err);
    console.error('[EmailService] Failed to send OTP email:', sanitized);
    return { success: false, reason: 'SMTP_ERROR', error: sanitized };
  }
}

module.exports = {
  dispatchClassNotification,
  retryNotification,
  sendPasswordResetOtp,
  buildEmailTemplate,
  escapeHtml,
  sanitizeError,
  formatRupees,
  isSmtpConfigured,
  setTransporter,
  getTransporter,
};
