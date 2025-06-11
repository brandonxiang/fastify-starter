import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export interface AppConfig {
  port: number;
  host: string;
  nodeEnv: string;
  appRegion: string;
  cors: {
    origin: string[] | boolean;
    credentials: boolean;
  };
  swagger: {
    enabled: boolean;
    routePrefix: string;
  };
  logging: {
    level: string;
    prettyPrint: boolean;
  };
  static: {
    root: string;
    prefix: string;
  };
  database: {
    host: string;
    port: number;
    user: string;
    password: string;
    database: string;
  };
  redis: {
    host: string;
    port: number;
    password?: string;
  };
}

const getConfig = (): AppConfig => {
  const {
    NODE_ENV = 'development',
    PORT = '31303',
    HOST = '0.0.0.0',
    APP_REGION = 'sg',
    
    // Database
    DB_HOST = 'localhost',
    DB_PORT = '3306',
    DB_USER = 'root',
    DB_PASSWORD = '',
    DB_DATABASE = 'fastify_starter',
    
    // Redis
    REDIS_HOST = 'localhost',
    REDIS_PORT = '6379',
    REDIS_PASSWORD,
    
    // CORS
    CORS_ORIGIN = '',
  } = process.env;

  const isProduction = NODE_ENV === 'production';
  const isDevelopment = NODE_ENV === 'development';

  // Parse CORS origins
  const corsOrigins = CORS_ORIGIN
    ? CORS_ORIGIN.split(',').map(origin => origin.trim())
    : [];

  return {
    port: parseInt(PORT, 10),
    host: HOST,
    nodeEnv: NODE_ENV,
    appRegion: APP_REGION,
    
    cors: {
      origin: isProduction && corsOrigins.length > 0 
        ? corsOrigins 
        : isDevelopment,
      credentials: true,
    },
    
    swagger: {
      enabled: !isProduction,
      routePrefix: '/docs',
    },
    
    logging: {
      level: isProduction ? 'warn' : 'info',
      prettyPrint: isDevelopment,
    },
    
    static: {
      root: path.join(__dirname, '..', '..', 'public'),
      prefix: '/public/',
    },
    
    database: {
      host: DB_HOST,
      port: parseInt(DB_PORT, 10),
      user: DB_USER,
      password: DB_PASSWORD,
      database: DB_DATABASE,
    },
    
    redis: {
      host: REDIS_HOST,
      port: parseInt(REDIS_PORT, 10),
      ...(REDIS_PASSWORD && { password: REDIS_PASSWORD }),
    },
  };
};

export const config = getConfig();

export default config; 