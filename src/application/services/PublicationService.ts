import { PublicationRepository } from "../../domain/repositories/PublicationRepository";
import { CreatePublicationDTO, PublicationFilterDTO, PublicationResponseDTO } from "../dtos/PublicationDTO";
import { Card } from "../../domain/entities/Card";
import { Publication } from "../../domain/entities/Publication";
import { cardRepository, userRepository } from "../../infrastructure/repositories/Container";
import { CardService } from "./CardService";
import { UserService } from "./UserService";

export class PublicationService {
    cardService : CardService = new CardService(cardRepository);
    userService : UserService = new UserService(userRepository);

    constructor(private readonly publicationRepository: PublicationRepository) {}
    public async createPublication(publicationData: CreatePublicationDTO): Promise<PublicationResponseDTO> {
        const myCard = await this.cardService.getSimpleCard(publicationData.cardId);
        const user = await this.userService.getSimpleUser(publicationData.ownerId);
        const cardExchangeIds = publicationData.cardExchangeIds ?? [];
      
        if (publicationData.valueMoney == null && cardExchangeIds.length === 0) {
          throw new Error("Invalid publication: must include valueMoney or cardExchangeIds.");
        }
      
        const cardExchange: Card[] = await Promise.all(
          (cardExchangeIds ?? []).map(async (id) => await this.cardService.getSimpleCard(id))
        );
      
        const publication = new Publication({
          card: myCard,
          owner: user,
          cardExchange,
          valueMoney: publicationData.valueMoney
        });
        this.publicationRepository.save(publication)
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

        return filteredPublications.map(pub => this.toPublicationResponseDTO(pub));
    }

    private toPublicationResponseDTO(publication: Publication): PublicationResponseDTO {
      const card = publication.getCard();
      const cardBase = card.getCardBase();
      const game = cardBase.getGame();
      const owner = publication.getOwner();
      const cardExchange = publication.getCardExchange() ?? [];
    
      return {
        id: publication.getId(),
        name: cardBase.getName(),
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
        createdAt: publication.getCreatedAt(),
      };
    }
      
}
