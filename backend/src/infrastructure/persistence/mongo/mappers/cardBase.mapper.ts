import { CardBase } from "../../../../domain/entities/CardBase";
import { Game } from "../../../../domain/entities/Game";
import { ICardBase } from "../models/CardBaseModel";
import { Types } from 'mongoose';

export const CardBaseMapper = {
  toDocument(card: CardBase): Partial<ICardBase> {
    return {
      _id: new Types.ObjectId(card.getId()),
      gameId: new Types.ObjectId(card.getGame().getId()),
      nameCard: card.getName()
    };
  },

  toEntity(doc: ICardBase, game: Game): CardBase {
    return new CardBase({
      id: doc._id.toString(),
      game,
      nameCard: doc.nameCard,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  },
};
