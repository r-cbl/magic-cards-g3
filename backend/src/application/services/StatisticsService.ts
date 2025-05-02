import { StatisticType, Statistic } from "../../domain/entities/Stadistics";
import { StatisticsRepository } from "../../domain/repositories/StatisticsRepository";
import { StatisticDTO, RangeStatisticDTO } from "../dtos/StatisticsDTO";
import { userRepository } from "../../infrastructure/repositories/Container";
import { UserService } from "./UserService";
import { UnauthorizedException } from "../../domain/entities/exceptions/exceptions";

export class StatisticsService {
    userService : UserService = new UserService(userRepository);
    constructor(private readonly statisticsRepository: StatisticsRepository) {}
    

    public async getStatistics(statisticsDTO:StatisticDTO): Promise<Statistic> {
        const user = await this.userService.getSimpleUser(statisticsDTO.userId);
        if(!user.isAdmin())
        {
            throw new UnauthorizedException("Only Admins can view statistics");
        }
        const statistic = new Statistic(statisticsDTO.type, statisticsDTO.date, statisticsDTO.amount);
        return this.statisticsRepository.getStatistics(statistic);
    }

    public async getRangeStatistics(statisticsDTO:RangeStatisticDTO): Promise<Statistic[]> {
        const user = await this.userService.getSimpleUser(statisticsDTO.userId);
        if(!user.isAdmin())
        {
            throw new UnauthorizedException("Only Admins can view statistics");
        }
        return this.statisticsRepository.getRangeStatistics(statisticsDTO.type, statisticsDTO.from, statisticsDTO.to);
    }
}
