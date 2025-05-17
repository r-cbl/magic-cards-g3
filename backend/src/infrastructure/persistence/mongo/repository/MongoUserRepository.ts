import { UserRepository } from "../../../../domain/repositories/UserRepository";
import { User } from "../../../../domain/entities/User";
import { UserModel } from "../models/UserModel";
import { toUserEntity, toUserDocument } from "../mappers/user.mapper";

export class MongoUserRepository implements UserRepository {
  private userModel: UserModel;

  constructor() {
    this.userModel = new UserModel();
  }

  async findById(id: string): Promise<User | null> {
    const doc = await this.userModel.findById(id);
    return doc ? toUserEntity(doc) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const docs = await this.userModel.findAll();
    const doc = docs.find(d => d.email === email);
    return doc ? toUserEntity(doc) : null;
  }

  async findAll(): Promise<User[]> {
    const docs = await this.userModel.findAll();
    return docs.map(toUserEntity);
  }

  async save(user: User): Promise<User> {
    await this.userModel.create(toUserDocument(user));
    return user;
  }

  async update(user: User): Promise<User> {
    await this.userModel.update(user.getId(), toUserDocument(user));
    return user;
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.userModel.delete(id);
    return result !== null;
  }
}
