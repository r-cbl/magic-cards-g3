import { Router, Request, Response } from 'express';
import { StatisticsController } from '../controllers/StatisticsController';
import { StatisticsService } from '../../application/services/StatisticsService';
import { InMemoryStatisticsRepository } from '../../infrastructure/persistence/inMemory/InMemoryStatisticsRepository';


const statisticsRepository = new InMemoryStatisticsRepository();
const statisticsService = new StatisticsService(statisticsRepository);
const statisticsController = new StatisticsController(statisticsService);

const statisticsRouter = Router();

statisticsRouter.get('/', (req: Request, res: Response) => statisticsController.getStatistics(req, res));
statisticsRouter.get('/range', (req: Request, res: Response) => statisticsController.getRangeStatistics(req, res));


export default statisticsRouter;


