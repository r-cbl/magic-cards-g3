import { OfferFilterDTO } from "@/application/dtos/OfferDTO";
import { Offer } from "../entities/Offer";


export interface OfferRepository {
    save(offer: Offer): Promise<Offer>;
    update(offer: Offer): Promise<Offer>;
    delete(id: string): Promise<boolean>;
    findById(id: string): Promise<Offer | null>;
    find(filters: OfferFilterDTO): Promise<Offer[]>;
}

 