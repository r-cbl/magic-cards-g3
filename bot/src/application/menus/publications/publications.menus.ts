import { Menu } from "@grammyjs/menu";
import { BotContext } from "@/types/botContext";
import { withAuth } from "../../../bot/middleware";
import { getAllPublicationsConversation } from "../../../application/conversations/publications/GetAll.conversations";

export const publicationMenu = new Menu<BotContext>("publication-menu")
  .text("➕ Create Publication", withAuth(async (ctx) => {
    await ctx.conversation.enter("createPublicationConversation");
  }))
  .row()
  .text("📌 My Publications", withAuth(getAllPublicationsConversation))
  .row()
  .text("🗑️ Delete Publication", withAuth(async (ctx) => {
    await ctx.conversation.enter("deletePublicationConversation");
  }))
  .row()
  .back("🔙 Back");
