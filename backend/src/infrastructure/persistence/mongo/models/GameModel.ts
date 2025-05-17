import { SchemaFactory } from './SchemaFactory';
import { BaseModel, IBaseDocument } from './BaseModel';

export interface IGame extends IBaseDocument {
  name: string;
}

const gameSchema = SchemaFactory.createBaseSchema({
  name: { type: String, required: true }
});

const GameModelClass = SchemaFactory.createModel<IGame>('Game', gameSchema);

export class GameModel extends BaseModel<IGame> {
  constructor() {
    super(GameModelClass);
  }
}