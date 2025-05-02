import { Conversation } from "@grammyjs/conversations";
import { BotContext } from "../../../types/botContext";
import { CardKeyboard } from "./card.keyboard";
import { CardResponse } from "../../../client/cards/response/card.response";
import { handleError } from "../../../types/errors";
import { InlineKeyboard } from "grammy";

export async function selectCardConversation(
  conversation: Conversation<BotContext, BotContext>,
  ctx: BotContext,
  token: string,
  enableOther: boolean
): Promise<CardResponse | { id: string; name: string } | null> {
  try {
    const cardKeyboard = new CardKeyboard(token, 10, enableOther);
    let id: string;
    let name: string;
    let offset = 0;
    let messageId: number | undefined;

    const initialResp = await cardKeyboard.fetchPage(offset);
    if (!initialResp.data || initialResp.data.length === 0) {
      await ctx.reply("🆕 You don't have any cards. Please create one to continue.");
      const cancelKb = new InlineKeyboard().text("🔙 Go back", "cancel");
      await ctx.reply("Do you want to go back?", { reply_markup: cancelKb });
      await conversation.halt();
      return null;
    }

    while (true) {
      const resp = await cardKeyboard.fetchPage(offset);
      const keyboard = cardKeyboard.buildKeyboard(resp);

      if (!messageId) {
        const msg = await ctx.reply("📚 Select a card:", { reply_markup: keyboard });
        messageId = msg.message_id;
      } else {
        try {
          await ctx.api.editMessageReplyMarkup(ctx.chat!.id, messageId, {
            reply_markup: keyboard,
          });
        } catch (err: any) {
          if (
            err instanceof Error &&
            "description" in err &&
            (err as any).description?.includes("message is not modified")
          ) {
            // Ignore harmless error
          } else {
            throw err;
          }
        }
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

      if (data === "other" && enableOther) {
        await ctx.reply("🆕 Enter the name of the new card:");
        const nameCtx = await conversation.waitFor("message:text");
        name = nameCtx.message.text;
        id = "0";
        return { id, name };
      }
    }
  } catch (error) {
    await handleError(ctx, error);
    return null;
  }
}
