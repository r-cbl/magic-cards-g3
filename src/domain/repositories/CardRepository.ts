import { CardFilterDTO } from "@/application/dtos/CardsDTO";
import { Card } from "../entities/Card";

export interface CardRepository {
    save(card: Card): Promise<Card>;
    update(card: Card): Promise<Card>;
    delete(id: string): Promise<boolean>;
    findById(id: string): Promise<Card>;
    findByCardsByIds(ids?: string[]): Promise<Card[] | undefined>;
    find(filters: CardFilterDTO): Promise<Card[]>;
}
    