const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
} = require('@whiskeysockets/baileys');
const pino = require('pino');

let sock;
let currentQR = '';
let isConnected = false;
let reconnecting = false;

const initializeWhatsApp = async () => {
  if (reconnecting) return;
  reconnecting = true;

  console.log('Initializing WhatsApp Client (Baileys)...');

  try {
    const { state, saveCreds } = await useMultiFileAuthState('./auth_info');

    sock = makeWASocket({
      auth: state,
      printQRInTerminal: false,
      logger: pino({ level: 'silent' }),
      browser: ['Ubuntu', 'Chrome', '20.0.04'],
    });

    sock.ev.on('creds.update', saveCreds);

    let attempt405 = 0;
    sock.ev.on('connection.update', async (update) => {
      const { connection, lastDisconnect, qr } = update;

      if (qr) {
        console.log('QR RECEIVED - Scan with your phone.');
        currentQR = qr;
      }

      if (connection === 'close') {
        isConnected = false;
        currentQR = '';
        reconnecting = false;

        const statusCode = lastDisconnect?.error?.output?.statusCode;
        const shouldReconnect = statusCode !== DisconnectReason.loggedOut;

        console.log(
          'Connection closed. Status:',
          statusCode,
          'Reconnecting:',
          shouldReconnect
        );

        if (shouldReconnect) {
          if (statusCode === 405) {
            attempt405++;
            if (attempt405 >= 3) {
              console.log('Persistent 405 error. Clearing session data...');
              const fs = require('fs');
              const path = require('path');
              const authDir = path.join(__dirname, '../auth_info');
              if (fs.existsSync(authDir)) {
                fs.rmSync(authDir, { recursive: true, force: true });
              }
              attempt405 = 0;
            }
          }
          const delay = statusCode === 405 ? 10000 : 3000;
          console.log(`Retrying connection in ${delay / 1000}s...`);
          setTimeout(() => initializeWhatsApp(), delay);
        } else if (statusCode === DisconnectReason.loggedOut) {
          console.log('Logged out. Clearing session data...');
          const fs = require('fs');
          const path = require('path');
          const authDir = path.join(__dirname, '../auth_info');
          if (fs.existsSync(authDir)) {
            fs.rmSync(authDir, { recursive: true, force: true });
          }
          setTimeout(() => initializeWhatsApp(), 3000);
        }
      } else if (connection === 'open') {
        console.log('Client is ready!');
        currentQR = '';
        isConnected = true;
        reconnecting = false;
        attempt405 = 0;
      }
    });
  } catch (error) {
    console.error('Failed to initialize WhatsApp:', error);
    reconnecting = false;
    setTimeout(() => initializeWhatsApp(), 5000);
  }
};

const getQR = async () => {
  if (isConnected || !currentQR) return null;
  return currentQR;
};

const getStatus = () => isConnected;

const sendMessage = async (phone, text) => {
  if (!isConnected || !sock) throw new Error('WhatsApp is not connected.');
  const formattedPhone = phone.replace(/\D/g, '');
  const chatId = `${formattedPhone}@s.whatsapp.net`;
  try {
    return await sock.sendMessage(chatId, { text });
  } catch (error) {
    console.error('Failed to send message', error);
    throw error;
  }
};

module.exports = { initializeWhatsApp, getQR, getStatus, sendMessage };
