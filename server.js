const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 1000;

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Static assets (place hippo.png, abacus.png, island.png in public/assets)
app.use(express.static(path.join(__dirname, 'public')));

const routes = require('./routes/index');

app.use('/', routes);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
