import { Request, Response, NextFunction } from 'express';

import { RateLimiterRedis } from 'rate-limiter-flexible';
import Redis from 'ioredis';

import AppError from '@shared/errors/AppError';

const client = new Redis({
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
  password: process.env.REDIS_PASSWORD,
});

const limiter = new RateLimiterRedis({
  storeClient: client,
  keyPrefix: '',
  points: 5,
  duration: 1,
});

export default async function rateLimiter(
  request: Request,
  _: Response,
  next: NextFunction,
): Promise<void> {
  try {
    await limiter.consume(request.ip);

    return next();
  } catch {
    throw new AppError('Too many requests', 429);
  }
}
