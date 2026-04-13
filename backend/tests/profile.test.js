const request = require('supertest');
const mongoose = require('mongoose');

let app;
let token;
let userId;

beforeAll(async () => {
  await mongoose.connect(
    process.env.MONGO_URI || 'mongodb://localhost:27017/skillmap-test'
  );
  app = require('../server');

  const res = await request(app).post('/api/auth/register').send({
    name: 'Profile User',
    email: 'profile@example.com',
    password: 'password123'
  });
  token = res.body.token;
  userId = res.body.data._id;
}, 30000);

afterAll(async () => {
  await mongoose.connection.dropDatabase();
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