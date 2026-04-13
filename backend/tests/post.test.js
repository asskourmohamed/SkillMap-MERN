const request = require('supertest');
const mongoose = require('mongoose');

let app;
let token;

beforeAll(async () => {
  await mongoose.connect(
    process.env.MONGO_URI || 'mongodb://localhost:27017/skillmap-test'
  );
  app = require('../server');

  const res = await request(app).post('/api/auth/register').send({
    name: 'Post User',
    email: 'post@example.com',
    password: 'password123'
  });
  token = res.body.token;
}, 30000);

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.disconnect();
});

afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
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