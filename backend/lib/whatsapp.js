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
    });

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('connection.update', (update) => {
      const { connection, lastDisconnect, qr } = update;

      if (qr) {
        console.log('QR RECEIVED - Scan with your phone.');
        currentQR = qr;
      }

      if (connection === 'close') {
        isConnected = false;
        currentQR = '';
        reconnecting = false;

        const statusCode =
          lastDisconnect?.error?.output?.statusCode;
        const shouldReconnect =
          statusCode !== DisconnectReason.loggedOut;

        console.log(
          'Connection closed. Status:',
          statusCode,
          'Reconnecting:',
          shouldReconnect
        );

        if (shouldReconnect) {
          setTimeout(() => initializeWhatsApp(), 3000);
        }
      } else if (connection === 'open') {
        console.log('Client is ready!');
        currentQR = '';
        isConnected = true;
        reconnecting = false;
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
