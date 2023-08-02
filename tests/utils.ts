require('dotenv').config();
const mongoose = require('mongoose');
const request = require('supertest');

const { Tcp } = require('../src/infra/Tcp');

const TCP = new Tcp();

const server = TCP.getServer();

const req = request(server);

beforeEach(async () => {
  await mongoose.connect(process.env.DB_TEST);
});

afterEach(async () => {
  await mongoose.connection.close();
});

const admin = {
  id: '64ca021178dd27931296d6d8',
  token:
    'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0Y2EwMjExNzhkZDI3OTMxMjk2ZDZkOCIsImlhdCI6MTY5MDk2MDQ0N30.f2LAn3IovjJoPS6JCxqHG2qxXBTXMvad2Q06Yrn50t4',
};

const user = {
  id: '64ca0293367504abc5e01fdc',
  token:
    'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0Y2EwMjkzMzY3NTA0YWJjNWUwMWZkYyIsImlhdCI6MTY5MDk2MDUzM30.nRya3xl_l7mizwrs9MQZ0Fa0O4r6cCQDuBLkzrF4HTo',
};

const adminProfileId = '64ca182baec8e45086aefe86';

const changeName = 'Name';

module.exports = {
  admin,
  user,
  req,
  changeName,
  adminProfileId,
};
export {};
