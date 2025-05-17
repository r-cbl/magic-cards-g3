import { SchemaFactory } from './SchemaFactory';
import { BaseModel, IBaseDocument } from './BaseModel';

export interface ICardBase extends IBaseDocument {
  gameId: string;
  nameCard: string;
}

const cardBaseSchema = SchemaFactory.createBaseSchema({
  gameId: { type: String, required: true },
  nameCard: { type: String, required: true }
});

const CardBaseModelClass = SchemaFactory.createModel<ICardBase>('CardBase', cardBaseSchema);

export class CardBaseModel extends BaseModel<ICardBase> {
  constructor() {
    super(CardBaseModelClass);
  }
}
