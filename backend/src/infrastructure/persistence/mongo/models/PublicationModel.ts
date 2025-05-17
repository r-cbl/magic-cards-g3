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
}
