import { Conversation } from "@grammyjs/conversations";
import { BotContext } from "../../../types/botContext";
import { GameKeyboard } from "./game.keyboard";
import { handleError } from "../../../types/errors";

export async function selectGameConversation(
  conversation: Conversation<BotContext, BotContext>,
  ctx: BotContext,
  token: string
): Promise<{ id: string; name: string } | null> {
  try {
    const gameKeyboard = new GameKeyboard(token, 10, true);
    let id: string;
    let name: string;
    let offset = 0;
    let messageId: number | undefined;

    while (true) {
      const resp = await gameKeyboard.fetchPage(offset);
      const keyboard = gameKeyboard.buildKeyboard(resp);

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
            // ignore harmless error
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
