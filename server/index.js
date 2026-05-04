require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { getDb } = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', express.static(path.join(__dirname, '..', 'public')));
app.use('/admin', express.static(path.join(__dirname, '..', 'admin')));

app.use('/api', require('./routes/public'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/admin', require('./routes/admin'));

app.get('/admin/*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'admin', 'index.html'));
});

async function init() {
  await getDb();
}

if (require.main === module) {
  init().then(() => {
    app.listen(PORT, () => {
      console.log(`\nPortfolio server running at http://localhost:${PORT}`);
      console.log(`Admin dashboard at http://localhost:${PORT}/admin`);
      console.log('\nPress Ctrl+C to stop.\n');
    });
  }).catch(err => {
    console.error('Failed to start server:', err);
    process.exit(1);
  });
} else {
  init().catch(err => {
    console.error('Failed to initialize database:', err);
  });
}

module.exports = app;
