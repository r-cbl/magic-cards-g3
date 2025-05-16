import mongoose from "mongoose";

const PublicationSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  ownerId: { type: String, required: true },
  cardId: { type: String, required: true },
  valueMoney: { type: Number },
  cardExchangeIds: [{ type: String }],
  offerIds: [{ type: String }],
  statusPublication: { type: String, enum: ["Open", "Closed"], required: true },
  createdAt: { type: Date, required: true },
  updatedAt: { type: Date, required: true }
});

export const PublicationModel = mongoose.model("Publication", PublicationSchema);
