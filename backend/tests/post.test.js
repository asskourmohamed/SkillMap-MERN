const request = require('supertest');
const mongoose = require('mongoose');

process.env.JWT_SECRET = process.env.JWT_SECRET || 'test_secret_for_ci';
process.env.MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/skillmap-test';

const app = require('../server');

let token;

// Helper: register + login to get a fresh token
async function getAuthToken() {
  // Try registering (may already exist if cleanup didn't run)
  await request(app).post('/api/auth/register').send({
    name: 'Post User',
    email: 'post@example.com',
    password: 'password123'
  });

  // Always login to get a fresh token
  const login = await request(app).post('/api/auth/login').send({
    email: 'post@example.com',
    password: 'password123'
  });

  if (!login.body.token) {
    throw new Error(`Login failed in post.test.js: ${JSON.stringify(login.body)}`);
  }

  return login.body.token;
}

beforeAll(async () => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGO_URI);
  }
  await new Promise((resolve) => {
    if (mongoose.connection.readyState === 1) return resolve();
    mongoose.connection.once('connected', resolve);
  });
}, 30000);

beforeEach(async () => {
  // Clean all collections before each test
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
  // Always get a fresh token after cleanup
  token = await getAuthToken();
});

afterAll(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
  await mongoose.disconnect();
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