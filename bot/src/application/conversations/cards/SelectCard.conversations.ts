import { Conversation } from "@grammyjs/conversations";
import { BotContext } from "../../../types/botContext";
import { CardResponse } from "../../../client/cards/response/card.response";
import { handleError } from "../../../types/errors";
import { Keyboard } from "../utils/keyboard.utils";
import { GetRequest } from "../../../client/cards/request/get.request";
import { CardsClient } from "../../../client/cards/cards.client";

export async function selectCardConversation(
  conversation: Conversation<BotContext, BotContext>,
  ctx: BotContext,
  token: string,
  request: GetRequest,
  enableOther: boolean,
  enableNone: boolean
): Promise<CardResponse | null> {
  try {
    const cardCient = new CardsClient();
    let id: string;
    let name: string;
    let offset = 0;
    let messageId: number | undefined;
    const keyboardGeneric = new Keyboard<GetRequest,CardResponse>(
      cardCient,
      token,
      request,
      10,
      enableOther,
      enableNone,
      (card) => card.cardBase?.Name || "Unnamed card"
    );
    const resp = await keyboardGeneric.fetchPage(offset);

    while (true) {
      const keyboard = keyboardGeneric.buildKeyboard(resp);

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
        return {id: id, cardBase:{Name:name}};
      }
      if (data === "none" && enableNone){
        return {id: "none", cardBase:{Name:"none"}};

      }
    }
  } catch (error) {
    await handleError(ctx, error);
    return null;
  }
}
