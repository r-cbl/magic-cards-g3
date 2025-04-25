import { Request, Response } from 'express';
import os from 'os';

export interface HealthCheckResponse {
  status: string;
  uptime: number;
  timestamp: string;
  memoryUsage: {
    rss: number;
    heapTotal: number;
    heapUsed: number;
    external: number;
  };
  cpu: {
    loadAvg: number[];
    cpus: number;
  };
}

export const healthCheck = (req: Request, res: Response): void => {
  const memoryUsage = process.memoryUsage();
  
  const healthData: HealthCheckResponse = {
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    memoryUsage: {
      rss: Math.round(memoryUsage.rss / 1024 / 1024), // MB
      heapTotal: Math.round(memoryUsage.heapTotal / 1024 / 1024), // MB
      heapUsed: Math.round(memoryUsage.heapUsed / 1024 / 1024), // MB
      external: Math.round(memoryUsage.external / 1024 / 1024), // MB
    },
    cpu: {
      loadAvg: os.loadavg(),
      cpus: os.cpus().length,
    },
  };

  res.status(200).json(healthData);
}; 