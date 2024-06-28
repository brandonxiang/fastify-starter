import Fastify from 'fastify';
import cors from '@fastify/cors';
import HelloRouter from './routes/hello';

const { PORT } = process.env;

const server = Fastify({
  logger: true,
});

server.register(cors, {
  origin: /(127.0.0.1|localhost)/,
  methods: 'GET,PUT,POST,DELETE,OPTIONS',
  credentials: true,
});

server.get('/', (req, res) => {
  res.status(200).send('welcome to fastify-starter');
});

server.register(HelloRouter, { prefix: '/hello' });

const port = PORT ? +PORT : 31303;
console.log('process.env.PORT', PORT, port);

server.listen({host: '0.0.0.0', port}, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(0);
  }

  server.log.info(`Server listening at ${address}`);
});
