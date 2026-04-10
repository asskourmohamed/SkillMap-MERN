const request = require('supertest');
const express = require('express');

const app = express();
app.get('/health', (req, res) => res.status(200).json({ status: 'ok' }));

describe('Server health', () => {
  it('should respond 200 on /health', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
  });
});