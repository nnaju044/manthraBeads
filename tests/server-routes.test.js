const test = require('node:test');
const assert = require('node:assert/strict');
const http = require('http');

// Ensure database connection pool is not kept open during route unit test
delete process.env.MONGODB_URI;
const app = require('../server');

test('Public Routes: accessible without database configuration', async () => {
  const server = http.createServer(app);
  await new Promise((resolve) => server.listen(0, resolve));
  const port = server.address().port;

  async function get(path) {
    return new Promise((resolve, reject) => {
      http.get(`http://127.0.0.1:${port}${path}`, (res) => {
        let body = '';
        res.on('data', (chunk) => { body += chunk; });
        res.on('end', () => resolve({ status: res.statusCode, body }));
      }).on('error', reject);
    });
  }

  try {
    // 1. Home page
    const home = await get('/');
    assert.equal(home.status, 200);
    assert.ok(home.body.includes('ManthraBeads') || home.body.includes('Abacus'));

    // 2. Abacus interactive page
    const abacus = await get('/abacus-interactive');
    assert.equal(abacus.status, 200);

    // 3. About page
    const about = await get('/about');
    assert.equal(about.status, 200);

    // 4. Contact page
    const contact = await get('/contact');
    assert.equal(contact.status, 200);

    // 5. Teacher panel without MONGODB_URI returns 503
    const teacher = await get('/teacher');
    assert.equal(teacher.status, 503);
    assert.ok(teacher.body.includes('Teacher panel requires database configuration'));
  } finally {
    server.close();
  }
});
