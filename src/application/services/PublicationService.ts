import { PublicationRepository } from "../../domain/repositories/PublicationRepository";
import { CreatePublicationDTO, PublicationFilterDTO, PublicationResponseDTO, PublicationUpdatedDTO } from "../dtos/PublicationDTO";
import { Card } from "../../domain/entities/Card";
import { Publication } from "../../domain/entities/Publication";
import { CardBase } from "../../domain/entities/CardBase";
import { Game } from "../../domain/entities/Game";
import { User } from "../../domain/entities/User";
import { userRepository } from "../../infrastructure/repositories/Container";
import { error } from "console";

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
        return this.toPublicationResponseDTO(publication);
      }

      public async getAllPublications(filters: PublicationFilterDTO): Promise<PublicationResponseDTO[]> {
        if(filters.ownerId){
          await this.getUser(filters.ownerId)
        }

        if(filters.initialDate && filters.endDate && filters.initialDate > filters.endDate) {
          throw new Error("initialDate must be before endDate");
        }

        const all = await this.publicationRepository.findAll();
      
        const filtered = all.filter(pub => {
          const createdAt = pub.getCreatedAt();
          const ownerId = pub.getOwner().getId();
          const valueMoney = pub.getValueMoney() ?? 0;
          const gameId = pub.getCard().getCardBase().getGame().getId();
          const cardBaseId = pub.getCard().getCardBase().getId();
      
          return (
            (!filters.initialDate || createdAt >= filters.initialDate) &&
            (!filters.endDate || createdAt <= filters.endDate) &&
            (!filters.gamesIds || filters.gamesIds.includes(gameId)) &&
            (!filters.cardBaseIds || filters.cardBaseIds.includes(cardBaseId)) &&
            (!filters.minValue || valueMoney >= filters.minValue) &&
            (!filters.maxValue || valueMoney <= filters.maxValue) && 
            (!filters.ownerId || ownerId === filters.ownerId)
          );
        });
      
        return filtered.map(pub => this.toPublicationResponseDTO(pub));
      }

      public async getPublication(id: string): Promise<PublicationResponseDTO> {
        return this.toPublicationResponseDTO(await this.getPublicationById(id));
      }

      public async updatePublication(id: string, publicationData: PublicationUpdatedDTO): Promise<PublicationResponseDTO>{
        const publication = await this.getPublicationById(id);
        const cardExchangeIds = publicationData.cardExchangeIds ?? [];

        if (publicationData.valueMoney == null && cardExchangeIds.length === 0) {
          throw new Error("Invalid publication: must include valueMoney or cardExchangeIds.");
        }

        if (publicationData.valueMoney)
          publication.setValueMoney(publicationData.valueMoney)

        if (publicationData.cardExchangeIds){
          const cardExchange: Card[] = await Promise.all(
            (cardExchangeIds ?? []).map((id) => this.getCard(id))
          );
          publication.setCardExchange(cardExchange)
        }

        publication.setUpdatedAt(new Date())
        return this.toPublicationResponseDTO(await this.publicationRepository.save(publication))
      }

      public async deletePublication(id: string): Promise<void>{
        
      }

      private toPublicationResponseDTO(publication: Publication): PublicationResponseDTO {
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

    private async getPublicationById(id: string): Promise<Publication> {
      const publication = await this.publicationRepository.findById(id)
      if(!publication){
        throw Error("Publication not found")
        }
      return publication;
    }
}
