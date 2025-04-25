import { StatisticType, Statistic } from "../../domain/entities/Stadistics";
import { StatisticsRepository } from "../../domain/repositories/StatisticsRepository";

export class StatisticsService {
    constructor(private readonly statisticsRepository: StatisticsRepository) {}
    

    public async getStatistics(statistic: Statistic): Promise<Statistic> {
        return this.statisticsRepository.getStatistics(statistic);
    }

    public async getRangeStatistics(type: StatisticType, from: Date, to: Date): Promise<Statistic[]> {
        return this.statisticsRepository.getRangeStatistics(type, from, to);
    }
}

