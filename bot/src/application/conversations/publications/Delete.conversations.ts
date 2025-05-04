import { Conversation } from "@grammyjs/conversations";
import { BotContext } from "../../../types/botContext";
import { PublicationsClient } from "../../../client/publications/publications.client";
import { session } from "../../../bot/middleware";
import { handleError } from "../../../types/errors";
import { selectPublicationConversation } from "./Select.conversations";
import { InlineKeyboard } from "grammy";
import { GetRequest } from "../../../client/publications/request/get.request";

export async function deletePublicationConversation(
  conversation: Conversation<BotContext, BotContext>,
  ctx: BotContext
) {
  const userId = ctx.from!.id.toString();
  const user = session.get(userId)!;
  const token = user.tokens.accessToken;

  const publicationsClient = new PublicationsClient();

  try {
    const request : GetRequest = {
      ownerId: user.user.id,
      limit: 10,
      offset: 0
    };

    const selected = await selectPublicationConversation(conversation, ctx, token, request, false,true);

    if (!selected || !("id" in selected) || selected.id === "none") {
      await ctx.reply("❌ Cancel Operation.");
      return;
    }

    const confirmKb = new InlineKeyboard()
      .text("✅ Confirm", "confirm")
      .text("❌ Cancel", "cancel");

    await ctx.reply(
      `⚠️ Are you sure you want to delete the publication "${selected.name}"?`,
      { reply_markup: confirmKb }
    );

    const confirmCtx = await conversation.waitFor("callback_query");
    await confirmCtx.answerCallbackQuery();

    if (confirmCtx.callbackQuery?.data !== "confirm") {
      await ctx.reply("❌ Deletion cancelled.");
      return;
    }

    await publicationsClient.delete(selected.id, token);
    await ctx.reply("🗑️ Publication deleted successfully!");
  } catch (error) {
    await handleError(ctx, error);
  }
}
