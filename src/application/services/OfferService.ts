import { Offer } from "../../domain/entities/Offer";
import { OfferRepository } from "../../domain/repositories/OfferRepository";
import { CreateOfferDTO } from "../dtos/OfferDTO";  
import { userRepository, publicationRepository, cardRepository} from "../../infrastructure/repositories/Container";
import { Card } from "../../domain/entities/Card";

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

        let cardExchange: Card[] | undefined;       

        if(offerData.cardExchangeIds) {
            cardExchange = await cardRepository.findByCardsByIds(offerData.cardExchangeIds);
            if(cardExchange && cardExchange.length !== offerData.cardExchangeIds.length) {
                const foundCardIds = cardExchange.map(card => card.getId());
                const invalidCardIds = offerData.cardExchangeIds.filter(id => !foundCardIds.includes(id));
                throw new Error(`Invalid cards with IDs: ${invalidCardIds.join(', ')}`);
            }
        }

        const offer = new Offer({
            offerOwner: offerOwner,
            moneyOffer: offerData.moneyOffer,
            cardOffers: cardExchange, 
        });

        publication.addOffer(offer);
        await publicationRepository.update(publication);
        return this.offerRepository.save(offer);
    }
    
}   
