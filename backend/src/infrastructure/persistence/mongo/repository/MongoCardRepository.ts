import { CardRepository } from "../../../../domain/repositories/CardRepository";
import { Card } from "../../../../domain/entities/Card";
import { CardModel } from "../models/CardModel";
import { CardMapper } from "../mappers/card.mapper";
import { PaginationDTO, PaginatedResponseDTO } from "../../../../application/dtos/PaginationDTO";
import { CardFilterDTO } from "../../../../application/dtos/CardsDTO";
import { userRepository, cardBaseRepository } from "../../../../infrastructure/provider/Container";

export class MongoCardRepository implements CardRepository {
  async save(card: Card): Promise<Card> {
    const doc = CardMapper.toDocument(card);
    await CardModel.create(doc);
    return card;
  }

  async update(card: Card): Promise<Card> {
    const doc = CardMapper.toDocument(card);
    await CardModel.findByIdAndUpdate(card.getId(), doc);
    return card;
  }

  async delete(id: string): Promise<boolean> {
    const result = await CardModel.deleteOne({ _id: id });
    return result.deletedCount > 0;
  }

  async findById(id: string): Promise<Card> {
    const doc = await CardModel.findById(id).lean();
    if (!doc) throw new Error(`Card not found (id: ${id})`);
  
    const owner = await userRepository.findById(doc.ownerId);
    if (!owner) throw new Error(`User not found (id: ${doc.ownerId})`);
  
    const cardBase = await cardBaseRepository.findById(doc.cardBaseId);
    if (!cardBase) throw new Error(`CardBase not found (id: ${doc.cardBaseId})`);
  
    return CardMapper.toEntity(doc, owner, cardBase);
  }
  

  async find(filters: CardFilterDTO): Promise<Card[]> {
    const query: any = {};
    if (filters.ownerId) query.ownerId = filters.ownerId;

    const docs = await CardModel.find(query).lean();
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
    if (filters.data?.ownerId) query.ownerId = filters.data.ownerId;

    const total = await CardModel.countDocuments(query);
    const docs = await CardModel.find(query)
      .skip(filters.offset || 0)
      .limit(filters.limit || 10)
      .lean();

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
    const docs = await CardModel.find({ _id: { $in: ids } }).lean();

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
