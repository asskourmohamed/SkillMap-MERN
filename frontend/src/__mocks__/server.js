const { setupServer } = require('msw/node');
const { rest } = require('msw');

const server = setupServer(
  rest.post('http://localhost:5000/api/auth/login', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json({
      success: true,
      token: 'fake-jwt',
      data: { email: 'test@example.com', name: 'Test User' }
    }));
  })
);

module.exports = { server, rest };