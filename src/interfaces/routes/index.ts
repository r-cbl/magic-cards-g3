import { Router, Request, Response } from 'express';
import userRoutes from './user.routes';
import authRoutes from './auth.routes';
import publicationRoutes from './publication.routes';
import { healthCheck } from '../../infrastructure/http/health';

const router = Router();

// API routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/publications', publicationRoutes);

// Health check routes
router.get('/health', (req: Request, res: Response) => healthCheck(req, res));
router.get('/health-check', (req: Request, res: Response) => healthCheck(req, res));
router.get('/healthz', (req: Request, res: Response) => healthCheck(req, res));

export default router; 