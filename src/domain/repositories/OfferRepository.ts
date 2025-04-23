import { OfferFilterDTO } from "@/application/dtos/OfferDTO";
import { Offer } from "../entities/Offer";
import { PaginatedResponseDTO } from "@/application/dtos/PaginationDTO";

export interface OfferRepository {
    save(offer: Offer): Promise<Offer>;
    update(offer: Offer): Promise<Offer>;
    delete(id: string): Promise<boolean>;
    findById(id: string): Promise<Offer | null>;
    find(filters: OfferFilterDTO): Promise<Offer[]>;
    findPaginated(filters: OfferFilterDTO): Promise<PaginatedResponseDTO<Offer>>;
}

 