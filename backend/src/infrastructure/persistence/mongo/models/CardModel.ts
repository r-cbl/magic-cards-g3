import { SchemaFactory } from './SchemaFactory';
import { BaseModel, IBaseDocument } from './BaseModel';

export interface ICard extends IBaseDocument {
  ownerId: string;
  cardBaseId: string;
  statusCard: number;
  urlImage?: string;
}

const cardSchema = SchemaFactory.createBaseSchema({
  ownerId: { type: String, required: true },
  cardBaseId: { type: String, required: true },
  statusCard: { type: Number, required: true },
  urlImage: { type: String }
});

const CardModelClass = SchemaFactory.createModel<ICard>('Card', cardSchema);

export class CardModel extends BaseModel<ICard> {
  constructor() {
    super(CardModelClass);
  }
}
