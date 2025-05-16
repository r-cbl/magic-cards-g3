import mongoose, { Schema, Document } from "mongoose";
import { Role } from "../../../../domain/entities/Role";

export interface UserDocument extends Document {
  id: string;
  name: string;
  email: string;
  password: string;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<UserDocument>({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: Object.values(Role), default: Role.USER }
}, { timestamps: true });

export const UserModel = mongoose.model<UserDocument>("User", UserSchema);
