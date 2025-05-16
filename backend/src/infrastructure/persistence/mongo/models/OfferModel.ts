import mongoose from "mongoose";

const OfferSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  offerOwnerId: { type: String, required: true },
  cardIds: [{ type: String }],
  statusOffer: { type: String, enum: ['draft', 'pending', 'accepted', 'rejected'], required: true },
  moneyOffer: { type: Number },
  closedAt: { type: Date },
  createdAt: { type: Date, required: true },
  updatedAt: { type: Date, required: true },
  publicationId: { type: String, required: true },
});

export const OfferModel = mongoose.model("Offer", OfferSchema);
