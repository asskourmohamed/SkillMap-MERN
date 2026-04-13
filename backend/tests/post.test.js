const request = require('supertest');
const mongoose = require('mongoose');

process.env.JWT_SECRET = process.env.JWT_SECRET || 'test_secret_for_ci';
process.env.MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/skillmap-test';

const app = require('../server');

let token;

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
    name: 'Post User',
    email: 'post@example.com',
    password: 'password123'
  });

  if (!res.body.token) {
    throw new Error(`Register failed in post.test.js: ${JSON.stringify(res.body)}`);
  }

  token = res.body.token;
}, 30000);

afterAll(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
  await mongoose.disconnect();
});

afterEach(async () => {
  // Only clear posts between tests, keep the user
  if (mongoose.connection.collections['posts']) {
    await mongoose.connection.collections['posts'].deleteMany({});
  }
});

describe('POST /api/posts', () => {
  it('should create a post when authenticated', async () => {
    const res = await request(app)
      .post('/api/posts')
      .set('Authorization', `Bearer ${token}`)
      .send({ content: 'Hello world from test' });
    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('_id');
  });

  it('should reject unauthenticated post creation', async () => {
    const res = await request(app)
      .post('/api/posts')
      .send({ content: 'No auth' });
    expect(res.statusCode).toBe(401);
  });
});

describe('GET /api/posts/feed', () => {
  it('should return feed posts', async () => {
    const res = await request(app)
      .get('/api/posts/feed')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('should return 401 without token', async () => {
    const res = await request(app).get('/api/posts/feed');
    expect(res.statusCode).toBe(401);
  });
});