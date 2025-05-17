import { Game } from "../../../../domain/entities/Game";
import { IGame } from "../models/GameModel";

export function toGameEntity(doc: IGame): Game {
  return new Game({
    id: doc._id,
    name: doc.name,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  });
}

export function toGameDocument(game: Game): Partial<IGame> {
  return {
    _id: game.getId(),
    name: game.getName()
  };
}
