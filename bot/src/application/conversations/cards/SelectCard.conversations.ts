import { Conversation } from "@grammyjs/conversations";
import { BotContext } from "../../../types/botContext";
import { CardKeyboard } from "./card.keyboard";
import { CardResponse } from "../../../client/cards/response/card.response";

export async function selectCardConversation(
  conversation: Conversation<BotContext, BotContext>,
  ctx: BotContext,
  token: string,
  enableOther: boolean
): Promise<CardResponse|{id:string,name:string}> {
  const cardKeyboard = new CardKeyboard(token, 10, enableOther);
  let id: string;
  let name: string;
  let offset = 0;
  let messageId: number | undefined;

  const initialResp = await cardKeyboard.fetchPage(offset);
  if (!initialResp.data || initialResp.data.length === 0) {
    await ctx.reply("🆕 You don't have any cards. Please create one to continue.");
    await conversation.halt();
    throw new Error("No cards available for selection.");
  }

  while (true) {
    const resp = await cardKeyboard.fetchPage(offset);
    const keyboard = cardKeyboard.buildKeyboard(resp);

    if (!messageId) {
      const msg = await ctx.reply("📚 Select a Card:", { reply_markup: keyboard });
      messageId = msg.message_id;
    } else {
      await ctx.api.editMessageReplyMarkup(ctx.chat!.id, messageId, {
        reply_markup: keyboard,
      });
    }

    const nextCtx = await conversation.waitFor("callback_query");
    ctx = nextCtx;

    try {
      await ctx.answerCallbackQuery();
    } catch {}

    const data = ctx.callbackQuery?.data!;
    if (data.startsWith("select|")) {
      const index = Number(data.split("|")[1]);
      return resp.data[index];
    }

    if (data.startsWith("nav|")) {
      offset = Number(data.split("|")[1]);
      continue;
    }

    if (data === "other") {
      await ctx.reply("🆕 Enter the name of the new card:");
      const nameCtx = await conversation.waitFor("message:text");
      name = nameCtx.message.text;
      id = "0";
      return {id,name};
    }
  }
}
