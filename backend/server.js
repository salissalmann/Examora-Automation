require('dotenv').config();
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const { initializeWhatsApp } = require('./lib/whatsapp');

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later.',
});
app.use('/api/', apiLimiter);

initializeWhatsApp();

app.all('/api/qr', require('./api/qr'));
app.all('/api/status', require('./api/status'));
app.all('/api/send', require('./api/send'));

if (require.main === module) {
  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
}

module.exports = app;
