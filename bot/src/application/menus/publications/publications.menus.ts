import { Menu } from "@grammyjs/menu";
import { BotContext } from "@/types/botContext";
import { withAuth } from "../../../bot/middleware";

export const publicationMenu = new Menu<BotContext>("publication-menu")
  .text("🃏 Add Publication", withAuth(async (ctx) => {
    await ctx.conversation.enter("createPublicationConversation");
  }))
  .row()
  .back("🔙 Back");
