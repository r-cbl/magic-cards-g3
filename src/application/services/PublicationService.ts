import { PublicationRepository } from "../../domain/repositories/PublicationRepository";
import { CreatePublicationDTO, PublicationResponseDTO } from "../dtos/PublicationDTO";
import { Card } from "../../domain/entities/Card";
import { Publication } from "../../domain/entities/Publication";
import { CardBase } from "../../domain/entities/CardBase";
import { Game } from "../../domain/entities/Game";
import { User } from "../../domain/entities/User";
import { userRepository } from "../../infrastructure/repositories/Container";

export class PublicationService {
    constructor(private readonly publicationRepository: PublicationRepository) {}
    public async createPublication(publicationData: CreatePublicationDTO): Promise<PublicationResponseDTO> {
        const myCard = await this.getCard(publicationData.cardId);
        const user = await this.getUser(publicationData.ownerId);
        const cardExchangeIds = publicationData.cardExchangeIds ?? [];

      
        if (publicationData.valueMoney == null && cardExchangeIds.length === 0) {
          throw new Error("Invalid publication: must include valueMoney or cardExchangeIds.");
        }
      
        const cardExchange: Card[] = await Promise.all(
          (cardExchangeIds ?? []).map((id) => this.getCard(id))
        );
      
        const publication = new Publication({
          card: myCard,
          owner: user,
          cardExchange,
          valueMoney: publicationData.valueMoney
        });
        this.publicationRepository.save(publication)
        return this.toUserResponseDTO(publication);
      }
      
      private toUserResponseDTO(publication: Publication): PublicationResponseDTO {
        const card = publication.getCard();
        const cardBase = card.getCardBase();
        const game = cardBase.getGame();
        const owner = publication.getOwner();
        const cardExchange = publication.getCardExchange() ?? [];
      
        return {
          id: publication.getId(),
          name: card.getName(),
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
      
    private async getCard(id: string): Promise<Card>{

        return new Card({
            cardBase: new CardBase({
                game: new Game({
                    name: "Pokemon"
                }),
                nameCard: "Pikachu"
            }),
            name: "Pikachu",
            statusCard: 100
        })
    }

    private async getUser(id: string): Promise<User> {
        const user = await userRepository.findById(id);
        if (!user) throw new Error("User not found");
        return user;
      }
      
}
