import { StatisticType } from "../../domain/entities/Stadistics";

export interface StatisticDTO {
    userId: string;
    type: StatisticType;
    date: Date;
    amount: number;
}

export interface RangeStatisticDTO {
    userId: string;
    type: StatisticType;
    from: Date;
    to: Date;
}