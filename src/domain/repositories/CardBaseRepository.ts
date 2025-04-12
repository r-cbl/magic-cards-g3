import { CardBase } from "../entities/CardBase";

export interface CardBaseRepository {
    save(card: CardBase): Promise<CardBase>;
    update(card: CardBase): Promise<CardBase>;
    delete(id: string): Promise<boolean>;
    findById(id: string): Promise<CardBase | undefined>;
    findByCardsByIds(ids?: string[]): Promise<CardBase[] | undefined>;
}
    