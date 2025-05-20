import { SchemaFactory } from './SchemaFactory';
import { BaseModel, IBaseDocument } from './BaseModel';
import { StatusPublication } from '@/domain/entities/StatusPublication';
import { Types } from 'mongoose';

export interface IPublication extends IBaseDocument {
  ownerId: Types.ObjectId;
  cardId: Types.ObjectId;
  valueMoney?: number;
  cardExchangeIds: Types.ObjectId[];
  offerIds: Types.ObjectId[];
  statusPublication: StatusPublication;
}

const publicationSchema = SchemaFactory.createBaseSchema({
  ownerId: { type: Types.ObjectId, ref: 'User', required: true },
  cardId: { type: Types.ObjectId, ref: 'Card', required: true },
  valueMoney: { type: Number },
  cardExchangeIds: [{ type: Types.ObjectId, ref: 'CardBase' }],
  offerIds: [{ type: Types.ObjectId, ref: 'Offer' }],
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
