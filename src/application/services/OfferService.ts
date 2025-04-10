import { Offer } from "@/domain/entities/Offer";
import { OfferRepository } from "../../domain/repositories/OfferRepository";
import { CreateOfferDTO } from "../dtos/OfferDTO";  
import { userRepository, publicationRepository, cardRepository} from "../../infrastructure/repositories/Container";

export class OfferService {
    constructor(private readonly offerRepository: OfferRepository) {}

    public async createOffer(offerData: CreateOfferDTO): Promise<Offer> {
        const publication = await publicationRepository.findById(offerData.publicationId);
        if (!publication) {
            throw new Error('Publication not found');
        }
        const offerOwner = await userRepository.findById(offerData.offerOwnerId);
        if (!offerOwner) {
            throw new Error('Offer owner not found');
        }
        const cardExchange = await cardRepository.findByCardsByIds(offerData.cardExchangeIds);
        const offer = new Offer({
            offerOwner: offerOwner,
            moneyOffer: offerData.moneyOffer,
            cardOffers: cardExchange,
        });
        return this.offerRepository.save(offer);
    }
    
}   
