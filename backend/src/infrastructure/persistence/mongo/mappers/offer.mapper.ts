import { Offer } from "../../../../domain/entities/Offer";
import { User } from "../../../../domain/entities/User";
import { Card } from "../../../../domain/entities/Card";
import { Publication } from "../../../../domain/entities/Publication";
import { IOffer } from "../models/OfferModel";
import { Types } from "mongoose";

export const OfferMapper = {
  toDocument(offer: Offer): Partial<IOffer> {
    return {
      _id: new Types.ObjectId(offer.getId()),
      offerOwnerId: new Types.ObjectId(offer.getOfferOwner().getId()),
      cardIds: offer.getCardOffers()?.map(card => new Types.ObjectId(card.getId())) || [],
      statusOffer: offer.getStatusOffer(),
      moneyOffer: offer.getMoneyOffer(),
      closedAt: offer.getClosedAt(),
      publicationId: new Types.ObjectId(offer.getPublication().getId())
    };
  },

  toEntity(
    doc: IOffer,
    owner: User,
    cards: Card[] | undefined,
    publication?: Publication
  ): Offer {
    return new Offer({
      id: doc._id.toString(),
      offerOwner: owner,
      cardOffers: cards,
      statusOffer: doc.statusOffer,
      moneyOffer: doc.moneyOffer,
      closedAt: doc.closedAt,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
      publication: publication!
    });
  },
};
