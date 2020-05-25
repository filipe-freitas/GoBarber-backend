import express from 'express';
import routes from './routes/routes';
import './database';

const server = express();

server.use(express.json());
server.use(routes);

server.listen(3333, () => {
  console.log('🤖 bring yourself back online');
});
