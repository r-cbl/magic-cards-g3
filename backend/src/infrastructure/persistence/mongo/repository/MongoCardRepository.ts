import { CardRepository } from "../../../../domain/repositories/CardRepository";
import { Card } from "../../../../domain/entities/Card";
import { CardModel } from "../models/CardModel";
import { CardMapper } from "../mappers/card.mapper";
import { PaginationDTO, PaginatedResponseDTO } from "../../../../application/dtos/PaginationDTO";
import { CardFilterDTO } from "../../../../application/dtos/CardsDTO";
import { userRepository, cardBaseRepository } from "../../../../infrastructure/provider/Container";

export class MongoCardRepository implements CardRepository {
  private cardModel: CardModel;

  constructor() {
    this.cardModel = new CardModel();
  }

  async save(card: Card): Promise<Card> {
    const doc = CardMapper.toDocument(card);
    await this.cardModel.create(doc);
    return card;
  }

  async update(card: Card): Promise<Card> {
    const doc = CardMapper.toDocument(card);
    await this.cardModel.update(card.getId(), doc);
    return card;
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.cardModel.delete(id);
    return result !== null;
  }

  async findById(id: string): Promise<Card> {
    const doc = await this.cardModel.findById(id);
    if (!doc) throw new Error(`Card not found (id: ${id})`);
  
    const owner = await userRepository.findById(doc.ownerId);
    if (!owner) throw new Error(`User not found (id: ${doc.ownerId})`);
  
    const cardBase = await cardBaseRepository.findById(doc.cardBaseId);
    if (!cardBase) throw new Error(`CardBase not found (id: ${doc.cardBaseId})`);
  
    return CardMapper.toEntity(doc, owner, cardBase);
  }

  async find(filters: CardFilterDTO): Promise<Card[]> {
    const docs = filters.ownerId 
      ? await this.cardModel.findByOwnerId(filters.ownerId)
      : await this.cardModel.findAll();

    return Promise.all(
      docs.map(async doc => {
        const owner = await userRepository.findById(doc.ownerId);
        const cardBase = await cardBaseRepository.findById(doc.cardBaseId);
        if (!owner || !cardBase) throw new Error("Related entity not found");
        return CardMapper.toEntity(doc, owner, cardBase);
      })
    );
  }

  async findPaginated(filters: PaginationDTO<CardFilterDTO>): Promise<PaginatedResponseDTO<Card>> {
    const query: any = {};
    if (filters.data?.ownerId) {
      query.ownerId = filters.data.ownerId;
    }
    
    const { docs, total } = await this.cardModel.findPaginatedWithFilters(
      query,
      filters.offset || 0,
      filters.limit || 10
    );

    const cards: Card[] = [];
    for (const doc of docs) {
      const owner = await userRepository.findById(doc.ownerId);
      const cardBase = await cardBaseRepository.findById(doc.cardBaseId);
      if (owner && cardBase) {
        cards.push(CardMapper.toEntity(doc, owner, cardBase));
      }
    }

    return {
      data: cards,
      total,
      limit: filters.limit || 10,
      offset: filters.offset || 0,
      hasMore: (filters.offset || 0) + (filters.limit || 10) < total,
    };
  }

  async findByCardsByIds(ids: string[]): Promise<Card[] | undefined> {
    const docs = await this.cardModel.findByIds(ids);
    if (!docs.length) return undefined;

    const cards: Card[] = [];
    for (const doc of docs) {
      const owner = await userRepository.findById(doc.ownerId);
      const cardBase = await cardBaseRepository.findById(doc.cardBaseId);
      if (owner && cardBase) {
        cards.push(CardMapper.toEntity(doc, owner, cardBase));
      }
    }

    return cards.length > 0 ? cards : undefined;
  }
}
