import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env file
dotenv.config();

const config = {
  env: process.env.NODE_ENV || 'development',
  isProduction: process.env.NODE_ENV === 'production',
  isDevelopment: process.env.NODE_ENV === 'development',
  server: {
    port: parseInt(process.env.PORT || '3000', 10),
    apiPrefix: process.env.API_PREFIX || '/api',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'your-default-secret-key-for-dev-only',
    expiresIn: process.env.JWT_EXPIRES_IN || '3600',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },
  logging: {
    level: process.env.LOG_LEVEL || 'info',
  },
  // Database configuration (if needed)
  // db: {
  //   host: process.env.DB_HOST || 'localhost',
  //   port: parseInt(process.env.DB_PORT || '5432', 10),
  //   username: process.env.DB_USER || 'postgres',
  //   password: process.env.DB_PASSWORD || 'postgres',
  //   database: process.env.DB_NAME || 'express_clean_architecture',
  //   ssl: process.env.DB_SSL === 'true',
  // },
};

export default config; 