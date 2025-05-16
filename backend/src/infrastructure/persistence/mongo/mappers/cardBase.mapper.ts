import { CardBase } from "../../../../domain/entities/CardBase";
import { Game } from "../../../../domain/entities/Game";

export const CardBaseMapper = {
  toDocument(card: CardBase) {
    return {
      _id: card.getId(),
      gameId: card.getGame().getId(),
      nameCard: card.getName(),
      createdAt: card.getCreatedAt(),
      updatedAt: card.getUpdatedAt(),
    };
  },

  toEntity(doc: any, game: Game): CardBase {
    return new CardBase({
      id: doc._id,
      game,
      nameCard: doc.nameCard,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  },
};
