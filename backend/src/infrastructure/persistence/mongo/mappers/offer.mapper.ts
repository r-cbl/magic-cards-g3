import { Offer } from "../../../../domain/entities/Offer";
import { User } from "../../../../domain/entities/User";
import { Card } from "../../../../domain/entities/Card";
import { Publication } from "../../../../domain/entities/Publication";

export const OfferMapper = {
  toDocument(offer: Offer) {
    return {
      _id: offer.getId(),
      offerOwnerId: offer.getOfferOwner().getId(),
      cardIds: offer.getCardOffers()?.map(card => card.getId()) || [],
      statusOffer: offer.getStatusOffer(),
      moneyOffer: offer.getMoneyOffer(),
      closedAt: offer.getClosedAt(),
      createdAt: offer.getCreatedAt(),
      updatedAt: offer.getUpdatedAt(),
      publicationId: offer.getPublication().getId(),
    };
  },

  toEntity(
    doc: any,
    owner: User,
    cards: Card[] | undefined,
    publication?: Publication
  ): Offer {
    return new Offer({
      id: doc._id,
      offerOwner: owner,
      cardOffers: cards,
      statusOffer: doc.statusOffer,
      moneyOffer: doc.moneyOffer,
      closedAt: doc.closedAt,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
      publication: publication!,
    });
  },
};
