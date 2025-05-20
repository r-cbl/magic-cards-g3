import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';

import config from '../config/config';
import logger from '../logging/logger';
import apiRoutes from '../../interfaces/routes';
import { connectToDatabase } from '../database/mongo.config';

class App {
  public app: Application;

  constructor() {
    this.app = express();
    this.setupMiddleware();
    this.setupRoutes();
    this.setupErrorHandling();
    this.setupDatabase();
  }

  private setupMiddleware(): void {
    // Apply middleware
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cors());
    this.app.use(helmet());
    this.app.use(compression());
    
    // Setup request logging
    if (config.isDevelopment) {
      this.app.use(morgan('dev'));
    } else {
      this.app.use(morgan('combined', {
        stream: {
          write: (message: string) => logger.info(message.trim()),
        },
      }));
    }
  }

  private setupRoutes(): void {
    // Base route
    this.app.get('/', (_req: Request, res: Response) => {
      res.json({
        message: 'Express Clean Architecture API',
        environment: config.env,
        version: '1.0.0',
      });
    });

    // API routes
    this.app.use(config.server.apiPrefix, apiRoutes);
  }

  private setupErrorHandling(): void {
    // Not found handler
    this.app.use((_req: Request, res: Response) => {
      res.status(404).json({
        error: 'Not Found',
        message: 'The requested resource was not found',
      });
    });

    // Error handler
    this.app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
      logger.error(`Unhandled error: ${err.message}`);
      
      res.status(500).json({
        error: 'Internal Server Error',
        message: config.isDevelopment ? err.message : 'An unexpected error occurred',
      });
    });
  }

  private setupDatabase(): void {
    connectToDatabase();
  }
}

export default new App().app; 