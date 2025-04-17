import { StatisticType } from "../../domain/entities/Stadistics";

export interface StatisticDTO {
    type: StatisticType;
    date: Date;
    amount: number;
}

export interface RangeStatisticDTO {
    type: StatisticType;
    from: Date;
    to: Date;
}