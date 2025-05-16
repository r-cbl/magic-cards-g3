import { Game } from "../../../../domain/entities/Game";
import { GameDocument } from "../models/GameModel";

export function toGameEntity(doc: GameDocument): Game {
  return new Game({
    id: doc.id,
    name: doc.name,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  });
}

export function toGameDocument(game: Game): Partial<GameDocument> {
  return {
    id: game.getId(),
    name: game.getName(),
  };
}
