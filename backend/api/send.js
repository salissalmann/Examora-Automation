const { withCors } = require('../lib/middleware');
const { getStatus, sendMessage } = require('../lib/whatsapp');
const templates = require('../lib/templates');

async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!getStatus()) {
    return res.status(503).json({ success: false, error: 'WhatsApp is not connected.' });
  }

  const { phone, university } = req.body;

  if (!phone || !university) {
    return res.status(400).json({ success: false, error: 'Phone and university are required.' });
  }

  const message = templates[university.toLowerCase()] || templates.generic;

  try {
    await sendMessage(phone, message);
    res.json({ success: true, message: 'Message sent successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Failed to send message.' });
  }
}

module.exports = withCors(handler);
