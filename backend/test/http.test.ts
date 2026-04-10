import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { buildApp } from '../src/adapters/inbound/http/app.js';

describe('http api', () => {
  const app = buildApp();

  it('gets routes', async () => {
    const res = await request(app).get('/routes');
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(5);
  });

  it('returns comparison', async () => {
    const res = await request(app).get('/routes/comparison');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('creates pool', async () => {
    const res = await request(app).post('/pools').send({ year: 2025, members: [{ shipId: 'A', cbBefore: 80 }, { shipId: 'B', cbBefore: -10 }] });
    expect(res.status).toBe(200);
    expect(res.body.poolId).toBeDefined();
  });
});
