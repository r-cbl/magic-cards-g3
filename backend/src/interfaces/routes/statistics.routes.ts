import { Router, Request, Response } from 'express';
import { StatisticsController } from '../controllers/StatisticsController';
import { StatisticsService } from '../../application/services/StatisticsService';
import { InMemoryStatisticsRepository } from '../../infrastructure/persistence/inMemory/InMemoryStatisticsRepository';
import { JwtService } from '../../infrastructure/auth/jwt.service';
import { AuthMiddleware } from '../middleware/auth.middleware';

const statisticsRepository = new InMemoryStatisticsRepository();
const statisticsService = new StatisticsService(statisticsRepository);
const statisticsController = new StatisticsController(statisticsService);
const jwtService = new JwtService();
const authMiddleware = new AuthMiddleware(jwtService);

const statisticsRouter = Router();

statisticsRouter.use(authMiddleware.authenticate);

statisticsRouter.get('/', (req: Request, res: Response) => statisticsController.getRangeStatistics(req, res));


export default statisticsRouter;


