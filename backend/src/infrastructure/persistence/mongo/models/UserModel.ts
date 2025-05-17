import { SchemaFactory } from './SchemaFactory';
import { BaseModel, IBaseDocument } from './BaseModel';
import { Role } from "../../../../domain/entities/Role";

export interface IUser extends IBaseDocument {
  name: string;
  email: string;
  password: string;
  role: Role;
}

const userSchema = SchemaFactory.createBaseSchema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: Object.values(Role), default: Role.USER }
});

const UserModelClass = SchemaFactory.createModel<IUser>('User', userSchema);

export class UserModel extends BaseModel<IUser> {
  constructor() {
    super(UserModelClass);
  }
   
  async findByEmail(email: string): Promise<IUser | null> {
    return this.model.findOne({ email }).exec();
  }
}
