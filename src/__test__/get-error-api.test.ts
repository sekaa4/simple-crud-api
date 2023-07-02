import 'dotenv/config';
import request from 'supertest';
import { v4 as uuidv4 } from 'uuid';

const baseUrl = `http://localhost:${process.env.PORT || 4000}`;

describe('Checking the correctness status code with Error when work with API', () => {
  const mockUser = {
    username: 'alex',
    age: 12,
    hobbies: ['sport', 'music'],
  };

  const id = uuidv4();

  it('should return a 400 status code, when userId is invalid (not uuid), method GET', async () => {
    const response = await request(baseUrl).get('/api/users/unknown');

    expect(response.statusCode).toEqual(400);
    expect(response.type).toEqual('application/json');
    expect(response.body.message).toEqual("User's ID is invalid (not uuid)");
  });

  it("should return a 404 status code, when userId doesn't exist, method GET", async () => {
    const response = await request(baseUrl).get(`/api/users/${id}`);

    expect(response.statusCode).toBe(404);
    expect(response.body.message).toEqual(`User with ID <${id}> doesn't exist`);
  });

  it('should return a 400 status code, when userId is invalid (not uuid), method PUT', async () => {
    const response = await request(baseUrl).put('/api/users/unknown').send(mockUser);

    expect(response.statusCode).toEqual(400);
    expect(response.body.message).toEqual("User's ID is invalid (not uuid)");
  });

  it("should return a 404 status code, when userId doesn't exist, method PUT", async () => {
    const response = await request(baseUrl).put(`/api/users/${id}`).send(mockUser);

    expect(response.statusCode).toBe(404);
    expect(response.body.message).toEqual(`User with ID <${id}> doesn't exist`);
  });

  it('should return a 400 status code, when userId is invalid (not uuid), method Delete', async () => {
    const response = await request(baseUrl).delete('/api/users/unknown');

    expect(response.statusCode).toEqual(400);
    expect(response.body.message).toEqual("User's ID is invalid (not uuid)");
  });

  it("should return a 404 status code, when userId doesn't exist, method Delete", async () => {
    const response = await request(baseUrl).delete(`/api/users/${id}`);

    expect(response.statusCode).toBe(404);
    expect(response.body.message).toEqual(`User with ID <${id}> doesn't exist`);
  });
});
