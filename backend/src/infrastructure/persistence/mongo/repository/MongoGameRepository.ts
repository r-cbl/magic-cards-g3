import { Game } from "@/domain/entities/Game";
import { GameRepository } from "@/domain/repositories/GameRepository";
import { GameModel } from "../models/GameModel";
import { toGameEntity, toGameDocument } from "../mappers/game.mapper";
import { PaginationDTO, PaginatedResponseDTO } from "../../../../application/dtos/PaginationDTO";
import { GameFilterDTO } from "../../../../application/dtos/GameDTO";

export class MongoGameRepository implements GameRepository {
  private gameModel: GameModel;

  constructor() {
    this.gameModel = new GameModel();
  }

  async save(game: Game): Promise<Game> {
    await this.gameModel.create(toGameDocument(game));
    return game;
  }

  async update(game: Game): Promise<Game> {
    await this.gameModel.update(game.getId(), toGameDocument(game));
    return game;
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.gameModel.delete(id);
    return result !== null;
  }

  async findById(id: string): Promise<Game | undefined> {
    const doc = await this.gameModel.findById(id);
    return doc ? toGameEntity(doc) : undefined;
  }

  async findByIds(ids: string[]): Promise<Game[]> {
    const docs = await this.gameModel.findByIds(ids);
    return docs.map(toGameEntity);
  }

  async findAll(): Promise<Game[]> {
    const docs = await this.gameModel.findAll();
    return docs.map(toGameEntity);
  }

  async findPaginated(filters: PaginationDTO<GameFilterDTO>): Promise<PaginatedResponseDTO<Game>> {
    const { limit = 10, offset = 0, data } = filters;
    
    const { docs, total } = await this.gameModel.findPaginatedByName(
      data.name,
      offset,
      limit
    );

    return {
      data: docs.map(toGameEntity),
      total,
      limit,
      offset,
      hasMore: offset + limit < total,
    };
  }
}