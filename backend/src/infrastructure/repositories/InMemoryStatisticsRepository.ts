import { StatisticsRepository } from "../../domain/repositories/StatisticsRepository";
import { Statistic, StatisticType } from "../../domain/entities/Stadistics";
type Key = string; // "offers_closed-2024-04-10"

export class InMemoryStatisticsRepository implements StatisticsRepository {
  private stats: Map<Key, number> = new Map();

  private buildKey(type: string, date: Date): string {
    return `${type}-${date.toISOString().split('T')[0]}`; // yyyy-mm-dd
  }

  async increment(statistic: Statistic): Promise<void> {
    const key = this.buildKey(statistic.type, statistic.date);
    const current = this.stats.get(key) ?? 0;
    this.stats.set(key, current + statistic.amount);
  } 

  async getStatistics(statistic: Statistic): Promise<Statistic> {
    const key = this.buildKey(statistic.type, statistic.date);
    return new Statistic(statistic.type, statistic.date, this.stats.get(key) ?? 0);
  }

  async getRangeStatistics(type: StatisticType, from: Date, to: Date): Promise<Statistic[]> {
    const results: Statistic[] = [];

    const current = new Date(from);
    while (current <= to) {
      const key = this.buildKey(type, current);
      results.push(new Statistic(type, new Date(current), this.stats.get(key) ?? 0));
      current.setDate(current.getDate() + 1);
    }

    return results;
  }
}
