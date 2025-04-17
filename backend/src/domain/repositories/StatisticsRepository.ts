import { Statistic, StatisticType } from "../entities/Stadistics";

export interface StatisticsRepository {
    increment(statistic: Statistic): Promise<void>;
    getStatistics(statistic: Statistic): Promise<Statistic>;
    getRangeStatistics(type: StatisticType, startDate: Date, endDate: Date): Promise<Statistic[]>;
}

