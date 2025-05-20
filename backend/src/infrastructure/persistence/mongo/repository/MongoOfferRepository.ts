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
import { Types } from "mongoose";
import { CardBaseMapper } from "../mappers/cardBase.mapper";
import { CardBase } from "@/domain/entities/CardBase";

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
  
    const owner = await userRepository.findById(doc.offerOwnerId.toString());
    if (!owner) return null;
  
    const cards = doc.cardIds?.length
      ? await cardRepository.findByCardsByIds(doc.cardIds.map(id => id.toString()))
      : [];
  
    const publication = skipPublication
      ? undefined
      : await publicationRepository.findById(doc.publicationId.toString());
  
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
      const offer = await this.findById(doc._id.toString());
      if (offer) {
        if (!filters.userId || offer.getPublication().getOwner().getId() === filters.userId) {
          offers.push(offer);
        }
      }
    }

    return offers;
  }

  async findPaginated(filters: PaginationDTO<OfferFilterDTO>): Promise<PaginatedResponseDTO<Offer>> {
    const matchConditions: any = {};
    
    if (filters.data?.userId) {
      matchConditions["publication.ownerId"] = new Types.ObjectId(filters.data.userId);
    }
    if (filters.data?.ownerId) {
      matchConditions.offerOwnerId = new Types.ObjectId(filters.data.ownerId);
    }
    if (filters.data?.status) {
      matchConditions.statusOffer = filters.data.status;
    }
    if (filters.data?.publicationId) {
      matchConditions.publicationId = new Types.ObjectId(filters.data.publicationId);
    }


    const { docs, total } = await this.offerModel.aggregatePaginated({
      lookups: [
        {
          from: "publications",
          localField: "publicationId",
          foreignField: "_id",
          as: "publication",
          unwind: true,
          preserveNullAndEmptyArrays: true
        }
      ],
      match: matchConditions,
      sort: { createdAt: -1 },
      offset: filters.offset || 0,
      limit: filters.limit || 10
    });

    console.log('docs', docs);
    const offers: Offer[] = [];
    for (const doc of docs) {
      const publication = await publicationRepository.findById(doc.publicationId.toString());
      const owner = await userRepository.findById(doc.offerOwnerId.toString());
      const cards = await cardRepository.findByCardsByIds(doc.cardIds.map(id => id.toString()));
      if (publication && owner && cards) {
        offers.push(OfferMapper.toEntity(doc, owner, cards, publication));
      }
    }

    return {
      data: offers,
      total,
      limit: filters.limit || 10,
      offset: filters.offset || 0,
      hasMore: (filters.offset || 0) + (filters.limit || 10) < total,
    };
  }

  async findByOffersByIds(ids: string[]): Promise<Offer[] | undefined> {
    // Use Mongoose query instead of in-memory filtering
    const docs = await this.offerModel.findByIds(ids);
    if (!docs.length) return undefined;
    
    const offers: Offer[] = [];
    for (const doc of docs) {
      const offer = await this.findById(doc._id.toString());
      if (offer) offers.push(offer);
    }

    return offers.length ? offers : undefined;
  }
}