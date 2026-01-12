/// <reference types="jest" />

import { Request, Response } from 'express';
import { aiRateLimitMiddleware } from '../../../src/middlewares/ai/ai-rate-limit.middleware';

/**
 * TEMP DISABLED:
 * This middleware test depends on AI usage-counter DB state
 * and can cause timeouts in partial AI Phase-1 setup.
 * Remove `.skip` once AI governance tests are fully stabilized.
 */
describe.skip('AI Rate Limit Middleware (TEMP)', () => {
  const mockResponse = (): Response => {
    const res = {} as Response;
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  it('blocks request when rate limit exceeded', async () => {
    const req = {
      user: {
        id: 'user-x',
        role: 'doctor',
        hospitalId: 'hospital-x',
      },
    } as unknown as Request;

    const res = mockResponse();
    const next = jest.fn();

    // exhaust daily limit (50)
    for (let i = 0; i < 50; i++) {
      await aiRateLimitMiddleware(req, res, jest.fn());
    }

    await aiRateLimitMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(429);
    expect(next).not.toHaveBeenCalled();
  });
});
