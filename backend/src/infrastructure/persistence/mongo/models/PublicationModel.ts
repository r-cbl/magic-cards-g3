import { SchemaFactory } from './SchemaFactory';
import { BaseModel, IBaseDocument } from './BaseModel';
import { StatusPublication } from '@/domain/entities/StatusPublication';

export interface IPublication extends IBaseDocument {
  ownerId: string;
  cardId: string;
  valueMoney?: number;
  cardExchangeIds: string[];
  offerIds: string[];
  statusPublication: StatusPublication;
}

const publicationSchema = SchemaFactory.createBaseSchema({
  ownerId: { type: String, required: true },
  cardId: { type: String, required: true },
  valueMoney: { type: Number },
  cardExchangeIds: [{ type: String }],
  offerIds: [{ type: String }],
  statusPublication: { type: String, enum: ['Open', 'Closed'], required: true }
});

const PublicationModelClass = SchemaFactory.createModel<IPublication>('Publication', publicationSchema);

export class PublicationModel extends BaseModel<IPublication> {
  constructor() {
    super(PublicationModelClass);
  }
  
  async findWithFilters(filters: {
    status?: string;
    ownerId?: string;
    excludeId?: string;
    initialDate?: Date;
    endDate?: Date;
    minValue?: number;
    maxValue?: number;
  }): Promise<IPublication[]> {
    const query: any = {};
    
    if (filters.status) {
      query.statusPublication = filters.status;
    }
    
    if (filters.ownerId) {
      query.ownerId = filters.ownerId;
    } else if (filters.excludeId) {
      query.ownerId = { $ne: filters.excludeId };
    }
    
    if (filters.initialDate || filters.endDate) {
      query.createdAt = {};
      if (filters.initialDate) {
        query.createdAt.$gte = filters.initialDate;
      }
      if (filters.endDate) {
        query.createdAt.$lte = filters.endDate;
      }
    }
    
    if (filters.minValue || filters.maxValue) {
      query.valueMoney = {};
      if (filters.minValue) {
        query.valueMoney.$gte = filters.minValue;
      }
      if (filters.maxValue) {
        query.valueMoney.$lte = filters.maxValue;
      }
    }
    
    return this.model.find(query).exec();
  }
}
