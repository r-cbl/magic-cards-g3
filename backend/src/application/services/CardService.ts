import { Card } from "../../domain/entities/Card";
import { cardBaseRepository, gameRepository, userRepository, statisticsRepository } from "../../infrastructure/repositories/Container";
import { CardRepository } from "../../domain/repositories/CardRepository";
import { CardFilterDTO, CardResponseDTO, CardUpdatedDTO, CreateCardDTO } from "../dtos/CardsDTO";
import { UserService } from "./UserService";
import { CardBaseService } from "./CardBaseService";
import { Statistic, StatisticType } from "../../domain/entities/Stadistics";

export class CardService {
    userService : UserService = new UserService(userRepository);
    cardBaseService : CardBaseService = new CardBaseService(cardBaseRepository, gameRepository);

    constructor(private readonly cardRepository: CardRepository) {}
    public async createCard(cardData: CreateCardDTO): Promise<CardResponseDTO> {
        const user = await this.userService.getSimpleUser(cardData.ownerId);
        const cardBase = await this.cardBaseService.getSimpleCardBase(cardData.cardBaseId);
      
        const card = new Card({
            owner: user,
            cardBase: cardBase,
            urlImage: cardData.urlImage,
            statusCard: cardData.statusCard
        });

        this.cardRepository.save(card)
        await statisticsRepository.increment(new Statistic(StatisticType.CARDS_TOTAL, new Date(), 1));
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

    public async updateCard(id: string, cardData: CardUpdatedDTO): Promise<CardResponseDTO>{
        const card = await this.getSimpleCard(id);
        const user = await this.userService.getSimpleUser(cardData.ownerId);

        if(user) card.setOwner(user);
        if(cardData.statusCard) card.setStatusCard(cardData.statusCard);
        if(cardData.urlImage) card.setUrlImage(cardData.urlImage);

        card.validateOwnership(user,"publication")
      
        card.setUpdatedAt(new Date())
        return this.toCardResponseDTO(await this.cardRepository.update(card))
    }
  
    public async deleteCard(userId: string, id: string): Promise<boolean>{
        const card = await this.getSimpleCard(id);
        const user = await this.userService.getSimpleUser(userId)
        
        card.validateOwnership(user, "publication");

        return this.cardRepository.delete(id);
    }

    public async getSimpleCard(id: string) : Promise<Card> {
        return await this.cardRepository.findById(id);
    }
    
      
}
