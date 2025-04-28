import { Menu } from "@grammyjs/menu";
import { BotContext } from "@/types/botContext";
import { getCurrentUser } from "../../conversations/auth/CurrentUser.conversations";
import { session, withAuth } from "../../../bot/middleware";
import { createCardConversation } from "@/application/conversations/cards/Create.conversations";

export const cardsMenu = new Menu<BotContext>("cards-menu")
    .text("👤 Add card", withAuth(async (ctx) => {
      await ctx.conversation.enter("createCardConversation");
    }))
    .row()
    .back("🔙 Volver");
