 const express = require('express');
const path = require('path');

const app = express();

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Static files — cache for 1 day in production, 0 in dev
var staticMaxAge = process.env.NODE_ENV === 'production' ? 86400000 : 0;
app.use(express.static(path.join(__dirname, 'public'), { maxAge: staticMaxAge }));

const routes = require('./routes/index');
app.use('/', routes);

// Local development only
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 1000;
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

module.exports = app;