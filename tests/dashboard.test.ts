const { admin, user, req } = require('./utils');

describe('GET /Dashboard', () => {
  it('Not admin. Should return Forbidden Error!', async () => {
    const res = await req
      .get('/api/Dashboard')
      .set({ authorization: user.token });

    expect(res.statusCode).toBe(403);
    expect(res.res).toHaveProperty('statusMessage', 'Forbidden');
  });

  it('Should return dashboard data.', async () => {
    const res = await req
      .get('/api/Dashboard')
      .set({ authorization: admin.token });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('users');
    expect(res.body).toHaveProperty('profiles');
    expect(res.body).toHaveProperty('adult');
  });
});

export {};
