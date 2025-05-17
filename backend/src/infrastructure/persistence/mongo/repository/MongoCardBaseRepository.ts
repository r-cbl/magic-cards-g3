import { CardBaseRepository } from "../../../../domain/repositories/CardBaseRepository";
import { CardBase } from "../../../../domain/entities/CardBase";
import { Game } from "../../../../domain/entities/Game";
import { CardBaseFilterDTO } from "../../../../application/dtos/CardBaseDTO";
import { PaginationDTO, PaginatedResponseDTO } from "../../../../application/dtos/PaginationDTO";
import { CardBaseModel } from "../models/CardBaseModel";
import { CardBaseMapper } from "../mappers/cardBase.mapper";
import { gameRepository } from "../../../../infrastructure/provider/Container";

export class MongoCardBaseRepository implements CardBaseRepository {
  private cardBaseModel: CardBaseModel;

  constructor() {
    this.cardBaseModel = new CardBaseModel();
  }

  async save(card: CardBase): Promise<CardBase> {
    const doc = CardBaseMapper.toDocument(card);
    await this.cardBaseModel.create(doc);
    return card;
  }

  async update(card: CardBase): Promise<CardBase> {
    const doc = CardBaseMapper.toDocument(card);
    await this.cardBaseModel.update(card.getId(), doc);
    return card;
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.cardBaseModel.delete(id);
    return result !== null;
  }

  async findById(id: string): Promise<CardBase | undefined> {
    const doc = await this.cardBaseModel.findById(id);
    if (!doc) return undefined;
    const game = await gameRepository.findById(doc.gameId);
    if (!game) return undefined;
    return CardBaseMapper.toEntity(doc, game);
  }

  async findByCardsByIds(ids: string[]): Promise<CardBase[] | undefined> {
    const docs = await this.cardBaseModel.findAll();
    const filteredDocs = docs.filter(doc => ids.includes(doc._id));
    const gamesMap = new Map<string, Game>();
    const cards: CardBase[] = [];

    for (const doc of filteredDocs) {
      let game = gamesMap.get(doc.gameId);
      if (!game) {
        game = await gameRepository.findById(doc.gameId);
        if (game) gamesMap.set(doc.gameId, game);
      }
      if (game) {
        cards.push(CardBaseMapper.toEntity(doc, game));
      }
    }
    return cards.length ? cards : undefined;
  }

  async findByGame(game: Game): Promise<CardBase[]> {
    const docs = await this.cardBaseModel.findAll();
    const filteredDocs = docs.filter(doc => doc.gameId === game.getId());
    return filteredDocs.map(doc => CardBaseMapper.toEntity(doc, game));
  }

  async findAll(): Promise<CardBase[]> {
    const docs = await this.cardBaseModel.findAll();
    const cards: CardBase[] = [];
    for (const doc of docs) {
      const game = await gameRepository.findById(doc.gameId);
      if (game) cards.push(CardBaseMapper.toEntity(doc, game));
    }
    return cards;
  }

  async findPaginated(filters: PaginationDTO<CardBaseFilterDTO>): Promise<PaginatedResponseDTO<CardBase>> {
    const docs = await this.cardBaseModel.findAll();
    
    // Apply filters
    let filteredDocs = [...docs];
    if (filters.data?.gameId) {
      filteredDocs = filteredDocs.filter(doc => doc.gameId === filters.data.gameId);
    }
    if (filters.data?.nameCard) {
      const regex = new RegExp(filters.data.nameCard, 'i');
      filteredDocs = filteredDocs.filter(doc => regex.test(doc.nameCard));
    }

    const total = filteredDocs.length;
    const paginatedDocs = filteredDocs.slice(
      filters.offset || 0,
      (filters.offset || 0) + (filters.limit || 10)
    );

    const cards: CardBase[] = [];
    for (const doc of paginatedDocs) {
      const game = await gameRepository.findById(doc.gameId);
      if (game) cards.push(CardBaseMapper.toEntity(doc, game));
    }

    return {
      data: cards,
      total,
      limit: filters.limit || 10,
      offset: filters.offset || 0,
      hasMore: (filters.offset || 0) + (filters.limit || 10) < total,
    };
  }
}