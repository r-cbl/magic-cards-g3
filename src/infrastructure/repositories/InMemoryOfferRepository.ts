import { OfferFilterDTO } from "@/application/dtos/OfferDTO";
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

    async find(filters: OfferFilterDTO): Promise<Offer[]> {
        return this.offers.filter(offer => {
            const matchesOwnerId = filters.ownerId ? offer.getOwner().getId() === filters.ownerId : true;
            const matchesPublicationId = filters.publicationId ? offer.getPublication().getId() === filters.publicationId : true;
            const matchesStatus = filters.status ? offer.getStatusOffer() === filters.status : true;
            return matchesOwnerId && matchesPublicationId && matchesStatus;
        });
    }
} 