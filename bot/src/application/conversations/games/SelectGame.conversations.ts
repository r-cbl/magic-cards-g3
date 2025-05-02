import { Conversation } from "@grammyjs/conversations";
import { BotContext } from "../../../types/botContext";
import { GameKeyboard } from "./game.keyboard";

export async function selectGameConversation(
  conversation: Conversation<BotContext, BotContext>,
  ctx: BotContext,
  token: string
): Promise<{id: string, name: string}> {
  const gameKeyboard = new GameKeyboard(token, 10, true);
  let id;
  let name;
  let offset = 0;
  let messageId: number | undefined;
  let gameSelected = false;
  const resp = await gameKeyboard.fetchPage(offset);
  const keyboard = gameKeyboard.buildKeyboard(resp);

  while (!gameSelected) {

    if (!messageId) {
      const sent = await ctx.reply("📚 Select a game:", { reply_markup: keyboard });
      messageId = sent.message_id;
    } else {
      await ctx.api.editMessageReplyMarkup(ctx.chat!.id, messageId, { reply_markup: keyboard });
    }

    const nextCtx = await conversation.waitFor("callback_query");
    ctx = nextCtx;

    try {
      await ctx.answerCallbackQuery();
    } catch {}

    const data = ctx.callbackQuery?.data!;

    if (data.startsWith("select|")) {
      const index = Number(data.split("|")[1]);
      gameSelected = true; // Marca que se seleccionó un juego
      id = resp.data[index].id;
      name = resp.data[index].name;
      return {id,name}
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
      gameSelected = true;
      return {id,name}; // ✅ Retorna el juego recién creado
    }
  }

  throw new Error("No game selected or created.");
}
