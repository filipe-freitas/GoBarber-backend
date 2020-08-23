/* eslint-disable @typescript-eslint/no-unused-vars */
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import 'express-async-errors';
import routes from './routes/routes';
import uploadConfig from './config/upload';
import AppError from './errors/AppError';
import './database';
import 'reflect-metadata';

const server = express();

server.use(cors());
server.use(express.json());
server.use('/files', express.static(uploadConfig.directory));
server.use(routes);
server.use(
  (error: Error, request: Request, response: Response, _: NextFunction) => {
    if (error instanceof AppError) {
      response.status(error.statusCode).json({
        status: 'Error',
        message: error.message,
      });
    }

    response.status(500).json({
      status: 'Error',
      message: 'Internal server error',
    });
  },
);

server.listen(3333, () => {
  console.log('🤖 bring yourself back online');
});
