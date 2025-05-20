import { Request, Response } from 'express';
import { StatisticsService } from '../../application/services/StatisticsService';
import { Statistic, StatisticType } from '../../domain/entities/Stadistics';
import { RangeStatisticDTO } from '@/application/dtos/StatisticsDTO';

export class StatisticsController {
    constructor(private readonly statisticsService: StatisticsService) {}

    public async getStatistics(req: Request, res: Response): Promise<void> {
        // const statistic = new Statistic(req.body.type, req.body.date, req.body.amount);
        // const statistics = await this.statisticsService.getStatistics(statistic);
        // res.status(200).json(statistics);
    }

    public async getRangeStatistics(req: Request, res: Response): Promise<void> {
        const statisticsDTO: RangeStatisticDTO = {
            userId: req.user?.userId || "",
            type: req.query.type ? req.query.type as StatisticType : StatisticType.USERS_REGISTERED,
            from: req.query.from ? new Date(req.query.from as string) : new Date(),
            to: req.query.to ? new Date(req.query.to as string) : new Date()
        }
        
        const rangeStatistics = await this.statisticsService.getRangeStatistics(statisticsDTO);
        res.status(200).json(rangeStatistics);
    }
    
}