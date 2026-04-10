const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let app;
let mongoServer;
let token;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.disconnect();
  await mongoose.connect(mongoServer.getUri());
  app = require('../server');

  const res = await request(app).post('/api/auth/register').send({
    name: 'Post User',
    email: 'post@example.com',
    password: 'password123'
  });
  token = res.body.token;
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('POST /api/posts', () => {
  it('should create a post when authenticated', async () => {
    const res = await request(app)
      .post('/api/posts')
      .set('Authorization', `Bearer ${token}`)
      .send({ content: 'Hello world from test' });
    expect(res.statusCode).toBe(201);
    // Your API wraps responses: { success: true, data: { _id, ... } }
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
      .get('/api/posts/feed')               // ← was /api/posts, correct is /api/posts/feed
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