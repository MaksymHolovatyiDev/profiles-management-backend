const { admin, user, req, adminProfileId } = require('./utils');

const data = {
  name: 'Post',
  gender: 'male',
  birthdate: 11245124,
  city: 'Lviv',
};

let profileId: any;
let profileId2: any;

describe('GET /Profiles/:id', () => {
  it('Should return invalid id Error!.', async () => {
    const res = await req
      .get(`/api/Profiles/123`)
      .set({ authorization: user.token });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('message', 'Invalid id!');
    expect(res.body).toHaveProperty('name', 'BadRequestError');
  });

  it('Should return access Error!', async () => {
    const res = await req
      .get(`/api/Profiles/${admin.id}`)
      .set({ authorization: user.token });

    expect(res.statusCode).toBe(403);
    expect(res.body).toHaveProperty('message', 'Access denied!');
    expect(res.body).toHaveProperty('name', 'ForbiddenError');
  });

  it('Should return user profiles.', async () => {
    const res = await req
      .get(`/api/Profiles/${user.id}`)
      .set({ authorization: admin.token });

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toEqual(true);
  });

  it('Should return all user profiles.', async () => {
    const res = await req
      .get(`/api/Profiles/${user.id}`)
      .set({ authorization: user.token });

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toEqual(true);
  });
});

describe('POST /Profiles', () => {
  it('Should return invalid id Error!.', async () => {
    const res = await req
      .post('/api/Profiles')
      .set({ authorization: user.token })
      .send({ userId: '123', data });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('message', 'Invalid id!');
    expect(res.body).toHaveProperty('name', 'BadRequestError');
  });

  it('Should return access Error!', async () => {
    const res = await req
      .post('/api/Profiles')
      .set({ authorization: user.token })
      .send({ userId: admin.id, data });

    expect(res.statusCode).toBe(403);
    expect(res.body).toHaveProperty('message', 'Access denied!');
    expect(res.body).toHaveProperty('name', 'ForbiddenError');
  });

  it('Admin .Should return user profile data.', async () => {
    const res = await req
      .post('/api/Profiles')
      .set({ authorization: admin.token })
      .send({ userId: user.id, data });

    profileId2 = res.body._id;
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('_id');
    expect(res.body).toHaveProperty('name', data.name);
    expect(res.body).toHaveProperty('gender', data.gender);
    expect(res.body).toHaveProperty('birthdate');
    expect(res.body).toHaveProperty('city', data.city);
  });

  it('User. Should return all user profile data.', async () => {
    const res = await req
      .post('/api/Profiles')
      .set({
        authorization: user.token,
      })
      .send({ userId: user.id, data });

    profileId = res.body._id;
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('_id');
    expect(res.body).toHaveProperty('name', data.name);
    expect(res.body).toHaveProperty('gender', data.gender);
    expect(res.body).toHaveProperty('birthdate');
    expect(res.body).toHaveProperty('city', data.city);
  });
});

describe('PATCH /Profiles/:id', () => {
  it('Should return invalid user id Error!.', async () => {
    const res = await req
      .patch(`/api/Profiles/${profileId}`)
      .set({ authorization: user.token })
      .send({ userId: '123', data });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('message', 'Invalid id!');
    expect(res.body).toHaveProperty('name', 'BadRequestError');
  });

  it('Should return invalid profile id Error!.', async () => {
    const res = await req
      .patch('/api/Profiles/123')
      .set({ authorization: user.token })
      .send({ userId: user.id, data });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('message', 'Invalid id!');
    expect(res.body).toHaveProperty('name', 'BadRequestError');
  });

  it('Should return access Error!', async () => {
    const res = await req
      .patch(`/api/Profiles/${profileId}`)
      .set({ authorization: user.token })
      .send({ userId: admin.id, data });

    expect(res.statusCode).toBe(403);
    expect(res.body).toHaveProperty('message', 'Access denied!');
    expect(res.body).toHaveProperty('name', 'ForbiddenError');
  });

  it('Should incorrect user Error!', async () => {
    const res = await req
      .patch(`/api/Profiles/${adminProfileId}`)
      .set({ authorization: user.token })
      .send({ userId: user.id, data });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('message', 'Incorrect user!');
    expect(res.body).toHaveProperty('name', 'BadRequestError');
  });

  it('Admin. Should return user profile data.', async () => {
    const res = await req
      .patch(`/api/Profiles/${profileId}`)
      .set({ authorization: admin.token })
      .send({ userId: user.id, data: { ...data, name: 'eqwtqwet' } });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('_id');
    expect(res.body).toHaveProperty('name', 'eqwtqwet');
    expect(res.body).toHaveProperty('gender', data.gender);
    expect(res.body).toHaveProperty('birthdate');
    expect(res.body).toHaveProperty('city', data.city);
  });

  it('User. Should return all user profile data.', async () => {
    const res = await req
      .patch(`/api/Profiles/${profileId}`)
      .set({ authorization: user.token })
      .send({ userId: user.id, data: { ...data, name: 'werwqr' } });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('_id');
    expect(res.body).toHaveProperty('name', 'werwqr');
    expect(res.body).toHaveProperty('gender', data.gender);
    expect(res.body).toHaveProperty('birthdate');
    expect(res.body).toHaveProperty('city', data.city);
  });
});

describe('DELETE /Profiles/:id', () => {
  it('Should return invalid user id Error!.', async () => {
    const res = await req
      .delete('/api/Profiles/123')
      .set({ authorization: user.token });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('message', 'Invalid id!');
    expect(res.body).toHaveProperty('name', 'BadRequestError');
  });

  it('Should return incorrect profile id Error!.', async () => {
    const res = await req
      .delete(`/api/Profiles/${user.id}`)
      .set({ authorization: user.token });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('message', 'Incorrect profile id!');
    expect(res.body).toHaveProperty('name', 'BadRequestError');
  });

  it('Should return access Error!', async () => {
    const res = await req
      .delete(`/api/Profiles/${adminProfileId}`)
      .set({ authorization: user.token });

    expect(res.statusCode).toBe(403);
    expect(res.body).toHaveProperty('message', 'Access denied!');
    expect(res.body).toHaveProperty('name', 'ForbiddenError');
  });

  it('Admin. Should return user profile id.', async () => {
    const res = await req
      .delete(`/api/Profiles/${profileId}`)
      .set({ authorization: admin.token });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('_id', profileId);
  });
  
  it('User. Should return user profile id.', async () => {
    const res = await req
      .delete(`/api/Profiles/${profileId2}`)
      .set({ authorization: user.token });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('_id', profileId2);
  });
});
export {};
