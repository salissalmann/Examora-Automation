const { withCors } = require('../lib/middleware');
const { getStatus } = require('../lib/whatsapp');

async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  res.json({ connected: getStatus() });
}

module.exports = withCors(handler);
