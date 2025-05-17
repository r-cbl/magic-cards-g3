import { OfferRepository } from "../../../../domain/repositories/OfferRepository";
import { Offer } from "../../../../domain/entities/Offer";
import { OfferModel } from "../models/OfferModel";
import { OfferMapper } from "../mappers/offer.mapper";
import { OfferFilterDTO } from "../../../../application/dtos/OfferDTO";
import { PaginatedResponseDTO, PaginationDTO } from "../../../../application/dtos/PaginationDTO";

import {
  userRepository,
  cardRepository,
  publicationRepository
} from "../../../../infrastructure/provider/Container";

export class MongoOfferRepository implements OfferRepository {
  private offerModel: OfferModel;

  constructor() {
    this.offerModel = new OfferModel();
  }

  async save(offer: Offer): Promise<Offer> {
    const doc = OfferMapper.toDocument(offer);
    await this.offerModel.create(doc);
    return offer;
  }

  async update(offer: Offer): Promise<Offer> {
    const doc = OfferMapper.toDocument(offer);
    await this.offerModel.update(offer.getId(), doc);
    return offer;
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.offerModel.delete(id);
    return result !== null;
  }

  async findById(id: string, skipPublication = false): Promise<Offer | null> {
    const doc = await this.offerModel.findById(id);
    if (!doc) return null;
  
    const owner = await userRepository.findById(doc.offerOwnerId);
    if (!owner) return null;
  
    const cards = doc.cardIds?.length
      ? await cardRepository.findByCardsByIds(doc.cardIds)
      : [];
  
    const publication = skipPublication
      ? undefined
      : await publicationRepository.findById(doc.publicationId);
  
    if (!skipPublication && !publication) return null;
  
    return OfferMapper.toEntity(doc, owner, cards || [], publication || undefined);
  }

  async find(filters: OfferFilterDTO): Promise<Offer[]> {
    // Use Mongoose query instead of in-memory filtering
    const docs = await this.offerModel.findWithFilters({
      ownerId: filters.ownerId,
      status: filters.status,
      publicationId: filters.publicationId
    });

    const offers: Offer[] = [];

    for (const doc of docs) {
      const offer = await this.findById(doc._id);
      if (offer) {
        if (!filters.userId || offer.getPublication().getOwner().getId() === filters.userId) {
          offers.push(offer);
        }
      }
    }

    return offers;
  }

  async findPaginated(filters: PaginationDTO<OfferFilterDTO>): Promise<PaginatedResponseDTO<Offer>> {
    const filteredOffers = await this.find(filters.data);
    const total = filteredOffers.length;
    const offset = filters.offset || 0;
    const limit = filters.limit || 10;
    const data = filteredOffers.slice(offset, offset + limit);

    return {
      data,
      total,
      limit,
      offset,
      hasMore: offset + limit < total,
    };
  }

  async findByOffersByIds(ids: string[]): Promise<Offer[] | undefined> {
    // Use Mongoose query instead of in-memory filtering
    const docs = await this.offerModel.findByIds(ids);
    if (!docs.length) return undefined;
    
    const offers: Offer[] = [];
    for (const doc of docs) {
      const offer = await this.findById(doc._id);
      if (offer) offers.push(offer);
    }

    return offers.length ? offers : undefined;
  }
}