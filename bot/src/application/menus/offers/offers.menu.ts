import { Menu } from "@grammyjs/menu";
import { BotContext } from "../../../types/botContext";
import { withAuth } from "../../../bot/middleware";
// import { getSentOffersConversation } from "../../../application/conversations/offers/GetSentOffers.conversation";
// import { getReceivedOffersConversation } from "../../../application/conversations/offers/GetReceivedOffers.conversation";

export const offersMenu = new Menu<BotContext>("offers-menu")
  .text("➕ Create Offer", withAuth(async (ctx) => {
    await ctx.conversation.enter("createOfferConversation");
  }))
//   .row()
//   .text("📤 Offers Sent", withAuth(getSentOffersConversation))
//   .text("📥 Offers Received", withAuth(getReceivedOffersConversation))
  .row()
  .text("🗑️ Delete Offer", withAuth(async (ctx) => {
    await ctx.conversation.enter("deleteOfferConversation");
  }))
  .row()
  .back("🔙 Back");
