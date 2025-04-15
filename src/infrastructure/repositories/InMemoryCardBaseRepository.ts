import { CardBase } from "@/domain/entities/CardBase";
import { Game } from "@/domain/entities/Game";
import { CardBaseRepository } from "@/domain/repositories/CardBaseRepository";

export class InMemoryCardBaseRepository implements CardBaseRepository {
    private cards: CardBase[] = [];

    async save(card: CardBase): Promise<CardBase> {
        this.cards.push(card);
        return card;
    }
    
    async update(card: CardBase): Promise<CardBase> {
        const index = this.cards.findIndex(c => c.getId() === card.getId());
        if (index === -1) {
            throw new Error('Card not found');
        }
        this.cards[index] = card;
        return card;
    }

    async delete(id: string): Promise<boolean> {
        const index = this.cards.findIndex(c => c.getId() === id);
        if (index === -1) {
            return false;
        }
        this.cards.splice(index, 1);
        return true;
    }   

    async findById(id: string): Promise<CardBase | undefined> {
        return this.cards.find(c => c.getId() === id) || undefined;
    }
    
    async findByCardsByIds(ids: string[]): Promise<CardBase[] | undefined> {
        const cards = this.cards.filter(c => ids.includes(c.getId()));
        return cards.length > 0 ? cards : undefined;
    }
    
    async findByGame(game: Game): Promise<CardBase[]> {
        return this.cards.filter(c => c.getGame().getId() === game.getId());
    }
    
    async findAll(): Promise<CardBase[]> {
        return [...this.cards];
    }
} 
