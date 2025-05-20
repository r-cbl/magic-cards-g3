import { Card } from "../../../domain/entities/Card";
import { CardRepository } from "../../../domain/repositories/CardRepository";
import { CardFilterDTO } from "../../../application/dtos/CardsDTO";
import { PaginatedResponseDTO, PaginationDTO } from "@/application/dtos/PaginationDTO";

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

    async findById(id: string): Promise<Card> {
        const card = this.cards.find(c => c.getId() === id);
        if (!card) {
            throw new Error('Card not found');
        }
        return card;
    }
    
    async find(filters: CardFilterDTO): Promise<Card[]> {
        return this.cards.filter(card => {
            return filters.ownerId ? card.getOwner().getId() === filters.ownerId : true;
        });
    }
    
    async findPaginated(filters: PaginationDTO<CardFilterDTO>): Promise<PaginatedResponseDTO<Card>> {
        const filterCards = await this.find(filters.data);
        const limit = filters.limit || 10;
        const offset = filters.offset || 0;
        const total = filterCards.length;
        const paginatedCards = filterCards.slice(offset, offset + limit);
        const hasMore = offset + limit < total;
        
        return {
            data: paginatedCards,
            total,
            limit,
            offset,
            hasMore
        };
    }

    async findByCardsByIds(ids: string[]): Promise<Card[] | undefined> {
        const cards = this.cards.filter(c => ids.includes(c.getId()));
        return cards.length > 0 ? cards : undefined;
    }
}

    