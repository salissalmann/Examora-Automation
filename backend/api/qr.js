const { withCors } = require('../lib/middleware');
const { getStatus, getQR } = require('../lib/whatsapp');

async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (getStatus()) {
    return res.json({ connected: true });
  }

  const qr = await getQR();
  if (qr) {
    return res.json({ connected: false, qr });
  }

  res.json({
    connected: false,
    qr: null,
    message: 'QR Code not ready yet. Please try again.',
  });
}

module.exports = withCors(handler);
