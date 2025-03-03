import Fastify from 'fastify';
import cors from '@fastify/cors';
import HelloRouter from './routes/hello';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import fastifyStatic from '@fastify/static';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const { PORT } = process.env;

const server = Fastify({
  logger: {
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true
      }
    }
  },
});

server.register(cors, {
  origin: /(127.0.0.1|localhost)/,
  methods: 'GET,PUT,POST,DELETE,OPTIONS',
  credentials: true,
});

await server.register(swagger);

await server.register(swaggerUi, {
  routePrefix: '/docs',
});

server.register(fastifyStatic, {
  root: path.join(__dirname, '..', 'public'),
  prefix: '/public',
});

server.get('/',  (req, res) => {
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

await server.ready();
server.swagger();