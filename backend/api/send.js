const { withCors } = require('../lib/middleware');
const { getStatus, sendMessage } = require('../lib/whatsapp');

async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!getStatus()) {
    return res.status(503).json({ success: false, error: 'WhatsApp is not connected.' });
  }

  const { name, phone } = req.body;

  if (!name || !phone) {
    return res.status(400).json({ success: false, error: 'Name and phone number are required.' });
  }

  const messageTemplate = `Hello ${name}, this is a message from our system.`;

  try {
    await sendMessage(phone, messageTemplate);
    res.json({ success: true, message: 'Message sent successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Failed to send message.' });
  }
}

module.exports = withCors(handler);
