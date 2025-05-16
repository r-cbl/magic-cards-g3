import mongoose from "mongoose";

const CardBaseSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  gameId: { type: String, required: true },
  nameCard: { type: String, required: true },
  createdAt: { type: Date, required: true },
  updatedAt: { type: Date, required: true },
});

export const CardBaseModel = mongoose.model("CardBase", CardBaseSchema);
