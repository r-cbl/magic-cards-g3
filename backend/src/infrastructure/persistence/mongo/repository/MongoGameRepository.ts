import { Game } from "@/domain/entities/Game";
import { GameRepository } from "@/domain/repositories/GameRepository";
import { GameModel } from "../models/GameModel";
import { toGameEntity, toGameDocument } from "../mappers/game.mapper";
import { PaginationDTO, PaginatedResponseDTO } from "../../../../application/dtos/PaginationDTO";
import { GameFilterDTO } from "../../../../application/dtos/GameDTO";

export class MongoGameRepository implements GameRepository {
  async save(game: Game): Promise<Game> {
    await GameModel.create(toGameDocument(game));
    return game;
  }

  async update(game: Game): Promise<Game> {
    await GameModel.updateOne({ id: game.getId() }, toGameDocument(game));
    return game;
  }

  async delete(id: string): Promise<boolean> {
    const result = await GameModel.deleteOne({ id });
    return result.deletedCount > 0;
  }

  async findById(id: string): Promise<Game | undefined> {
    const doc = await GameModel.findOne({ id });
    return doc ? toGameEntity(doc) : undefined;
  }

  async findAll(): Promise<Game[]> {
    const docs = await GameModel.find();
    return docs.map(toGameEntity);
  }

  async findPaginated(filters: PaginationDTO<GameFilterDTO>): Promise<PaginatedResponseDTO<Game>> {
    const { limit = 10, offset = 0, data } = filters;
    const query: any = {};

    if (data.name) {
      query.name = { $regex: data.name, $options: "i" };
    }

    const total = await GameModel.countDocuments(query);
    const docs = await GameModel.find(query).skip(offset).limit(limit);
    const hasMore = offset + limit < total;

    return {
      data: docs.map(toGameEntity),
      total,
      limit,
      offset,
      hasMore,
    };
  }
}
