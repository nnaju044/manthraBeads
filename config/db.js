const mongoose = require('mongoose');

/* ──────────────────────────────────────────────────────────
   MongoDB connection — cached globally so Vercel serverless
   warm starts reuse the existing connection.
   ────────────────────────────────────────────────────────── */

let cached = global._mongooseCache;
if (!cached) {
  cached = global._mongooseCache = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!process.env.MONGODB_URI) {
    console.warn('⚠️  MONGODB_URI not set — database features disabled');
    return null;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(process.env.MONGODB_URI, {
      bufferCommands: false,
    });
  }

  try {
    cached.conn = await cached.promise;
    console.log('✅ Connected to MongoDB');
    return cached.conn;
  } catch (err) {
    cached.promise = null;
    console.error('❌ MongoDB connection error:', err.message);
    throw err;
  }
}

module.exports = connectDB;
