// infrastructure/repository/MongoPublicationRepository.ts
import { PublicationRepository } from "../../../../domain/repositories/PublicationRepository";
import { Publication } from "../../../../domain/entities/Publication";
import { PublicationModel } from "../models/PublicationModel";
import { PublicationMapper } from "../mappers/publication.mapper";
import { PublicationFilterDTO } from "../../../../application/dtos/PublicationDTO";
import { PaginatedResponseDTO, PaginationDTO } from "../../../../application/dtos/PaginationDTO";
import { CardBase } from "../../../../domain/entities/CardBase";
import { Offer } from "../../../../domain/entities/Offer";
import { Types } from 'mongoose';
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
  
    const owner = await userRepository.findById(doc.ownerId.toString());
    const card = await cardRepository.findById(doc.cardId.toString());

    if (!owner || !card) {
      console.warn(`[MongoPublicationRepository] Missing owner or card for publication ${id}`);
      return null;
    }
  
    const cardExchange = doc.cardExchangeIds?.length > 0
      ? (await Promise.all(
        doc.cardExchangeIds.map(
          (id) => cardBaseRepository.findById(id.toString())))).filter((cb: any) => cb) as CardBase[]
      : [];
  
    const offers = doc.offerIds?.length > 0
      ? (await Promise.all(
        doc.offerIds.map(
          (id) => offerRepository.findById(id.toString(), true)))).filter((o: any) => o) as Offer[]
      : [];
    
    return PublicationMapper.toEntity(doc, owner, card, cardExchange, offers);
  }  

  async findAll(): Promise<Publication[]> {
    const docs = await this.publicationModel.findAll();
    const publications: Publication[] = [];

    for (const doc of docs) {
      const pub = await this.findById(doc._id.toString());
      if (pub) publications.push(pub);
    }

    return publications;
  }

  async find(filters: PublicationFilterDTO): Promise<Publication[]> {
    const docs = await this.publicationModel.findWithFilters({
      status: filters.status,
      ownerId: filters.ownerId,
      excludeId: filters.excludeId,
      initialDate: filters.initialDate ? new Date(filters.initialDate) : undefined,
      endDate: filters.endDate ? new Date(filters.endDate) : undefined,
      minValue: filters.minValue,
      maxValue: filters.maxValue
    });
    
    const results: Publication[] = [];
    
    for (const doc of docs) {
      const pub = await this.findById(doc._id.toString());
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
    const query: any = {};
    if (filters.data?.status) query.status = filters.data.status;
    if (filters.data?.ownerId) query.ownerId = filters.data.ownerId;
    if (filters.data?.excludeId) query._id = { $ne: filters.data.excludeId };
    if (filters.data?.initialDate || filters.data?.endDate) {
      query.createdAt = {};
      if (filters.data?.initialDate) query.createdAt.$gte = new Date(filters.data.initialDate);
      if (filters.data?.endDate) query.createdAt.$lte = new Date(filters.data.endDate);
    }
    if (filters.data?.minValue || filters.data?.maxValue) {
      query.value = {};
      if (filters.data?.minValue) query.value.$gte = filters.data.minValue;
      if (filters.data?.maxValue) query.value.$lte = filters.data.maxValue;
    }

    const { docs, total } = await this.publicationModel.findPaginatedWithFilters(
      query,
      filters.offset || 0,
      filters.limit || 10
    );

    const publications: Publication[] = [];
    for (const doc of docs) {
      const pub = await this.findById(doc._id.toString());
      if (!pub) continue;

      const cardBaseId = pub.getCard().getCardBase().getId();
      const gameId = pub.getCard().getCardBase().getGame().getId();

      if (
        (filters.data?.cardBaseIds && !filters.data.cardBaseIds.includes(cardBaseId)) ||
        (filters.data?.gamesIds && !filters.data.gamesIds.includes(gameId))
      ) continue;

      publications.push(pub);
    }

    return {
      data: publications,
      total,
      limit: filters.limit || 10,
      offset: filters.offset || 0,
      hasMore: (filters.offset || 0) + (filters.limit || 10) < total,
    };
  }
}