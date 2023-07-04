import 'dotenv/config';
import request from 'supertest';
import { v4 as uuidv4 } from 'uuid';

const baseUrl = `http://localhost:${process.env.PORT || 4000}`;

describe('Checking the correctness status code with Error when work with incorrect body', () => {
  const tableMockUsers = [
    {
      username: 'alex',
      age: 12,
      hob: ['sport', 'music'],
    },
    {
      username: 'alex',
      age: 12,
      hobbies: ['sport', 5],
    },
    {
      username: 5,
      age: 12,
      hobbies: ['sport'],
    },
    {
      username: 'alex',
      age: '12',
      hobbies: ['sport', 5],
    },
  ];

  const incorrectBody = `{username: 'alex',
  age: 12,
  hob: ['sport', 'music']}`;

  const methods = ['POST', 'PUT', 'OPTIONS'];

  const id = uuidv4();

  it.each(tableMockUsers)(
    'should return a 400 status code, when body does not contain required fields, method POST',
    async (mockUser) => {
      const response = await request(baseUrl).post('/api/users').send(mockUser);

      expect(response.statusCode).toEqual(400);
      expect(response.type).toEqual('application/json');
      expect(response.body.message).toEqual('Bad Request, request body incorrect');
    },
  );

  it.each(methods)(
    'should return a 500 status code, when body write not JSON format, PUT&POST methods',
    async (method) => {
      switch (method) {
        case 'POST': {
          const response = await request(baseUrl).post(`/api/users/${id}`).send(incorrectBody);

          expect(response.statusCode).toBe(500);
          expect(response.body.message).toEqual(`Internal Server Error`);
          break;
        }
        case 'PUT': {
          const response = await request(baseUrl).put(`/api/users/${id}`).send(incorrectBody);

          expect(response.statusCode).toBe(500);
          expect(response.body.message).toEqual(`Internal Server Error`);
          break;
        }
        default: {
          const response = await request(baseUrl).options(`/api/users`).send();

          expect(response.statusCode).toBe(400);
          expect(response.body.message).toEqual(`Bad Request`);
          break;
        }
      }
    },
  );

  it("should return a 404 status code, when path doesn't exist", async () => {
    const response = await request(baseUrl).get('/api/users/unknown/test');

    expect(response.statusCode).toEqual(404);
    expect(response.body.message).toEqual("Request path doesn't exist");
  });
});
