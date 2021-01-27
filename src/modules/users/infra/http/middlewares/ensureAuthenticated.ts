import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';

import AppError from '@shared/errors/AppError';
import authConfig from '@config/auth';

interface ITokenPayload {
  iat: number;
  exp: number;
  sub: string;
}

export default function ensureAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction,
): void {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    throw new AppError('JWT token is missing', 401);
  }

  try {
    const [, token] = authHeader.split(' ');

    const decodedToken = verify(token, authConfig.jwt.secret) as ITokenPayload;

    request.user = { id: decodedToken.sub };

    return next();
  } catch {
    throw new AppError('Invalid JWT token', 401);
  }
}
