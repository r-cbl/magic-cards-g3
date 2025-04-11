import { Card } from "../../domain/entities/Card";
import { CardRepository } from "../../domain/repositories/CardRepository";

export class InMemoryCardRepository implements CardRepository {
    private cards: Card[] = [];

    async save(card: Card): Promise<Card> {
        this.cards.push(card);
        return card;
    }
    
    async update(card: Card): Promise<Card> {
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

    async findById(id: string): Promise<Card | undefined> {
        return this.cards.find(c => c.getId() === id) || undefined;
    }
    
    async findByCardsByIds(ids: string[]): Promise<Card[] | undefined> {
        const cards = this.cards.filter(c => ids.includes(c.getId()));
        return cards.length > 0 ? cards : undefined;
    }
}

    