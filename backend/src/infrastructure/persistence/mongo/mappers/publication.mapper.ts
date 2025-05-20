import { Publication } from "../../../../domain/entities/Publication";
import { Card } from "../../../../domain/entities/Card";
import { CardBase } from "../../../../domain/entities/CardBase";
import { Offer } from "../../../../domain/entities/Offer";
import { User } from "../../../../domain/entities/User";
import { IPublication } from "../models/PublicationModel";
import { Types } from 'mongoose';

export const PublicationMapper = {
  toDocument(pub: Publication): Partial<IPublication> {
    return {
      _id: new Types.ObjectId(pub.getId()),
      ownerId: new Types.ObjectId(pub.getOwner().getId()),
      cardId: new Types.ObjectId(pub.getCard().getId()),
      cardExchangeIds: pub.getCardExchange()?.map(cb => new Types.ObjectId(cb.getId())) || [],
      offerIds: pub.getOffersExisting()?.map(o => new Types.ObjectId(o.getId())) || [],
      valueMoney: pub.getValueMoney(),
      statusPublication: pub.getStatusPublication()
    };
  },

  toEntity(
    doc: IPublication,
    owner: User,
    card: Card,
    cardExchange: CardBase[],
    offers: Offer[]
  ): Publication {
    return new Publication({
      id: doc._id.toString(),
      statusPublication: doc.statusPublication,
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
