import { InMemoryUserRepository } from "../repositories/InMemoryUserRepository";
import { InMemoryPublicationRepository } from "../repositories/InMemoryPublicationRepository";
import { InMemoryOfferRepository } from "../repositories/InMemoryOfferRepository";
import { InMemoryCardRepository } from "../repositories/InMemoryCardRepository";
import { InMemoryGameRepository } from "../repositories/InMemoryGameRepository";
import { InMemoryCardBaseRepository } from "../repositories/InMemoryCardBaseRepository";
import { InMemoryStatisticsRepository } from "../repositories/InMemoryStatisticsRepository";

export const userRepository = new InMemoryUserRepository();
export const publicationRepository = new InMemoryPublicationRepository();
export const offerRepository = new InMemoryOfferRepository();
export const cardRepository = new InMemoryCardRepository();
export const gameRepository = new InMemoryGameRepository();
export const cardBaseRepository = new InMemoryCardBaseRepository();
export const statisticsRepository = new InMemoryStatisticsRepository();
