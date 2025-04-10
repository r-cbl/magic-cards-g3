import { Offer } from "../../domain/entities/Offer";
import { OfferRepository } from "../../domain/repositories/OfferRepository";

export class InMemoryOfferRepository implements OfferRepository {
    private offers: Offer[] = [];

    async save(offer: Offer): Promise<Offer> {
        this.offers.push(offer);
        return offer;
    }

    async update(offer: Offer): Promise<Offer> {
        const index = this.offers.findIndex(o => o.getId() === offer.getId());
        if (index === -1) {
            throw new Error('Offer not found');
        }
        this.offers[index] = offer;
        return offer;
    }

    async delete(id: string): Promise<boolean> {
        const index = this.offers.findIndex(o => o.getId() === id);
        if (index === -1) {
            return false;
        }
        this.offers.splice(index, 1);
        return true;
    }

    async findById(id: string): Promise<Offer | null> {
        return this.offers.find(o => o.getId() === id) || null;
    }

    async findAll(): Promise<Offer[]> {
        return [...this.offers];
    }

    async findByPublicationId(publicationId: string): Promise<Offer[]> {
        return this.offers.filter(o => o.getPublicationId() === publicationId);
    }
} 