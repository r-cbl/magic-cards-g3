import { Conversation } from "@grammyjs/conversations";
import { BotContext } from "../../../types/botContext";
import { handleError } from "../../../types/errors"; // asegúrate de tener esta importación
import { BaseCardResponse } from "../../../client/baseCards/response/baseCard.response";
import { Keyboard } from "../utils/keyboard.utils";
import { GetRequest } from "../../../client/baseCards/request/get.request";
import { BaseCardsClient } from "../../../client/baseCards/baseCard.client";

export async function selectBaseCardConversation(
  conversation: Conversation<BotContext, BotContext>,
  ctx: BotContext,
  token: string,
  request: GetRequest,
  enableOther: boolean,
  enableNone: boolean
): Promise<BaseCardResponse | null> {
  try {
    const baseCardClient = new BaseCardsClient();
    let id: string;
    let name: string;
    let offset = 0;
    let messageId: number | undefined;
    const keyboardGeneric = new Keyboard<GetRequest,BaseCardResponse>(
      baseCardClient,
      token,
      request,
      10,
      enableOther,
      (baseCard) => baseCard.nameCard || "Unnamed base card"
    );
    let resp = await keyboardGeneric.fetchPage(offset);

    while (true) {
      const keyboard = keyboardGeneric.buildKeyboard(resp);
      if (enableNone) {
        keyboard.row().text("🛑 None", "none");
      }

      if (!messageId) {
        const msg = await ctx.reply("📚 Select a base card:", { reply_markup: keyboard });
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
        id = resp.data[index].id;
        name = resp.data[index].nameCard;
        return { id, nameCard: name };
      }

      if (data.startsWith("nav|")) {
        offset = Number(data.split("|")[1]);
        continue;
      }

      if (data === "cancel") {
        return null;
      }

      if (data === "none" && enableNone) {
        return { id: "none", nameCard: "None" };
      }

      if (enableOther && data === "other") {
        await ctx.reply("🆕 Enter the name of the new base card:");
        const nameCtx = await conversation.waitFor("message:text");
        name = nameCtx.message.text;
        id = "0";
        return { id, nameCard: name };
      }
    }
  } catch (error) {
    await handleError(ctx, error);
    return null;
  }
}
