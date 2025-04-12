import { InMemoryUserRepository } from "../repositories/InMemoryUserRepository";
import { InMemoryPublicationRepository } from "../repositories/InMemoryPublicationRepository";
import { InMemoryOfferRepository } from "../repositories/InMemoryOfferRepository";
import { InMemoryCardRepository } from "../repositories/InMemoryCardRepository";
import { InMemoryCardBaseRepository } from "./InMemoryCardBaseRepository";

export const userRepository = new InMemoryUserRepository();
export const publicationRepository = new InMemoryPublicationRepository();
export const offerRepository = new InMemoryOfferRepository();
export const cardRepository = new InMemoryCardRepository();
export const cardBaseRepository = new InMemoryCardBaseRepository();
