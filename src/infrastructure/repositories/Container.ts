import { InMemoryUserRepository } from "../repositories/InMemoryUserRepository";
import { InMemoryPublicationRepository } from "../repositories/InMemoryPublicationRepository";

export const userRepository = new InMemoryUserRepository();
export const publicationRepository = new InMemoryPublicationRepository();
