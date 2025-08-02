import request from 'supertest';
import { createTestApp } from '../test-utils';

describe('/api/credits', () => {
  let app;
  let authToken;

  beforeAll(async () => {
    app = await createTestApp();
    // Register and login a test user
    await request(app).post('/api/auth/register').send({
      email: 'credituser@example.com',
      password: 'TestPassword123!',
      firstName: 'Credit',
      lastName: 'User',
    });
    const loginRes = await request(app).post('/api/auth/login').send({
      email: 'credituser@example.com',
      password: 'TestPassword123!',
    });
    authToken = loginRes.body.accessToken;
  });

  afterAll(async () => {
    await app.close();
  });

  it('should return credits for authenticated user', async () => {
    const res = await request(app)
      .get('/api/credits')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);
    expect(res.body).toHaveProperty('credits');
    expect(typeof res.body.credits).toBe('number');
  });

  it('should block unauthenticated user', async () => {
    await request(app).get('/api/credits').expect(401);
  });

  it('should redeem a code and add credits', async () => {
    const res = await request(app)
      .post('/api/credits')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ code: 'SOME-CODE' })
      .expect(200);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body).toHaveProperty('creditsAdded');
  });
}); 
