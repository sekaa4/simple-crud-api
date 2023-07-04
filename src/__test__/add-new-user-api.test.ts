import 'dotenv/config';
import request from 'supertest';
import { DataObject } from 'src/types/data-object.type';

const baseUrl = `http://localhost:${process.env.PORT || 4000}`;

describe('Checking the correctness of the work with API when adding a new User', () => {
  const mockUser = {
    username: 'alex',
    age: 12,
    hobbies: ['sport', 'music'],
  };

  let responseUser: DataObject = {} as DataObject;
  let id: string = '';

  it('should return a 200 status code', async () => {
    const response = await request(baseUrl).get('/api/users');

    expect(response.statusCode).toEqual(200);
    expect(response.type).toEqual('application/json');
    expect(response.body).toEqual([]);
  });

  it('should add user', async () => {
    const response = await request(baseUrl).post('/api/users').send(mockUser);

    expect(response.statusCode).toBe(201);
    expect(response.body).toEqual({ ...mockUser, id: expect.any(String) });
    id = response.body.id;
  });

  it('should get user by ID', async () => {
    const response = await request(baseUrl).get(`/api/users/${id}`);
    expect(response.body).toEqual({ ...mockUser, id });
    responseUser = response.body;
  });

  it('should update user by ID', async () => {
    const updatedUser = {
      hobbies: ['sport'],
      username: 'alex2',
      age: 13,
    };
    const response = await request(baseUrl).put(`/api/users/${responseUser.id}`).send(updatedUser);

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ ...updatedUser, id: responseUser.id });
  });

  it('should delete user by ID', async () => {
    const response = await request(baseUrl).delete(`/api/users/${responseUser.id}`);

    expect(response.statusCode).toBe(204);
    expect(response.body).toEqual('');
  });

  it("shouldn't get user by ID after delete request", async () => {
    const response = await request(baseUrl).get(`/api/users/${responseUser.id}`);

    expect(response.statusCode).toBe(404);
  });
});
