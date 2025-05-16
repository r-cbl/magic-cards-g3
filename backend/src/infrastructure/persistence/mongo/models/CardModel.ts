import mongoose from "mongoose";

const CardSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  ownerId: { type: String, required: true },
  cardBaseId: { type: String, required: true },
  statusCard: { type: Number, required: true },
  urlImage: { type: String },
  createdAt: { type: Date, required: true },
  updatedAt: { type: Date, required: true },
});

export const CardModel = mongoose.model("Card", CardSchema);
