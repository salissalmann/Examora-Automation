const request = require('supertest');
const express = require('express');
const { getStatus, getQR, sendMessage } = require('../lib/whatsapp');

// Mock whatsapp library functions
jest.mock('../lib/whatsapp', () => ({
    getStatus: jest.fn(),
    getQR: jest.fn(),
    sendMessage: jest.fn()
}));

// Provide mock for the withCors middleware, as we don't need actual CORS for unit testing
jest.mock('../lib/middleware', () => ({
    withCors: (handler) => async (req, res) => {
        // In Express testing via supertest, we just call the handler directly
        await handler(req, res);
    }
}));

// Create a standalone express app suitable for testing API handlers routes
const app = express();
app.use(express.json()); // Essential for parsing POST JSON bodies

// Register the handlers directly for testing
app.all('/api/qr', require('../api/qr'));
app.all('/api/status', require('../api/status'));
app.all('/api/send', require('../api/send'));

describe('WhatsApp Backend API', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('GET /api/status', () => {
        it('should return connected: true when WhatsApp is connected', async () => {
            getStatus.mockReturnValue(true);

            const response = await request(app).get('/api/status');
            expect(response.status).toBe(200);
            expect(response.body).toEqual({ connected: true });
        });

        it('should return connected: false when WhatsApp is NOT connected', async () => {
            getStatus.mockReturnValue(false);

            const response = await request(app).get('/api/status');
            expect(response.status).toBe(200);
            expect(response.body).toEqual({ connected: false });
        });

        it('should disallow non-GET methods', async () => {
            const response = await request(app).post('/api/status');
            expect(response.status).toBe(405);
            expect(response.body).toEqual({ error: 'Method not allowed' });
        });
    });

    describe('GET /api/qr', () => {
        it('should return connected: true if WhatsApp is already connected', async () => {
            getStatus.mockReturnValue(true);

            const response = await request(app).get('/api/qr');
            expect(response.status).toBe(200);
            expect(response.body).toEqual({ connected: true });
        });

        it('should return the QR code if available and NOT connected', async () => {
            getStatus.mockReturnValue(false);
            const mockQrData = 'qr-data-string';
            getQR.mockResolvedValue(mockQrData);

            const response = await request(app).get('/api/qr');
            expect(response.status).toBe(200);
            expect(response.body).toEqual({ connected: false, qr: mockQrData });
        });

        it('should return a generic message if QR code is not ready', async () => {
            getStatus.mockReturnValue(false);
            getQR.mockResolvedValue(null);

            const response = await request(app).get('/api/qr');
            expect(response.status).toBe(200);
            expect(response.body).toEqual({
                connected: false,
                qr: null,
                message: 'QR Code not ready yet. Please try again.'
            });
        });
    });

    describe('POST /api/send', () => {
        it('should fail with 405 for non-POST requests', async () => {
            const response = await request(app).get('/api/send');
            expect(response.status).toBe(405);
            expect(response.body).toEqual({ error: 'Method not allowed' });
        });

        it('should fail with 503 if WhatsApp is not connected', async () => {
            getStatus.mockReturnValue(false);

            const response = await request(app)
                .post('/api/send')
                .send({ name: 'John Doe', phone: '1234567890' });

            expect(response.status).toBe(503);
            expect(response.body).toEqual({ success: false, error: 'WhatsApp is not connected.' });
        });

        it('should fail with 400 if name or phone is missing', async () => {
            getStatus.mockReturnValue(true);

            // Missing phone
            const res1 = await request(app)
                .post('/api/send')
                .send({ name: 'John Doe' });
            expect(res1.status).toBe(400);

            // Missing name
            const res2 = await request(app)
                .post('/api/send')
                .send({ phone: '1234567890' });
            expect(res2.status).toBe(400);
        });

        it('should succeed and send message when connected & input is valid', async () => {
            getStatus.mockReturnValue(true);
            sendMessage.mockResolvedValue(true);

            const response = await request(app)
                .post('/api/send')
                .send({ name: 'Jane', phone: '0987654321' });

            expect(response.status).toBe(200);
            expect(response.body).toEqual({ success: true, message: 'Message sent successfully!' });
            expect(sendMessage).toHaveBeenCalledWith('0987654321', 'Hello Jane, this is a message from our system.');
        });

        it('should fail with 500 when sendMessage throws an error', async () => {
            getStatus.mockReturnValue(true);
            sendMessage.mockRejectedValue(new Error('Network error'));

            const response = await request(app)
                .post('/api/send')
                .send({ name: 'Jane', phone: '0987654321' });

            expect(response.status).toBe(500);
            expect(response.body).toEqual({ success: false, error: 'Failed to send message.' });
        });
    });

});
