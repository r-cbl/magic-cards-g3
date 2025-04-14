import { PublicationRepository } from "../../domain/repositories/PublicationRepository";
import { CreatePublicationDTO, PublicationFilterDTO, PublicationResponseDTO, PublicationUpdatedDTO } from "../dtos/PublicationDTO";
import { Publication } from "../../domain/entities/Publication";
import { cardBaseRepository, cardRepository, gameRepository, userRepository } from "../../infrastructure/repositories/Container";
import { CardService } from "./CardService";
import { UserService } from "./UserService";
import { CardBase } from "../../domain/entities/CardBase";
import { CardBaseService } from "./CardBaseService";
import { StatusPublication } from "../../domain/entities/StatusPublication";

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
        return this.toPublicationResponseDTO(publication);
    }

    public async getAllPublications(filters: PublicationFilterDTO): Promise<PublicationResponseDTO[]> {
        if (filters.ownerId) {
            await this.userService.getSimpleUser(filters.ownerId);
        }

        if (filters.initialDate && filters.endDate && filters.initialDate > filters.endDate) {
            throw new Error("initialDate must be before endDate");
        }

        const filteredPublications: Publication[] = await this.publicationRepository.find(filters);
        

        return filteredPublications.filter(pub => pub.getStatusPublication() === StatusPublication.OPEN)
        .map(pub => this.toPublicationResponseDTO(pub));
    }

    public async getPublication(id: string): Promise<PublicationResponseDTO> {
      return this.toPublicationResponseDTO(await this.getPublicationById(id));
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
        publication.closePublication();
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
        cardId: card.getId(),
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
