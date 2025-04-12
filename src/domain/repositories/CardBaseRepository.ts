import { CardBase } from "../entities/CardBase";
import { Game } from "../entities/Game";

export interface CardBaseRepository {
    save(cardBase: CardBase): Promise<CardBase>;
    update(cardBase: CardBase): Promise<CardBase>;
    delete(id: string): Promise<boolean>;
    findById(id: string): Promise<CardBase | undefined>;
    findByGame(game: Game): Promise<CardBase[]>;
    findAll(): Promise<CardBase[]>;
} 