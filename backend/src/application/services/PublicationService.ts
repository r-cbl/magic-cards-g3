import { PublicationRepository } from "../../domain/repositories/PublicationRepository";
import { CreatePublicationDTO, PublicationFilterDTO, PublicationResponseDTO, PublicationUpdatedDTO } from "../dtos/PublicationDTO";
import { Publication } from "../../domain/entities/Publication";
import { cardBaseRepository, cardRepository, gameRepository, userRepository, offerRepository, statisticsRepository } from "../../infrastructure/repositories/Container";
import { CardService } from "./CardService";
import { UserService } from "./UserService";
import { CardBase } from "../../domain/entities/CardBase";
import { CardBaseService } from "./CardBaseService";
import { StatusPublication } from "../../domain/entities/StatusPublication";
import { Statistic, StatisticType } from "../../domain/entities/Stadistics";
import { PaginatedResponseDTO, PaginationDTO } from "../dtos/PaginationDTO";

export class PublicationService {
    cardService : CardService = new CardService(cardRepository);
    userService : UserService = new UserService(userRepository);
    cardBaseService : CardBaseService = new CardBaseService(cardBaseRepository, gameRepository);

    constructor(private readonly publicationRepository: PublicationRepository) {}

    public async createPublication(publicationData: CreatePublicationDTO): Promise<PublicationResponseDTO> {
        const myCard = await this.cardService.getSimpleCard(publicationData.cardId);
        const user = await this.userService.getSimpleUser(publicationData.ownerId);
        const cardExchangeIds = publicationData.cardExchangeIds ?? [];
      

        if (publicationData.valueMoney == null && cardExchangeIds.length === 0) {
          throw new Error("Invalid publication: must include valueMoney or cardExchangeIds.");
        }

        if (publicationData.valueMoney)
          this.validateMoney(publicationData.valueMoney);

        const cardExchange: CardBase[] = await Promise.all(
          (cardExchangeIds ?? []).map(async (id) => await this.cardBaseService.getSimpleCardBase(id))
        );
      
        const publication = new Publication({
          card: myCard,
          owner: user,
          cardExchange,
          valueMoney: publicationData.valueMoney
        });

        await this.publicationRepository.save(publication)
        await statisticsRepository.increment(new Statistic(StatisticType.PUBLICATIONS_TOTAL, new Date(), 1));
        return this.toPublicationResponseDTO(publication);
    }

    public async getAllPublications(filters: PublicationFilterDTO): Promise<PublicationResponseDTO[]> {
        if (filters.ownerId) {
            await this.userService.getSimpleUser(filters.ownerId);
        }
        const publications = await this.publicationRepository.find(filters);
        return publications.map(pub => this.toPublicationResponseDTO(pub));
    }

    public async getAllPublicationsPaginated(filters: PaginationDTO<PublicationFilterDTO>): Promise<PaginatedResponseDTO<PublicationResponseDTO>> {
        if (filters.data.ownerId) {
            await this.userService.getSimpleUser(filters.data.ownerId);
        }
        const paginatedPublications = await this.publicationRepository.findPaginated(filters);
        return {
            data: paginatedPublications.data.map(pub => this.toPublicationResponseDTO(pub)),
            total: paginatedPublications.total,
            limit: paginatedPublications.limit,
            offset: paginatedPublications.offset,
            hasMore: paginatedPublications.hasMore
        };
    }

    public async getPublication(id: string): Promise<PublicationResponseDTO> {
        const publication = await this.getPublicationById(id);
        return this.toPublicationResponseDTO(publication);
    }

    public async updatePublication(id: string, publicationData: PublicationUpdatedDTO): Promise<PublicationResponseDTO> {
      const publication = await this.getPublicationById(id);
      const user = await this.userService.getSimpleUser(publicationData.userId);
    
      publication.validateOwnership(user, "publication");
    
      const cardExchangeIds = publicationData.cardExchangeIds ?? [];
      const isUpdateValue = publicationData.valueMoney != null;
      const isUpdateExchange = cardExchangeIds.length > 0;
      const isCancel = publicationData.cancel === true;
    
      if (!isUpdateValue && !isUpdateExchange && !isCancel) {
        throw new Error("Invalid publication: must include valueMoney, cardExchangeIds, or cancel flag.");
      }
    
      if (isCancel) {
        const rejectedOffers = publication.closePublication();
        await Promise.all(rejectedOffers.map(offer => offerRepository.update(offer)));
      } else {
        if (isUpdateValue) {
          this.validateMoney(publicationData.valueMoney!);
          publication.setValueMoney(publicationData.valueMoney!);
        }
    
        if (isUpdateExchange) {
          const cardExchange = await Promise.all(
            cardExchangeIds.map(id => this.cardBaseService.getSimpleCardBase(id))
          );
          publication.setCardExchange(cardExchange);
        }
      }
    
      publication.setUpdatedAt(new Date());
      return this.toPublicationResponseDTO(await this.publicationRepository.update(publication));
    }
    

    public async deletePublication(userId: string, id: string): Promise<boolean>{
      const publication = await this.getPublicationById(id);
      const user = await this.userService.getSimpleUser(userId)
      
      publication.validateOwnership(user, "publication")
      publication.closePublication();

      return this.publicationRepository.delete(id)
    }

    private toPublicationResponseDTO(publication: Publication): PublicationResponseDTO {
      const card = publication.getCard();
      const cardBase = card.getCardBase();
      const game = cardBase.getGame();
      const owner = publication.getOwner();
      const cardExchange = publication.getCardExchange() ?? [];
      const offers = publication.getOffersExisting() ?? [];
    
      return {
        id: publication.getId(),
        name: cardBase.getName(),
        card:{
          cardId: card.getId(),
          urlImage: card.getUrlImage(),
        },
        valueMoney: publication.getValueMoney() ?? 0,
        cardExchangeIds: cardExchange.map((c) => c.getId()),
        cardBase: {
          Id: cardBase.getId(),
          Name: cardBase.getName(),
        },
        game: {
          Id: game.getId(),
          Name: game.getName(),
        },
        owner: {
          ownerId: owner.getId(),
          ownerName: owner.getName(),
        },
        offers: offers.map((offer) => ({
          offerId: offer.getId(),
          moneyOffer: offer.getMoneyOffer(),
          status: offer.getstatus(),
          cardExchangeIds: offer.getCardOffers()?.map((c) => c.getId()) ?? []
        })),
        createdAt: publication.getCreatedAt(),
      };
    }

    private async getPublicationById(id: string): Promise<Publication> {
      const publication = await this.publicationRepository.findById(id)
      if(!publication){
        throw Error("Publication not found")
        }
      return publication;
    }

    private async validateMoney(money: number): Promise<void> {
      if(money <= 0)
        throw Error("Invalid publication: valueMoney must be bigger than 0")
    }
}
