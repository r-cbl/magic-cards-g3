import { SchemaFactory } from './SchemaFactory';
import { BaseModel, IBaseDocument } from './BaseModel';
import { StatusOffer } from '@/domain/entities/StatusOffer';

export interface IOffer extends IBaseDocument {
  offerOwnerId: string;
  cardIds: string[];
  statusOffer: StatusOffer;
  moneyOffer?: number;
  closedAt?: Date;
  publicationId: string;
}

const offerSchema = SchemaFactory.createBaseSchema({
  offerOwnerId: { type: String, required: true },
  cardIds: [{ type: String }],
  statusOffer: { type: String, enum: ['draft', 'pending', 'accepted', 'rejected'], required: true },
  moneyOffer: { type: Number },
  closedAt: { type: Date },
  publicationId: { type: String, required: true }
});

const OfferModelClass = SchemaFactory.createModel<IOffer>('Offer', offerSchema);

export class OfferModel extends BaseModel<IOffer> {
  constructor() {
    super(OfferModelClass);
  }
  
  async findWithFilters(filters: {
    ownerId?: string;
    status?: string;
    publicationId?: string;
  }): Promise<IOffer[]> {
    const query: any = {};
    
    if (filters.ownerId) {
      query.offerOwnerId = filters.ownerId;
    }
    
    if (filters.status) {
      query.statusOffer = filters.status;
    }
    
    if (filters.publicationId) {
      query.publicationId = filters.publicationId;
    }
    
    return this.model.find(query).exec();
  }
}
