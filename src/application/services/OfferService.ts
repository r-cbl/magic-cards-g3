import { Offer } from "@/domain/entities/Offer";
import { OfferRepository } from "../../domain/repositories/OfferRepository";

export class OfferService {
    constructor(private readonly offerRepository: OfferRepository) {}

    public async createOffer(offer: Offer): Promise<Offer> {
        return this.offerRepository.save(offer);
    }

    public async updateOffer(offer: Offer): Promise<Offer> {
        return this.offerRepository.update(offer);
    }
    
    
}   
