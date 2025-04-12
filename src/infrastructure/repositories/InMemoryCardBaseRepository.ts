import { CardBase } from "../../domain/entities/CardBase";
import { Game } from "../../domain/entities/Game";
import { CardBaseRepository } from "../../domain/repositories/CardBaseRepository";

export class InMemoryCardBaseRepository implements CardBaseRepository {
    private cardBases: CardBase[] = [];

    async save(cardBase: CardBase): Promise<CardBase> {
        this.cardBases.push(cardBase);
        return cardBase;
    }
    
    async update(cardBase: CardBase): Promise<CardBase> {
        const index = this.cardBases.findIndex(cb => cb.getId() === cardBase.getId());
        if (index === -1) {
            throw new Error('CardBase not found');
        }
        this.cardBases[index] = cardBase;
        return cardBase;
    }

    async delete(id: string): Promise<boolean> {
        const index = this.cardBases.findIndex(cb => cb.getId() === id);
        if (index === -1) {
            return false;
        }
        this.cardBases.splice(index, 1);
        return true;
    }   

    async findById(id: string): Promise<CardBase | undefined> {
        return this.cardBases.find(cb => cb.getId() === id) || undefined;
    }
    
    async findByGame(game: Game): Promise<CardBase[]> {
        return this.cardBases.filter(cb => cb.getGame().getId() === game.getId());
    }
    
    async findAll(): Promise<CardBase[]> {
        return [...this.cardBases];
    }
} 