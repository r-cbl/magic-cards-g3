// infrastructure/repository/MongoPublicationRepository.ts
import { PublicationRepository } from "../../../../domain/repositories/PublicationRepository";
import { Publication } from "../../../../domain/entities/Publication";
import { PublicationModel } from "../models/PublicationModel";
import { PublicationMapper } from "../mappers/publication.mapper";
import { PublicationFilterDTO } from "../../../../application/dtos/PublicationDTO";
import { PaginatedResponseDTO, PaginationDTO } from "../../../../application/dtos/PaginationDTO";
import { CardBase } from "../../../../domain/entities/CardBase";
import { Offer } from "../../../../domain/entities/Offer";
import {
  userRepository,
  cardRepository,
  cardBaseRepository,
  offerRepository,
} from "../../../../infrastructure/provider/Container";

export class MongoPublicationRepository implements PublicationRepository {
  async save(publication: Publication): Promise<Publication> {
    const doc = PublicationMapper.toDocument(publication);
    await PublicationModel.create(doc);
    return publication;
  }

  async update(publication: Publication): Promise<Publication> {
    const doc = PublicationMapper.toDocument(publication);
    await PublicationModel.findByIdAndUpdate(publication.getId(), doc);
    return publication;
  }

  async delete(id: string): Promise<boolean> {
    const res = await PublicationModel.deleteOne({ _id: id });
    return res.deletedCount > 0;
  }

  async findById(id: string): Promise<Publication | null> {
    const doc = await PublicationModel.findById(id).lean();
    if (!doc) return null;
  
    const owner = await userRepository.findById(doc.ownerId);
    const card = await cardRepository.findById(doc.cardId);

    if (!owner || !card) {
      console.warn(`[MongoPublicationRepository] Missing owner or card for publication ${id}`);
      return null;
    }
  
    const cardExchange = doc.cardExchangeIds?.length > 0
      ? (await Promise.all(doc.cardExchangeIds.map(id => cardBaseRepository.findById(id)))).filter(cb => cb) as CardBase[]
      : [];
  
      const offers = doc.offerIds?.length > 0
      ? (await Promise.all(doc.offerIds.map(id => offerRepository.findById(id, true)))).filter(o => o) as Offer[]
      : [];
    
  
    return PublicationMapper.toEntity(doc, owner, card, cardExchange, offers);
  }  

  async findAll(): Promise<Publication[]> {
    const docs = await PublicationModel.find().lean();
    const publications: Publication[] = [];

    for (const doc of docs) {
      const pub = await this.findById(doc._id);
      if (pub) publications.push(pub);
    }

    return publications;
  }

  async find(filters: PublicationFilterDTO): Promise<Publication[]> {
    const query: any = {};
  
    if (filters.status) query.statusPublication = filters.status;
  
    if (filters.ownerId) {
      query.ownerId = filters.ownerId;
    } else if (filters.excludeId) {
      query.ownerId = { $ne: filters.excludeId };
    }
  
    if (filters.initialDate || filters.endDate) {
      query.createdAt = {};
      if (filters.initialDate) query.createdAt.$gte = filters.initialDate;
      if (filters.endDate) query.createdAt.$lte = filters.endDate;
    }
  
    if (filters.minValue || filters.maxValue) {
      query.valueMoney = {};
      if (filters.minValue) query.valueMoney.$gte = filters.minValue;
      if (filters.maxValue) query.valueMoney.$lte = filters.maxValue;
    }
  
    const docs = await PublicationModel.find(query).lean();

    const results: Publication[] = [];
    
    for (const doc of docs) {
        const pub = await this.findById(doc._id);
        if (!pub) continue;
    
        const cardBaseId = pub.getCard().getCardBase().getId();
        const gameId = pub.getCard().getCardBase().getGame().getId();
    
        if (
          (filters.cardBaseIds && !filters.cardBaseIds.includes(cardBaseId)) ||
          (filters.gamesIds && !filters.gamesIds.includes(gameId))
        ) continue;
    
        results.push(pub);
      }

    return results;
  }
  

  async findPaginated(filters: PaginationDTO<PublicationFilterDTO>): Promise<PaginatedResponseDTO<Publication>> {
    const all = await this.find(filters.data);
    const total = all.length;
    const offset = filters.offset || 0;
    const limit = filters.limit || 10;
    const data = all.slice(offset, offset + limit);

    return {
      data,
      total,
      limit,
      offset,
      hasMore: offset + limit < total,
    };
  }
}
