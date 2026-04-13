const request = require('supertest');
const mongoose = require('mongoose');

process.env.JWT_SECRET = process.env.JWT_SECRET || 'test_secret_for_ci';
process.env.MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/skillmap-test';

const app = require('../server');

let token;
let userId;

beforeAll(async () => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGO_URI);
  }
  await new Promise((resolve) => {
    if (mongoose.connection.readyState === 1) return resolve();
    mongoose.connection.once('connected', resolve);
  });

  // Clean up any leftover data from previous runs
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }

  const res = await request(app).post('/api/auth/register').send({
    name: 'Profile User',
    email: 'profile@example.com',
    password: 'password123'
  });

  if (!res.body.token) {
    throw new Error(`Register failed in profile.test.js: ${JSON.stringify(res.body)}`);
  }

  token = res.body.token;
  userId = res.body.data._id;
}, 30000);

afterAll(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
  await mongoose.disconnect();
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