import { Card } from "../../domain/entities/Card";
import { CardBase } from "../../domain/entities/CardBase";
import { cardBaseRepository, userRepository } from "../../infrastructure/repositories/Container";
import { CardRepository } from "@/domain/repositories/CardRepository";
import { CardFilterDTO, CardResponseDTO, CreateCardDTO } from "../dtos/CardsDTO";
import { UserService } from "./UserService";

export class CardService {
    userService : UserService = new UserService(userRepository);

    constructor(private readonly cardRepository: CardRepository) {}
    public async createCard(cardData: CreateCardDTO): Promise<CardResponseDTO> {
        const user = await this.userService.getSimpleUser(cardData.ownerId);
        const cardBase = await this.getCardBase(cardData.cardBaseId);
      
        const card = new Card({
            owner: user,
            cardBase: cardBase,
            urlImage: cardData.urlImage,
            statusCard: cardData.statusCard
        });

        this.cardRepository.save(card)
        return this.toCardResponseDTO(card);
      }

    public async getAllCards(filters: CardFilterDTO): Promise<CardResponseDTO[]> {
        if(filters.ownerId){
            await this.userService.getSimpleUser(filters.ownerId)
        }

        const filteredCards: Card[] = await this.cardRepository.find(filters);
        return filteredCards.map(card => this.toCardResponseDTO(card));
    }

    public async getCard(id: string): Promise<CardResponseDTO>{
        const card = await this.getSimpleCard(id);
        return this.toCardResponseDTO(card);
    }

    private toCardResponseDTO(card: Card): CardResponseDTO {
        const cardBase = card.getCardBase();
        const game = cardBase.getGame();
        const owner = card.getOwner();

        return {
            id: card.getId(),
            urlImage: card.getUrlImage(),
            cardBase: {
              Id: cardBase.getId(),
              Name: cardBase.getName()
            },
            game: {
                Id: game.getId(),
                Name: game.getName(),
            },
            owner: {
                ownerId: owner.getId(),
                ownerName: owner.getName(),
            },
            createdAt: card.getCreatedAt(),
        };
      }

    public async getSimpleCard(id: string) : Promise<Card> {
        return await this.cardRepository.findById(id);
    }

    private async getCardBase(id: string): Promise<CardBase> {
        const cardBase = await cardBaseRepository.findById(id);
        if (!cardBase) throw new Error("Base Card not found");
        return cardBase;
    }
      
}
