import { User } from "../../../../domain/entities/User";
import { UserDocument } from "../models/UserModel";
import { Role } from "../../../../domain/entities/Role";

export function toUserEntity(doc: UserDocument): User {
  return new User({
    id: doc.id,
    name: doc.name,
    email: doc.email,
    password: doc.password,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
    role: doc.role
  });
}

export function toUserDocument(user: User): Partial<UserDocument> {
  return {
    id: user.getId(),
    name: user.getName(),
    email: user.getEmail(),
    password: user.getPassword(),
    role: user.isAdmin() ? Role.ADMIN : Role.USER
  };
}
