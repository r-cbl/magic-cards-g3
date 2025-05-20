import { Menu } from "@grammyjs/menu";
import { BotContext } from "@/types/botContext";
import { withAuth } from "../../../bot/middleware";
import { getAllCardConversation } from "../../../application/conversations/cards/GetAll.conversations";

export const cardsMenu = new Menu<BotContext>("cards-menu")
  .text("🃏 Add card", withAuth(async (ctx) => {
    await ctx.conversation.enter("createCardConversation");
  }))
  .row()
  .text("📋 My cards", withAuth(getAllCardConversation))
  .row()
  .back("🔙 Back");
