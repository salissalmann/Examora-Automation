# WhatsApp QR Connection System

A full-stack project utilizing a Node.js backend and a modern vanilla JS/Tailwind frontend to seamlessly connect a WhatsApp session via a QR code and send automated templated messages programmatically.

## Project Structure

```
/whatsapp-qr
├── backend/
│   ├── .env                 # (Auto-generated from .env.example) Environment variables
│   ├── index.js             # Express API Server
│   ├── package.json         # Node.js dependencies
│   └── whatsapp.js          # Core whatsapp-web.js logic and integration
├── frontend/
│   ├── index.html           # User Interface
│   └── app.js               # Logic for UI, QR fetching, messaging
└── README.md                # Documentation
```

## Features
- **QR Code Scanning**: Dynamically generate and serve a QR code via an API for WhatsApp login.
- **Session Persistence**: Sessions are saved locally out of the box so that subsequent server restarts don't require scanning the QR code again.
- **Templating**: Ability to send automated messages customized by recipients' names.
- **Rate-Limiting**: Ensures no spamming of the API endpoints to combat IP bans.
- **Beautiful UI**: Simple yet responsive design structured nicely with Tailwind CSS micro-animations and loading states.

## Prerequisites
- Node.js (v18+ recommended)
- A smartphone with WhatsApp Application installed

## Step-by-Step Installation

### 1. Setup Backend
Navigate to the `backend` directory and install the Node.js packages:
```bash
cd backend
npm install
```

Create an environment file:
```bash
cp .env.example .env
```
*(Optionally change the PORT in `.env`, default is 3000)*

### 2. Setup Frontend
The frontend requires no build steps. You can serve it using any HTTP server:
```bash
npx serve frontend
```

Alternatively, you could load the `index.html` file straight from the system, but it is always recommended to use an HTTP server to avoid CORS issues if you decouple them across different networks.

## How to Run

1. Start the backend:
```bash
cd backend
node index.js
```
The server will now listen on port 3000 (e.g., `http://localhost:3000`).

2. Start the frontend:
Open `index.html` in your web browser. Or start an HTTP server as shown above and navigate to the local link.

## How to Scan WhatsApp QR
1. Open the frontend URL in your browser.
2. The UI will show a checking connection label and eventually present a QR code.
3. Open WhatsApp on your mobile phone:
   - For Android: Tap **More options (three dots)** > **Linked Devices**.
   - For iOS: Go to WhatsApp **Settings** > **Linked Devices**.
4. Tap **Link a Device** and scan the QR code displayed on the webpage.
5. The webpage will automatically update to reveal the **Send Message** view! 

## Deployment Guide (VPS)

1. Connect to your VPS via SSH.
2. Clone this project repository to the VPS.
3. Install Node.js on the VPS if you haven't already.
4. Go to `backend/` and run `npm install`.
5. Install PM2 globally to keep the server running:
```bash
npm install -g pm2
```
6. Start the backend using PM2 to keep it alive:
```bash
pm2 start index.js --name "whatsapp-api"
```
7. Configure `Nginx` (or Apache) as a reverse proxy for your backend, ensuring it forwards port 80/443 traffic to port 3000 locally.
8. Similarly, serve the `frontend/` static HTML/JS files directly from an Nginx server block. Remember to modify `API_URL` inside `frontend/app.js` to point to the actual backend production domain.

## Suggested Upgrades for the Future
- **Bulk Messaging (CSV)**: Implement a file upload system to parse CSVs via `csv-parser` and loop over rows to send customized messages.
- **Scheduling**: Integrate `node-cron` to delay or schedule messages to be sent at appropriate times.
- **Database**: Store session data in PostgreSQL/MongoDB (utilize `RemoteAuth` plugin instead of `LocalAuth` to avoid local filesystem session data issues when deploying) and store message history templates.
- **Login System**: Secure the frontend application with simple JWT auth to ensure only admins can trigger these messages.
- **Multiple WhatsApp Accounts**: Scale up to tracking sessions actively inside a Redis/DB to proxy multiple phone connections for multiple users natively. 
