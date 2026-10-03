const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.render('index');
});

router.get('/abacus', (req, res) => {
  res.render('abacus');
});

router.get('/abacus-interactive', (req, res) => {
  res.render('abacus-interactive');
});

router.get('/about', (req, res) => {
  res.render('about');
});

router.get('/contact', (req, res) => {
  res.render('contact');
});

module.exports = router;
