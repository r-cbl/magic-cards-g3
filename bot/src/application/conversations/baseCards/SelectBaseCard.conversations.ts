import { Conversation } from "@grammyjs/conversations";
import { BotContext } from "../../../types/botContext";
import { BaseCardKeyboard } from "./baseCard.keyboard";
import { InlineKeyboard } from "grammy";

export async function selectBaseCardConversation(
  conversation: Conversation<BotContext, BotContext>,
  ctx: BotContext,
  token: string,
  enableOther: boolean,
  enableNone: boolean,
  gameId?: string
): Promise<{ id: string; name: string } | null> {
  const baseCardKeyboard = new BaseCardKeyboard(token, 10, enableOther);
  let id: string;
  let name: string;
  let offset = 0;
  let messageId: number | undefined;

  const initialResp = await baseCardKeyboard.fetchPage(offset, gameId);

  if (!initialResp.data.length && !enableOther) {
    await ctx.reply("⚠️ No base cards available.");
    const cancelKb = new InlineKeyboard().text("🔙 Go back", "cancel");
    await ctx.reply("Do you want to go back?", { reply_markup: cancelKb });

    const cancelCtx = await conversation.waitFor("callback_query");
    await cancelCtx.answerCallbackQuery();
    return null;
  }

  while (true) {
    const resp = await baseCardKeyboard.fetchPage(offset, gameId);
    const keyboard = baseCardKeyboard.buildKeyboard(resp);

    // Add "🛑 None" button
    if (enableNone) {
      keyboard.row().text("🛑 None", "none");
    }

    if (!messageId) {
      const msg = await ctx.reply("📚 Select a base card:", { reply_markup: keyboard });
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
      id = resp.data[index].id;
      name = resp.data[index].nameCard;
      return { id, name };
    }

    if (data.startsWith("nav|")) {
      offset = Number(data.split("|")[1]);
      continue;
    }

    if (data === "cancel") {
      return null;
    }

    if (data === "none" && enableNone) {
      return { id: "none", name: "None" };
    }

    if (enableOther && data === "other") {
      await ctx.reply("🆕 Enter the name of the new base card:");
      const nameCtx = await conversation.waitFor("message:text");
      name = nameCtx.message.text;
      id = "0";
      return { id, name };
    }
  }
}
