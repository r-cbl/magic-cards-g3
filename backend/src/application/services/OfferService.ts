import { Offer } from "../../domain/entities/Offer";
import { OfferRepository } from "../../domain/repositories/OfferRepository";
import { CreateOfferDTO, OfferFilterDTO, OfferResponseDTO, OfferUpdatedDTO } from "../dtos/OfferDTO";  
import { userRepository, publicationRepository, cardRepository, statisticsRepository} from "../../infrastructure/repositories/Container";
import { Card } from "../../domain/entities/Card";
import { UserService } from "./UserService";
import { StatusOffer } from "../../domain/entities/StatusOffer";
import { Statistic, StatisticType } from "../../domain/entities/Stadistics";
import { PaginatedResponseDTO, PaginationDTO } from "../dtos/PaginationDTO";
import { UnauthorizedException } from '../../domain/entities/exceptions/exceptions';
import { filter } from "compression";

export class OfferService {
    userService : UserService = new UserService(userRepository);
    constructor(private readonly offerRepository: OfferRepository) {}

    public async createOffer(offerData: CreateOfferDTO): Promise<OfferResponseDTO> {
        const publication = await publicationRepository.findById(offerData.publicationId);
        if (!publication) {
            throw new Error('Publication not found');
        }
        const offerOwner = await userRepository.findById(offerData.offerOwnerId);
        if (!offerOwner) {
            throw new Error('Offer owner not found');
        }

        let cardOffers: Card[] | undefined;       

        if(offerData.cardExchangeIds) {
            cardOffers = await cardRepository.findByCardsByIds(offerData.cardExchangeIds);
            if(cardOffers && cardOffers.length !== offerData.cardExchangeIds.length) {
                const foundCardIds = cardOffers.map(card => card.getId());
                const invalidCardIds = offerData.cardExchangeIds.filter(id => !foundCardIds.includes(id));
                throw new Error(`Invalid cards with IDs: ${invalidCardIds.join(', ')}`);
            }
        }

        const offer = new Offer({
            offerOwner,
            moneyOffer: offerData.moneyOffer,
            cardOffers, 
            publication
        });

        publication.addOffer(offer);
        await publicationRepository.update(publication);
        await statisticsRepository.increment(new Statistic(StatisticType.OFFERS_TOTAL, new Date(), 1));
        this.offerRepository.save(offer);

        return this.toOfferResponseDTO(offer);
    }

    public async getAllOffer(filters: OfferFilterDTO): Promise<OfferResponseDTO[]> {
        if(filters.ownerId){
            await this.userService.getSimpleUser(filters.ownerId)
        }
        const offers = await this.offerRepository.find(filters);
        return offers.map(offer => this.toOfferResponseDTO(offer));
    }

    public async getAllOfferPaginated(filters: PaginationDTO<OfferFilterDTO>): Promise<PaginatedResponseDTO<OfferResponseDTO>> {
        if(filters.data.ownerId){
            await this.userService.getSimpleUser(filters.data.ownerId)
        }
        if(filters.data.userId){
            await this.userService.getSimpleUser(filters.data.userId)
        }
        const paginatedOffers = await this.offerRepository.findPaginated(filters);
        return {
            data: paginatedOffers.data.map(offer => this.toOfferResponseDTO(offer)),
            total: paginatedOffers.total,
            limit: paginatedOffers.limit,
            offset: paginatedOffers.offset,
            hasMore: paginatedOffers.hasMore
        };
    }

    public async getOffer(id: string): Promise<OfferResponseDTO | null>{
        const offer = await this.offerRepository.findById(id);
        if (!offer) {
            return null;
        }
        return this.toOfferResponseDTO(offer);
    }

    public async updateOffer(offerId: string, offerData: OfferUpdatedDTO): Promise<OfferResponseDTO> {
        const offer = await this.offerRepository.findById(offerId);
        const user = await this.userService.getSimpleUser(offerData.userId);
        const publication = await publicationRepository.findById(offerData.publicationId);

        if (!offer || !publication) {   
            throw new Error('Offer or publication not found');
        }
        publication.validateOwnership(user, "publication");

        if(offerData.statusOffer === StatusOffer.ACCEPTED) {
            const [acceptedOffer, cards] = publication.acceptOffer(offer);
            await Promise.all(cards.map(card => cardRepository.update(card)));
            await publicationRepository.update(publication);
            await statisticsRepository.increment(new Statistic(StatisticType.OFFERS_ACCEPTED, new Date(), 1));

            this.offerRepository.update(acceptedOffer);
            return this.toOfferResponseDTO(acceptedOffer);
        }

        if(offerData.statusOffer === StatusOffer.REJECTED) {
            const rejectedOffer = publication.rejectOffer(offer);
            await publicationRepository.update(publication);
            await statisticsRepository.increment(new Statistic(StatisticType.OFFERS_REJECTED, new Date(), 1));

            this.offerRepository.update(rejectedOffer);
            return this.toOfferResponseDTO(rejectedOffer);
        }
        
        this.offerRepository.update(offer);
        return this.toOfferResponseDTO(offer);
    }

    private toOfferResponseDTO(offer: Offer): OfferResponseDTO {
        const publicationId = offer.getPublication().getId();
        const cardExchangeIds = offer.getCardOffers()?.map(card => card.getId());
        const ownerId = offer.getOfferOwner().getId();

        return {
            id: offer.getId(),
            publicationId,
            moneyOffer: offer.getMoneyOffer(),
            cardExchangeIds,
            createdAt: offer.getCreatedAt(),
            updatedAt: offer.getUpdatedAt(),
            status: offer.getStatusOffer(),
            ownerId: ownerId
        };
    }
    

    public async getSimpleOffer(id: string) : Promise<Offer | null> {
        return await this.offerRepository.findById(id);
    }
    
}   
