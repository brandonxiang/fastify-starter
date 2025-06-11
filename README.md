<p align="center">
  <a href="https://github.com/brandonxiang/fastify-starter">
    <img src="https://brandonxiang.top/icon/vite-template.jpeg" width="150px" alt="Template Logo" />
  </a>
</p>

# Fastify Starter 🚀

A modern Fastify starter template with TypeScript, latest conventions, and best practices.

## Features

- ⚡ **Fastify 5.x** - Fast and efficient web framework
- 🔷 **TypeScript** - Full TypeScript support with latest ES2022 features
- 📚 **Swagger/OpenAPI** - Auto-generated API documentation
- 🔄 **Hot Reload** - Development server with watch mode
- ⚙️ **Environment Config** - Flexible configuration management
- 🗄️ **Database Ready** - Knex.js integration with MySQL
- 🔗 **Redis Support** - IORedis integration
- 🛡️ **CORS** - Configurable CORS settings
- 🧪 **TypeScript Strict Mode** - Enhanced type safety
- 📦 **Modern Build Tools** - tsdown (powered by Rolldown) for fast builds
- 🎨 **ESLint + Prettier** - Code formatting and linting
- 🚦 **Health Checks** - Built-in health monitoring
- 🔧 **Graceful Shutdown** - Proper process management

## Requirements

- Node.js >= 18.0.0
- pnpm >= 8.0.0

## Quick Start

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd fastify-starter
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start development server**

   ```bash
   pnpm run dev
   ```

5. **Visit your application**
   - API: <http://localhost:31303>
   - Documentation: <http://localhost:31303/docs>
   - Health Check: <http://localhost:31303/health>

## Scripts

| Script                  | Description                                      |
| ----------------------- | ------------------------------------------------ |
| `pnpm run dev`          | Start development server with hot reload         |
| `pnpm run build`        | Build for production with tree-shaking          |
| `pnpm run build:dev`    | Build for development                            |
| `pnpm start`            | Start production server                          |
| `pnpm run start:prod`   | Start production server with NODE_ENV=production |
| `pnpm run type-check`   | Run TypeScript type checking                     |
| `pnpm run lint`         | Run ESLint                                       |
| `pnpm run lint:fix`     | Run ESLint with auto-fix                         |
| `pnpm run format`       | Format code with Prettier                        |
| `pnpm run format:check` | Check code formatting                            |
| `pnpm run deps:check`   | Check for outdated dependencies                  |
| `pnpm run deps:update`  | Update dependencies                              |

## Project Structure

```
src/
├── config/          # Configuration management
│   └── index.ts     # Environment-based configuration
├── constants/       # Application constants
├── model/           # Database models (Knex.js)
│   └── base.ts      # Base model class
├── redis/           # Redis utilities
│   └── index.ts     # Redis connection and operations
├── routes/          # API routes
│   └── hello.ts     # Example route module
├── types/           # TypeScript type definitions
├── utils/           # Utility functions
│   └── index.ts     # Common utilities
└── server.ts        # Main application server
```

## Configuration

The application uses environment-based configuration. Set these environment variables:

### Core Settings

```bash
NODE_ENV=development          # Environment (development/production)
PORT=31303                   # Server port
HOST=0.0.0.0                # Server host
APP_REGION=sg               # Application region
```

### Database (MySQL)

```bash
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_DATABASE=fastify_starter
```

### Redis

```bash
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=your_redis_password  # Optional
```

### CORS

```bash
CORS_ORIGIN=https://yourdomain.com,https://anotherdomain.com
```

## API Documentation

The API documentation is automatically generated using Swagger/OpenAPI and available at `/docs` when running the server.

### Example Endpoints

- `GET /` - Welcome message
- `GET /health` - Health check
- `GET /api/hello/world?name=John` - Hello world with optional name
- `POST /api/hello/user` - Hello with user data
- `GET /api/hello/info` - Service information

## Modern Fastify Patterns

This starter implements the latest Fastify conventions:

### 1. Plugin Architecture

```typescript
const helloRoutes: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  fastify.get('/world', { schema: helloWorldSchema }, async (request, reply) => {
    // Route handler
  });
};
```

### 2. Schema-First Approach

```typescript
const helloWorldSchema = {
  description: 'Hello World endpoint',
  tags: ['hello'],
  querystring: {
    type: 'object',
    properties: {
      name: { type: 'string', description: 'Name to greet' }
    }
  },
  response: {
    200: { /* response schema */ }
  }
} as const;
```

### 3. TypeScript Integration

```typescript
interface HelloWorldQuery {
  name?: string;
}

fastify.get<{ Querystring: HelloWorldQuery }>('/world', {
  schema: helloWorldSchema
}, async (request, reply) => {
  const { name = 'World' } = request.query; // Fully typed
});
```

### 4. Error Handling

```typescript
server.setErrorHandler(async (error, request, reply) => {
  server.log.error(error);
  return reply.send({
    error: {
      message: error.message,
      statusCode: reply.statusCode,
      timestamp: new Date().toISOString(),
      path: request.url
    }
  });
});
```

### 5. Graceful Shutdown

```typescript
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
```

## Database Integration

### Base Model Class

```typescript
import { config } from '../config/index.js';

export const KnexInstance = knex({
  client: 'mysql',
  connection: config.database,
});

export default class BasicModel<T extends Record<string, any>> {
  private builder: Knex.QueryBuilder;
  protected knex = KnexInstance;

  constructor(table: string) {
    this.builder = this.knex<T>(table);
  }

  async query(condition: Partial<T>): Promise<T[]> {
    return this.queryBuilder.where(condition).select('*');
  }
}
```

## Redis Integration

```typescript
import { config } from '../config/index.js';

const redis = new IORedis({
  host: config.redis.host,
  port: config.redis.port,
  ...(config.redis.password && { password: config.redis.password })
});

export async function hget(key: string, field: string) {
  return redis.hget(key, field);
}
```

## Development

### Adding New Routes

1. Create a new route file in `src/routes/`
2. Define your schemas and interfaces
3. Export as FastifyPluginAsync
4. Register in `src/server.ts`

### Adding New Models

1. Create a model file in `src/model/`
2. Extend the BasicModel class
3. Define your entity interface
4. Add database-specific methods

## Production Deployment

1. **Build the application**

   ```bash
   pnpm run build
   ```

2. **Set production environment**

   ```bash
   export NODE_ENV=production
   ```

3. **Start the server**

   ```bash
   pnpm run start:prod
   ```

## Best Practices

1. **Use TypeScript strictly** - Enable all strict checks
2. **Schema validation** - Define schemas for all endpoints
3. **Error handling** - Implement comprehensive error handling
4. **Logging** - Use structured logging with Pino
5. **Configuration** - Use environment-based config
6. **Security** - Implement proper CORS and security headers
7. **Testing** - Write tests for your endpoints (TODO: Add testing setup)
8. **Documentation** - Keep API documentation up to date

## Troubleshooting

### Common Issues

1. **Port already in use**

   ```bash
   lsof -ti:31303 | xargs kill -9
   ```

2. **Database connection issues**
   - Check your database credentials in `.env`
   - Ensure MySQL is running
   - Verify network connectivity

3. **Redis connection issues**
   - Check Redis server status
   - Verify Redis configuration

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

ISC License

---

**Happy coding with Fastify! 🚀**
