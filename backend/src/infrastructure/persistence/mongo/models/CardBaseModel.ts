import { SchemaFactory } from './SchemaFactory';
import { BaseModel, IBaseDocument } from './BaseModel';
import { Types } from 'mongoose';

export interface ICardBase extends IBaseDocument {
  gameId: Types.ObjectId;
  nameCard: string;
}

const cardBaseSchema = SchemaFactory.createBaseSchema({
  gameId: { type: Types.ObjectId, ref: 'Game', required: true },
  nameCard: { type: String, required: true }
});

const CardBaseModelClass = SchemaFactory.createModel<ICardBase>('CardBase', cardBaseSchema);

export class CardBaseModel extends BaseModel<ICardBase> {
  constructor() {
    super(CardBaseModelClass);
  }

  async findByIds(ids: string[]): Promise<ICardBase[]> {
    return this.model.find({ _id: { $in: ids } }).exec();
  }

  async findByGameId(gameId: string): Promise<ICardBase[]> {
    return this.model.find({ gameId }).exec();
  }

  async findPaginatedWithFilters(
    filters: { gameId?: string; nameCard?: string },
    offset: number = 0,
    limit: number = 10
  ): Promise<{ docs: ICardBase[]; total: number }> {
    const query: any = {};
    
    if (filters.gameId) {
      query.gameId = filters.gameId;
    }
    
    if (filters.nameCard) {
      query.nameCard = { $regex: filters.nameCard, $options: 'i' };
    }
    
    const total = await this.model.countDocuments(query);
    const docs = await this.model.find(query).skip(offset).limit(limit).exec();
    
    return { docs, total };
  }
}
