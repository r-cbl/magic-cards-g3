import { CardFilterDTO } from "@/application/dtos/CardsDTO";
import { Card } from "../entities/Card";
import { PaginatedResponseDTO } from "@/application/dtos/PaginationDTO";
import { PaginationDTO } from "@/application/dtos/PaginationDTO";

export interface CardRepository {
    save(card: Card): Promise<Card>;
    update(card: Card): Promise<Card>;
    delete(id: string): Promise<boolean>;
    findById(id: string): Promise<Card>;
    findByCardsByIds(ids?: string[]): Promise<Card[] | undefined>;
    find(filters: CardFilterDTO): Promise<Card[]>;
    findPaginated(filters: PaginationDTO<CardFilterDTO>): Promise<PaginatedResponseDTO<Card>>;
}
    