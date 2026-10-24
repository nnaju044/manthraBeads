require('dotenv').config();
const express = require('express');
const path = require('path');
const methodOverride = require('method-override');

const app = express();

// Trust reverse proxy (Vercel / AWS / Nginx) for secure cookies and client IP rate limiting
app.set('trust proxy', 1);

// Security Headers Middleware
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('X-XSS-Protection', '0');
  if (process.env.NODE_ENV === 'production') {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }
  next();
});

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Method override — enables PUT/PATCH/DELETE from HTML forms via ?_method=
app.use(methodOverride('_method'));

// Static files — cache for 1 day in production, 0 in dev
var staticMaxAge = process.env.NODE_ENV === 'production' ? 86400000 : 0;
app.use(express.static(path.join(__dirname, 'public'), { maxAge: staticMaxAge }));

// Private cache control for teacher portal — prevents browser disk caching on shared machines
app.use('/teacher', (req, res, next) => {
  res.setHeader('Cache-Control', 'private, no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  next();
});

// ── SESSION & DATABASE (when MONGODB_URI is configured) ──
if (process.env.MONGODB_URI) {
  const session = require('express-session');
  const connectMongo = require('connect-mongo');
  const MongoStore = connectMongo.MongoStore || connectMongo.default || connectMongo;
  const connectDB = require('./config/db');

  // Connect to database (cached for serverless warm starts)
  connectDB();

  // Session middleware
  app.use(
    session({
      secret: process.env.SESSION_SECRET || 'dev-secret-change-in-production',
      resave: false,
      saveUninitialized: false,
      store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI,
        touchAfter: 24 * 3600, // lazy session update (once per day)
      }),
      cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        sameSite: 'lax',
        maxAge: 1000 * 60 * 60 * 8, // 8 hours
      },
    })
  );

  // Expose teacher identity to all views for dynamic navbar
  app.use((req, res, next) => {
    if (req.session && req.session.teacherId) {
      res.locals.teacher = {
        id: req.session.teacherId,
        name: req.session.teacherName,
        email: req.session.teacherEmail,
      };
    } else {
      res.locals.teacher = null;
    }
    next();
  });

  // Teacher routes
  const teacherRoutes = require('./routes/teacher');
  app.use('/teacher', teacherRoutes);
} else {
  console.warn('⚠️  MONGODB_URI not set — teacher panel disabled');
  app.use('/teacher', (req, res) => {
    res.status(503).send('Teacher panel requires database configuration.');
  });
  app.use((req, res, next) => {
    res.locals.teacher = null;
    next();
  });
}

// ── PUBLIC ROUTES ──
const routes = require('./routes/index');
app.use('/', routes);

// ── 404 NOT FOUND HANDLER ──
app.use((req, res) => {
  res.status(404).render('404', {
    url: req.originalUrl,
  });
});

// ── 500 INTERNAL SERVER ERROR HANDLER ──
// Suppresses internal stack traces and secrets in production
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err.message);
  if (res.headersSent) {
    return next(err);
  }
  res.status(err.status || 500).render('500', {
    error: process.env.NODE_ENV === 'production' ? null : err.message,
  });
});

// Local development only
if (require.main === module && process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 1000;
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

module.exports = app;