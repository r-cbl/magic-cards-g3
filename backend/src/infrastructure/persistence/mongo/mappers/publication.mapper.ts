import { Publication } from "../../../../domain/entities/Publication";
import { Card } from "../../../../domain/entities/Card";
import { CardBase } from "../../../../domain/entities/CardBase";
import { Offer } from "../../../../domain/entities/Offer";
import { User } from "../../../../domain/entities/User";

export const PublicationMapper = {
  toDocument(pub: Publication) {
    return {
      _id: pub.getId(),
      ownerId: pub.getOwner().getId(),
      cardId: pub.getCard().getId(),
      cardExchangeIds: pub.getCardExchange()?.map(cb => cb.getId()) || [],
      offerIds: pub.getOffersExisting()?.map(o => o.getId()) || [],
      valueMoney: pub.getValueMoney(),
      statusPublication: pub.getStatusPublication(),
      createdAt: pub.getCreatedAt(),
      updatedAt: pub.getUpdatedAt()
    };
  },

  toEntity(
    doc: any,
    owner: User,
    card: Card,
    cardExchange: CardBase[],
    offers: Offer[]
  ): Publication {
    return new Publication({
      id: doc._id,
      owner,
      card,
      cardExchange,
      offersExisting: offers,
      valueMoney: doc.valueMoney,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt
    });
  }
};
