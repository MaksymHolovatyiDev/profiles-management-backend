const { req } = require('./utils');

describe('Middleware Test', () => {
  it('Missing token Error!', async () => {
    const res = await req.get('/api/Dashboard').set({ authorization: '' });

    expect(res.statusCode).toBe(401);
    expect(res.res).toHaveProperty('statusMessage', 'Unauthorized');
  });
});

export {};
