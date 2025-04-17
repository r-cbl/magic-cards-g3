import { Request, Response } from 'express';
import { StatisticsService } from '../../application/services/StatisticsService';
import { Statistic } from '../../domain/entities/Stadistics';

export class StatisticsController {
    constructor(private readonly statisticsService: StatisticsService) {}

    public async getStatistics(req: Request, res: Response): Promise<void> {
        const statistic = new Statistic(req.body.type, req.body.date, req.body.amount);
        const statistics = await this.statisticsService.getStatistics(statistic);
        res.status(200).json(statistics);
    }

    public async getRangeStatistics(req: Request, res: Response): Promise<void> {
        const rangeStatistics = await this.statisticsService.getRangeStatistics(req.body.type, req.body.from, req.body.to);
        res.status(200).json(rangeStatistics);
    }
    
}