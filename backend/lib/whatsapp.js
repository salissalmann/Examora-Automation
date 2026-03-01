const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode');

let client;
let currentQR = '';
let isConnected = false;

const initializeWhatsApp = () => {
  console.log('Initializing WhatsApp Client...');

  const cacheDir = process.env.PUPPETEER_CACHE_DIR || 'default';
  console.log(`Puppeteer Cache Dir: ${cacheDir}`);

  client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      handleSIGINT: false,
      executablePath: process.env.CHROME_PATH || undefined,
    },
  });


  client.on('qr', (qr) => {
    console.log('QR RECEIVED - Scan with your phone.');
    currentQR = qr;
  });

  client.on('ready', () => {
    console.log('Client is ready!');
    currentQR = '';
    isConnected = true;
  });

  client.on('authenticated', () => {
    console.log('AUTHENTICATED SUCCESSFULLY');
  });

  client.on('auth_failure', (msg) => {
    console.error('AUTHENTICATION FAILURE', msg);
    isConnected = false;
    currentQR = '';
  });

  client.on('disconnected', (reason) => {
    console.log('Client was logged out', reason);
    isConnected = false;
    currentQR = '';
    client
      .destroy()
      .then(() => client.initialize())
      .catch(() => client.initialize());
  });

  client.initialize();
};

const getQR = async () => {
  if (isConnected || !currentQR) return null;
  return currentQR;
};

const getStatus = () => isConnected;

const sendMessage = async (phone, text) => {
  if (!isConnected) throw new Error('WhatsApp is not connected.');
  const formattedPhone = phone.replace(/\D/g, '');
  const chatId = `${formattedPhone}@c.us`;
  try {
    return await client.sendMessage(chatId, text);
  } catch (error) {
    console.error('Failed to send message', error);
    throw error;
  }
};

module.exports = { initializeWhatsApp, getQR, getStatus, sendMessage };
