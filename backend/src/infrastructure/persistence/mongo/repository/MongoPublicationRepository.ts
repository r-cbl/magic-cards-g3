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
  private publicationModel: PublicationModel;

  constructor() {
    this.publicationModel = new PublicationModel();
  }

  async save(publication: Publication): Promise<Publication> {
    const doc = PublicationMapper.toDocument(publication);
    await this.publicationModel.create(doc);
    return publication;
  }

  async update(publication: Publication): Promise<Publication> {
    const doc = PublicationMapper.toDocument(publication);
    await this.publicationModel.update(publication.getId(), doc);
    return publication;
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.publicationModel.delete(id);
    return result !== null;
  }

  async findById(id: string): Promise<Publication | null> {
    const doc = await this.publicationModel.findById(id);
    if (!doc) return null;
  
    const owner = await userRepository.findById(doc.ownerId);
    const card = await cardRepository.findById(doc.cardId);

    if (!owner || !card) {
      console.warn(`[MongoPublicationRepository] Missing owner or card for publication ${id}`);
      return null;
    }
  
    const cardExchange = doc.cardExchangeIds?.length > 0
      ? (await Promise.all(doc.cardExchangeIds.map((id: string) => cardBaseRepository.findById(id)))).filter((cb: any) => cb) as CardBase[]
      : [];
  
    const offers = doc.offerIds?.length > 0
      ? (await Promise.all(doc.offerIds.map((id: string) => offerRepository.findById(id, true)))).filter((o: any) => o) as Offer[]
      : [];
    
    return PublicationMapper.toEntity(doc, owner, card, cardExchange, offers);
  }  

  async findAll(): Promise<Publication[]> {
    const docs = await this.publicationModel.findAll();
    const publications: Publication[] = [];

    for (const doc of docs) {
      const pub = await this.findById(doc._id);
      if (pub) publications.push(pub);
    }

    return publications;
  }

  async find(filters: PublicationFilterDTO): Promise<Publication[]> {
    const docs = await this.publicationModel.findAll();
    
    // Apply filters to docs
    let filteredDocs = [...docs];
    
    if (filters.status) {
      filteredDocs = filteredDocs.filter(doc => doc.statusPublication === filters.status);
    }
    
    if (filters.ownerId) {
      filteredDocs = filteredDocs.filter(doc => doc.ownerId === filters.ownerId);
    } else if (filters.excludeId) {
      filteredDocs = filteredDocs.filter(doc => doc.ownerId !== filters.excludeId);
    }
    
    if (filters.initialDate || filters.endDate) {
      filteredDocs = filteredDocs.filter(doc => {
        const createdAt = new Date(doc.createdAt);
        if (filters.initialDate && createdAt < new Date(filters.initialDate)) return false;
        if (filters.endDate && createdAt > new Date(filters.endDate)) return false;
        return true;
      });
    }
    
    if (filters.minValue || filters.maxValue) {
      filteredDocs = filteredDocs.filter(doc => {
        if (!doc.valueMoney) return false;
        if (filters.minValue && doc.valueMoney < filters.minValue) return false;
        if (filters.maxValue && doc.valueMoney > filters.maxValue) return false;
        return true;
      });
    }

    const results: Publication[] = [];
    
    for (const doc of filteredDocs) {
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