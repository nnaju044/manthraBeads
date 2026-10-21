#!/usr/bin/env node

/**
 * seedTeacher.js — Create or update the initial teacher account.
 *
 * Usage:
 *   1. Copy .env.example → .env and fill in MONGODB_URI
 *   2. Run:  node scripts/seedTeacher.js
 *
 * This script prompts for email, name, and password interactively.
 * It never hardcodes credentials.
 */

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const readline = require('readline');
const Teacher = require('../models/Teacher');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function ask(question) {
  return new Promise((resolve) => rl.question(question, resolve));
}

async function seed() {
  if (!process.env.MONGODB_URI) {
    console.error('❌  MONGODB_URI not set. Copy .env.example → .env and configure it.');
    process.exit(1);
  }

  console.log('\n🌱  ManthraBeads — Teacher Account Setup\n');

  await mongoose.connect(process.env.MONGODB_URI);
  console.log('✅  Connected to MongoDB\n');

  const email = (await ask('  Email:    ')).trim().toLowerCase();
  const name = (await ask('  Name:     ')).trim();
  const password = (await ask('  Password: ')).trim();

  if (!email || !name || !password) {
    console.error('\n❌  All fields are required.');
    await mongoose.disconnect();
    rl.close();
    process.exit(1);
  }

  if (password.length < 8) {
    console.error('\n❌  Password must be at least 8 characters.');
    await mongoose.disconnect();
    rl.close();
    process.exit(1);
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const teacher = await Teacher.findOneAndUpdate(
    { email },
    { email, name, passwordHash },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  console.log('\n✅  Teacher account ready:');
  console.log(`    Email : ${teacher.email}`);
  console.log(`    Name  : ${teacher.name}`);
  console.log('\n    Login at: /teacher/login\n');

  await mongoose.disconnect();
  rl.close();
}

seed().catch((err) => {
  console.error('❌  Error:', err.message);
  process.exit(1);
});
