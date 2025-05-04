import { Conversation } from "@grammyjs/conversations";
import { BotContext } from "../../../types/botContext";
import { handleError } from "../../../types/errors";
import { GetRequest } from "../../../client/games/request/get.request";
import { GameResponse } from "../../../client/games/response/game.response";
import { GamesClient } from "../../../client/games/games.client";
import { Keyboard } from "../utils/keyboard.utils";

export async function selectGameConversation(
  conversation: Conversation<BotContext, BotContext>,
  ctx: BotContext,
  token: string,
  request: GetRequest,
  enableOther: boolean
): Promise<GameResponse | null> {
  try {
    const gameClinet = new GamesClient();
    let id: string;
    let name: string;
    let offset = 0;
    let messageId: number | undefined;
    const keyboardGeneric = new Keyboard<GetRequest,GameResponse>(
      gameClinet,
      token,
      request,
      10,
      enableOther,
      (game) => game.name || "Unnamed game"
    );

    let resp = await keyboardGeneric.fetchPage(offset);

    while (true) {
      const keyboard = keyboardGeneric.buildKeyboard(resp);

      if (!messageId) {
        const sent = await ctx.reply("📚 Select a game:", { reply_markup: keyboard });
        messageId = sent.message_id;
      } else {
        try {
          await ctx.api.editMessageReplyMarkup(ctx.chat!.id, messageId, { reply_markup: keyboard });
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
        name = resp.data[index].name;
        return { id, name };
      }

      if (data.startsWith("nav|")) {
        offset = Number(data.split("|")[1]);
        continue;
      }

      if (data === "other") {
        await ctx.reply("🆕 Enter the name of the new game:");
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
