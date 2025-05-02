import { Conversation } from "@grammyjs/conversations";
import { BotContext } from "../../../types/botContext";
import { BaseCardKeyboard } from "./baseCard.keyboard";
import { BaseCardResponse } from "../../../client/baseCards/response/baseCard.response";
import { BaseCardsClient } from "../../../client/baseCards/baseCard.client";
import { CreateRequest } from "../../../client/baseCards/request/create.request";

export async function selectBaseCardConversation(
  conversation: Conversation<BotContext, BotContext>,
  ctx: BotContext,
  token: string,
  gameId: string
): Promise<{id: string, name:string}> {
  const baseCardClient = new BaseCardsClient();
  const baseCardKeyboard = new BaseCardKeyboard(token, 10, true);
  let id;
  let name;
  let offset = 0;
  let messageId: number | undefined;

  while (true) {
    const resp = await baseCardKeyboard.fetchPage(offset, gameId);
    const keyboard = baseCardKeyboard.buildKeyboard(resp);

    if (!messageId) {
      const msg = await ctx.reply("📚 Select a Card:", { reply_markup: keyboard });
      messageId = msg.message_id;
    } else {
      await ctx.api.editMessageReplyMarkup(ctx.chat!.id, messageId, { reply_markup: keyboard });
    }

    const nextCtx = await conversation.waitFor("callback_query");
    ctx = nextCtx; // ✅ importante

    try {
      await ctx.answerCallbackQuery();
    } catch {}

    const data = ctx.callbackQuery?.data!;

    if (data.startsWith("select|")) {
      const index = Number(data.split("|")[1]);
      id = resp.data[index].id;
      name = resp.data[index].nameCard;
      return {id,name}
    }

    if (data.startsWith("nav|")) {
      offset = Number(data.split("|")[1]);
      continue;
    }

    if (data === "other") {
      await ctx.reply("🆕 Enter the name of the new card:");
      const nameCtx = await conversation.waitFor("message:text");
      name = nameCtx.message.text;
      id = "0"
      return {id,name}
    }
  }
}
