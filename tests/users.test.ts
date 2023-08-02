const { admin, user, req, changeName, adminProfileId } = require('./utils');

let createdUser: any;

describe('Users init', () => {
  it('User registered.', async () => {
    const res = await req.post('/api/auth/SignUp').send({
      name: 'Max',
      email: 'deleteUser@user',
      password: 'qweqwe',
      remember: false,
      admin: false,
    });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('_id');
    expect(res.body).toHaveProperty('admin');
    expect(res.body).toHaveProperty('name');
    expect(res.body).toHaveProperty('token');
    createdUser = { ...res.body };
  });
});

describe('GET /Users', () => {
  it('Not admin. Should return Forbidden Error!', async () => {
    const res = await req.get('/api/Users').set({ authorization: user.token });

    expect(res.statusCode).toBe(403);
    expect(res.res).toHaveProperty('statusMessage', 'Forbidden');
  });

  it('Should return all users.', async () => {
    const res = await req.get('/api/Users').set({ authorization: admin.token });

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toEqual(true);
    expect(res.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          _id: expect.anything(),
          name: expect.anything(),
          email: expect.anything(),
          profiles: expect.anything(),
        }),
      ])
    );
  });
});

describe('GET /User/:id', () => {
  it('Not admin. Should return Forbidden Error!', async () => {
    const res = await req
      .get(`/api/Users/${user.id}`)
      .set({ authorization: user.token });

    expect(res.statusCode).toBe(403);
    expect(res.res).toHaveProperty('statusMessage', 'Forbidden');
  });

  it('Should return invalid id Error!', async () => {
    const res = await req
      .get('/api/Users/123')
      .set({ authorization: admin.token });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('message', 'Invalid id!');
    expect(res.body).toHaveProperty('name', 'BadRequestError');
  });

  it('User doesn`t exists. Id Error!', async () => {
    const res = await req
      .get(`/api/Users/${adminProfileId}`)
      .set({ authorization: admin.token });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('message', 'User doesn`t exists!');
    expect(res.body).toHaveProperty('name', 'BadRequestError');
  });

  it('Should return user.', async () => {
    const res = await req
      .get(`/api/Users/${user.id}`)
      .set({ authorization: admin.token });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('_id');
    expect(res.body).toHaveProperty('name');
    expect(res.body).toHaveProperty('email');
    expect(res.body).toHaveProperty('admin');
  });
});

describe('PATCH /User/:id', () => {
  it('Not admin. Should return Forbidden Error!', async () => {
    const res = await req
      .patch(`/api/Users/${createdUser._id}`)
      .set({ authorization: user.token })
      .send({
        name: changeName,
        email: createdUser.email,
        admin: createdUser.admin,
      });

    expect(res.statusCode).toBe(403);
    expect(res.res).toHaveProperty('statusMessage', 'Forbidden');
  });

  it('Should return invalid id Error!', async () => {
    const res = await req
      .patch('/api/Users/123')
      .set({ authorization: admin.token })
      .send({
        name: changeName,
        email: createdUser.email,
        admin: createdUser.admin,
      });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('message', 'Invalid id!');
    expect(res.body).toHaveProperty('name', 'BadRequestError');
  });

  it('Email already exists Error!.', async () => {
    const res = await req
      .patch(`/api/Users/${createdUser._id}`)
      .set({ authorization: admin.token })
      .send({
        name: changeName,
        email: 'test@admin',
        admin: createdUser.admin,
      });

    expect(res.statusCode).toBe(409);
    expect(res.body).toHaveProperty('message', 'Email already exists!');
    expect(res.body).toHaveProperty('name', 'HttpError');
  });

  it('User doesn`t exists. Id Error!', async () => {
    const res = await req
      .patch(`/api/Users/${adminProfileId}`)
      .set({ authorization: admin.token })
      .send({
        name: changeName,
        email: createdUser.email,
        admin: createdUser.admin,
      });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('message', 'User doesn`t exists!');
    expect(res.body).toHaveProperty('name', 'BadRequestError');
  });

  it('Should return updated user.', async () => {
    const res = await req
      .patch(`/api/Users/${createdUser._id}`)
      .set({ authorization: admin.token })
      .send({
        name: changeName,
        email: createdUser.email,
        admin: createdUser.admin,
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('_id');
    expect(res.body).toHaveProperty('name');
    expect(res.body).toHaveProperty('email');
    expect(res.body).toHaveProperty('admin');
  });
});

describe('DELETE /User/:id', () => {
  it('Not admin. Should return Forbidden Error!', async () => {
    const res = await req
      .delete(`/api/Users/${createdUser._id}`)
      .set({ authorization: user.token });

    expect(res.statusCode).toBe(403);
    expect(res.res).toHaveProperty('statusMessage', 'Forbidden');
  });

  it('Should return invalid id Error!', async () => {
    const res = await req
      .delete('/api/Users/123')
      .set({ authorization: admin.token });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('message', 'Invalid id!');
    expect(res.body).toHaveProperty('name', 'BadRequestError');
  });

  it('User doesn`t exists. Id Error!', async () => {
    const res = await req
      .delete(`/api/Users/${adminProfileId}`)
      .set({ authorization: admin.token });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('message', 'User doesn`t exists!');
    expect(res.body).toHaveProperty('name', 'BadRequestError');
  });

  it('Should return user.', async () => {
    const res = await req
      .delete(`/api/Users/${createdUser._id}`)
      .set({ authorization: admin.token });

    expect(res.statusCode).toBe(204);
    expect(res.body).toEqual({});
  });
});
