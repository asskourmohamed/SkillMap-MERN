const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let app;
let mongoServer;
let token;
let userId;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.disconnect();
  await mongoose.connect(mongoServer.getUri());
  app = require('../server');

  const res = await request(app).post('/api/auth/register').send({
    name: 'Profile User',
    email: 'profile@example.com',
    password: 'password123'
  });
  token = res.body.token;
  userId = res.body.data._id;   // ← correct: { success, token, data: { _id, ... } }
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('GET /api/profiles', () => {
  it('should return all profiles for authenticated user', async () => {
    const res = await request(app)
      .get('/api/profiles')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('should return 401 without token', async () => {
    const res = await request(app).get('/api/profiles');
    expect(res.statusCode).toBe(401);
  });
});

describe('GET /api/profiles/:id', () => {
  it('should return a profile by ID', async () => {
    const res = await request(app)
      .get(`/api/profiles/${userId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('_id');
  });

  it('should return 404 for non-existent profile', async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app)
      .get(`/api/profiles/${fakeId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(404);
  });
});