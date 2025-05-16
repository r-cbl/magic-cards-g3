import { UserRepository } from "../../../../domain/repositories/UserRepository";
import { User } from "../../../../domain/entities/User";
import { UserModel } from "../models/UserModel";
import { toUserEntity, toUserDocument } from "../mappers/user.mapper";

export class MongoUserRepository implements UserRepository {
  async findById(id: string): Promise<User | null> {
    const doc = await UserModel.findOne({ id });
    return doc ? toUserEntity(doc) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const doc = await UserModel.findOne({ email });
    return doc ? toUserEntity(doc) : null;
  }

  async findAll(): Promise<User[]> {
    const docs = await UserModel.find();
    return docs.map(toUserEntity);
  }

  async save(user: User): Promise<User> {
    await UserModel.create(toUserDocument(user));
    return user;
  }

  async update(user: User): Promise<User> {
    await UserModel.updateOne({ id: user.getId() }, toUserDocument(user));
    return user;
  }

  async delete(id: string): Promise<boolean> {
    const result = await UserModel.deleteOne({ id });
    return result.deletedCount > 0;
  }
}
