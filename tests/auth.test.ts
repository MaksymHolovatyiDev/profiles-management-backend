const { req, admin } = require('./utils');

const userReqConfig = {
  name: 'Max',
  email: 'tst@user',
  password: 'qweqwe',
  remember: false,
  admin: false,
};

let createdUser: any;

describe('POST /auth/SignUp', () => {
  it('Error  Password too short!', async () => {
    const res = await req
      .post('/api/auth/SignUp')
      .send({ ...userReqConfig, password: 'qweqw' });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('name', 'BadRequestError');
    expect(res.body).toHaveProperty('message', 'Password too short!');
  });

  it('Should return user data.', async () => {
    const res = await req.post('/api/auth/SignUp').send(userReqConfig);

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('_id');
    expect(res.body).toHaveProperty('admin');
    expect(res.body).toHaveProperty('name');
    expect(res.body).toHaveProperty('token');
    createdUser = { ...res.body };
  });

  it('Error Email already exists!', async () => {
    const res = await req.post('/api/auth/SignUp').send(userReqConfig);

    expect(res.statusCode).toBe(409);
    expect(res.body).toHaveProperty('name', 'HttpError');
    expect(res.body).toHaveProperty('message', 'Email already exists!');
  });
});

describe('POST /auth/SignIn', () => {
  it('Should return user data.', async () => {
    const res = await req.post('/api/auth/SignIn').send({
      email: userReqConfig.email,
      password: userReqConfig.password,
      remember: userReqConfig.remember,
    });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('_id');
    expect(res.body).toHaveProperty('admin');
    expect(res.body).toHaveProperty('name');
    expect(res.body).toHaveProperty('token');
  });

  it('Error Incorrect email!', async () => {
    const res = await req.post('/api/auth/SignIn').send({
      email: 'Maxp@admin',
      password: userReqConfig.password,
      remember: userReqConfig.remember,
    });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('message', 'User doesn`t exists!');
    expect(res.body).toHaveProperty('name', 'BadRequestError');
  });

  it('Error Short password!', async () => {
    const res = await req.post('/api/auth/SignIn').send({
      email: userReqConfig.email,
      password: 'qweqw',
      remember: userReqConfig.remember,
    });

    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty('message', 'Incorrect password!');
    expect(res.body).toHaveProperty('name', 'UnauthorizedError');
  });
});

describe('Clearing...', () => {
  it('User deleted.', async () => {
    const res = await req
      .delete(`/api/Users/${createdUser._id}`)
      .set({ authorization: admin.token });

    expect(res.statusCode).toBe(204);
    expect(res.body).toEqual({});
  });
});

export {};
