import { Card } from "../../../../domain/entities/Card";
import { CardBase } from "../../../../domain/entities/CardBase";
import { User } from "../../../../domain/entities/User";
import { ICard } from "../models/CardModel";

export const CardMapper = {
  toDocument(card: Card): Partial<ICard> {
    return {
      _id: card.getId(),
      cardBaseId: card.getCardBase().getId(),
      ownerId: card.getOwner().getId(),
      statusCard: card.getStatusCard(),
      urlImage: card.getUrlImage()
    };
  },

  toEntity(doc: ICard, owner: User, cardBase: CardBase): Card {
    return new Card({
      id: doc._id,
      owner,
      cardBase,
      statusCard: doc.statusCard,
      urlImage: doc.urlImage,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  },
};
