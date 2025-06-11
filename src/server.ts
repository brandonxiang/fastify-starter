import Fastify from 'fastify';
import cors from '@fastify/cors';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import fastifyStatic from '@fastify/static';
import path from 'path';

// Routes
import HelloRouter from './routes/hello.js';

const { PORT = 31303, NODE_ENV = 'development' } = process.env;

// Create Fastify instance with optimized settings
const server = Fastify({
  logger: NODE_ENV === 'development' ? {
    level: 'info',
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'HH:MM:ss Z',
        ignore: 'pid,hostname'
      }
    }
  } : {
    level: 'warn'
  },
  // Improved request handling
  requestTimeout: 30000,
  keepAliveTimeout: 5000,
  bodyLimit: 1048576, // 1MB
});

// Graceful shutdown handler
const gracefulShutdown = async (signal: string) => {
  server.log.info(`Received ${signal}, shutting down gracefully...`);
  try {
    await server.close();
    process.exit(0);
  } catch (err) {
    server.log.error('Error during shutdown:', err);
    process.exit(1);
  }
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Register plugins and routes
const buildServer = async () => {
  try {
    // CORS configuration
    await server.register(cors, {
      origin: NODE_ENV === 'production' 
        ? ['https://yourdomain.com'] // Replace with your actual domain
        : true, // Allow all origins in development
      methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS'],
      credentials: true,
    });

    // Swagger documentation
    await server.register(swagger, {
      openapi: {
        openapi: '3.0.0',
        info: {
          title: 'Fastify Starter API',
          description: 'API documentation for Fastify Starter',
          version: '1.0.0',
        },
        servers: [
          {
            url: `http://localhost:${PORT}`,
            description: 'Development server',
          },
        ],
        components: {
          securitySchemes: {
            bearerAuth: {
              type: 'http',
              scheme: 'bearer',
              bearerFormat: 'JWT',
            },
          },
        },
      },
    });

    await server.register(swaggerUi, {
      routePrefix: '/docs',
      uiConfig: {
        docExpansion: 'list',
        deepLinking: false,
      },
      staticCSP: true,
      transformStaticCSP: (header) => header,
    });

    // Static files
    await server.register(fastifyStatic, {
      root: path.join(process.cwd(), 'public'),
      prefix: '/public/',
    });

    // Health check endpoint
    server.get('/health', {
      schema: {
        description: 'Health check endpoint',
        tags: ['health'],
        response: {
          200: {
            type: 'object',
            properties: {
              status: { type: 'string' },
              timestamp: { type: 'number' },
              uptime: { type: 'number' },
            },
          },
        },
      },
    }, async (_request, reply) => reply.status(200).send({
      status: 'ok',
      timestamp: Date.now(),
      uptime: process.uptime(),
    }));

    // Root endpoint
    server.get('/', {
      schema: {
        description: 'Welcome message',
        tags: ['root'],
        response: {
          200: {
            type: 'object',
            properties: {
              message: { type: 'string' },
              version: { type: 'string' },
            },
          },
        },
      },
    }, async (_request, reply) => reply.status(200).send({
      message: 'Welcome to Fastify Starter!',
      version: '1.0.0',
    }));

    // Register route modules
    await server.register(HelloRouter, { prefix: '/api/hello' });

    // Error handler
    server.setErrorHandler(async (error, request, reply) => {
      server.log.error(error);
      
      if (reply.statusCode < 400) {
        reply.status(500);
      }

      return reply.send({
        error: {
          message: error.message,
          statusCode: reply.statusCode,
          timestamp: new Date().toISOString(),
          path: request.url,
        },
      });
    });

    // 404 handler
    server.setNotFoundHandler(async (request, reply) => reply.status(404).send({
      error: {
        message: 'Route not found',
        statusCode: 404,
        timestamp: new Date().toISOString(),
        path: request.url,
      },
    }));

    return server;
  } catch (err) {
    console.error('Failed to build server:', err);
    server.log.error('Failed to build server:', err);
    throw err;
  }
};

// Start server
const start = async () => {
  try {
    const app = await buildServer();
    
    const address = await app.listen({
      host: '0.0.0.0',
      port: Number(PORT),
    });

    app.log.info(`🚀 Server listening at ${address}`);
    app.log.info(`📚 Documentation available at ${address}/docs`);
    
    // Ready for requests
    await app.ready();
    app.swagger();
    
  } catch (err) {
    console.error('Failed to start server:', err);
    server.log.error('Failed to start server:', err);
    process.exit(1);
  }
};

// Start the server
start();

export default buildServer;