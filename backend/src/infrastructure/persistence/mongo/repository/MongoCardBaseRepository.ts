import { CardBaseRepository } from "../../../../domain/repositories/CardBaseRepository";
import { CardBase } from "../../../../domain/entities/CardBase";
import { Game } from "../../../../domain/entities/Game";
import { CardBaseFilterDTO } from "../../../../application/dtos/CardBaseDTO";
import { PaginationDTO, PaginatedResponseDTO } from "../../../../application/dtos/PaginationDTO";
import { CardBaseModel } from "../models/CardBaseModel";
import { CardBaseMapper } from "../mappers/cardBase.mapper";
import { gameRepository } from "../../../../infrastructure/provider/Container";

export class MongoCardBaseRepository implements CardBaseRepository {

  async save(card: CardBase): Promise<CardBase> {
    const doc = CardBaseMapper.toDocument(card);
    await CardBaseModel.create(doc);
    return card;
  }

  async update(card: CardBase): Promise<CardBase> {
    const doc = CardBaseMapper.toDocument(card);
    await CardBaseModel.findByIdAndUpdate(doc._id, doc);
    return card;
  }

  async delete(id: string): Promise<boolean> {
    const res = await CardBaseModel.deleteOne({ _id: id });
    return res.deletedCount > 0;
  }

  async findById(id: string): Promise<CardBase | undefined> {
    const doc = await CardBaseModel.findById(id).lean();
    if (!doc) return undefined;
    const game = await gameRepository.findById(doc.gameId);
    if (!game) return undefined;
    return CardBaseMapper.toEntity(doc, game);
  }

  async findByCardsByIds(ids: string[]): Promise<CardBase[] | undefined> {
    const docs = await CardBaseModel.find({ _id: { $in: ids } }).lean();
    const gamesMap = new Map<string, Game>();
    const cards: CardBase[] = [];

    for (const doc of docs) {
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
    const docs = await CardBaseModel.find({ gameId: game.getId() }).lean();
    return docs.map(doc => CardBaseMapper.toEntity(doc, game));
  }

  async findAll(): Promise<CardBase[]> {
    const docs = await CardBaseModel.find().lean();
    const cards: CardBase[] = [];
    for (const doc of docs) {
      const game = await gameRepository.findById(doc.gameId);
      if (game) cards.push(CardBaseMapper.toEntity(doc, game));
    }
    return cards;
  }

  async findPaginated(filters: PaginationDTO<CardBaseFilterDTO>): Promise<PaginatedResponseDTO<CardBase>> {
    const query: any = {};
    if (filters.data?.gameId) query.gameId = filters.data.gameId;
    if (filters.data?.nameCard) query.nameCard = { $regex: filters.data.nameCard, $options: "i" };

    const total = await CardBaseModel.countDocuments(query);
    const docs = await CardBaseModel.find(query)
      .skip(filters.offset || 0)
      .limit(filters.limit || 10)
      .lean();

    const cards: CardBase[] = [];
    for (const doc of docs) {
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
