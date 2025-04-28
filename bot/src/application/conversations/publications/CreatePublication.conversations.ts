import { Conversation } from "@grammyjs/conversations";
import { BotContext } from "../../../types/botContext";
import { PublicationsClient } from "@/client/publications/publications.client";

export async function createPublicationConversation(
  conversation: Conversation<BotContext, BotContext>,
  ctx: BotContext
) {
  const publicationsClient = new PublicationsClient();

  try {
    
    await ctx.reply("✅ Login exitoso!");
  } catch (error) {
    if (error instanceof Error) {
    } else {
    }
  }
}
