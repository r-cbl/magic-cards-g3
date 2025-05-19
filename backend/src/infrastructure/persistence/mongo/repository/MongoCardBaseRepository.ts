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
    const game = await gameRepository.findById(doc.gameId.toString());
    if (!game) return undefined;
    return CardBaseMapper.toEntity(doc, game);
  }

  async findByCardsByIds(ids: string[]): Promise<CardBase[] | undefined> {
    const docs = await this.cardBaseModel.findByIds(ids);
    if (!docs.length) return undefined;
    
    const gameIds = [...new Set(docs.map(doc => doc.gameId.toString()))];
    const games = await gameRepository.findByIds(gameIds);
    const gameMap = new Map(games.map(game => [game.getId(), game]));
    
    const cards = docs
      .map(doc => {
        const game = gameMap.get(doc.gameId.toString());
        return game ? CardBaseMapper.toEntity(doc, game) : null;
      })
      .filter((card): card is CardBase => card !== null);
    
    return cards.length ? cards : undefined;
  }

  async findByGame(game: Game): Promise<CardBase[]> {
    const docs = await this.cardBaseModel.findByGameId(game.getId());
    return docs.map(doc => CardBaseMapper.toEntity(doc, game));
  }

  async findAll(): Promise<CardBase[]> {
    const docs = await this.cardBaseModel.findAll();
    const gameIds = [...new Set(docs.map(doc => doc.gameId.toString()))];
    const games = await gameRepository.findByIds(gameIds);
    const gameMap = new Map(games.map(game => [game.getId(), game]));
    
    return docs
      .map(doc => {
        const game = gameMap.get(doc.gameId.toString());
        return game ? CardBaseMapper.toEntity(doc, game) : null;
      })
      .filter((card): card is CardBase => card !== null);
  }

  async findPaginated(filters: PaginationDTO<CardBaseFilterDTO>): Promise<PaginatedResponseDTO<CardBase>> {
    const { docs, total } = await this.cardBaseModel.findPaginatedWithFilters(
      {
        gameId: filters.data?.gameId,
        nameCard: filters.data?.nameCard
      },
      filters.offset || 0,
      filters.limit || 10
    );
    
    const gameIds = [...new Set(docs.map(doc => doc.gameId.toString()))];
    const games = await gameRepository.findByIds(gameIds);
    const gameMap = new Map(games.map(game => [game.getId(), game]));
    
    const cards = docs
      .map(doc => {
        const game = gameMap.get(doc.gameId.toString());
        return game ? CardBaseMapper.toEntity(doc, game) : null;
      })
      .filter((card): card is CardBase => card !== null);

    return {
      data: cards,
      total,
      limit: filters.limit || 10,
      offset: filters.offset || 0,
      hasMore: (filters.offset || 0) + (filters.limit || 10) < total,
    };
  }
}