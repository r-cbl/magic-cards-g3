import mongoose, { Schema, Document } from "mongoose";

export interface GameDocument extends Document {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

const GameSchema = new Schema<GameDocument>({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
}, { timestamps: true });

export const GameModel = mongoose.model<GameDocument>("Game", GameSchema);
