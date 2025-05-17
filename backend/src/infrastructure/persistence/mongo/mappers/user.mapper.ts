import { User } from "../../../../domain/entities/User";
import { IUser } from "../models/UserModel";
import { Role } from "../../../../domain/entities/Role";

export function toUserEntity(doc: IUser): User {
  return new User({
    id: doc._id,
    name: doc.name,
    email: doc.email,
    password: doc.password,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
    role: doc.role
  });
}

export function toUserDocument(user: User): Partial<IUser> {
  return {
    _id: user.getId(),
    name: user.getName(),
    email: user.getEmail(),
    password: user.getPassword(),
    role: user.isAdmin() ? Role.ADMIN : Role.USER
  };
}
