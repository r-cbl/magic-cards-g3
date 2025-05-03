import { Conversation } from "@grammyjs/conversations";
import { BotContext } from "../../../types/botContext";
import { PublicationKeyboard } from "./publication.keyboard";
import { handleError } from "../../../types/errors";
import { PublicationResponse } from "../../../client/publications/response/publication.response";

export async function selectPublicationConversation(
  conversation: Conversation<BotContext, BotContext>,
  ctx: BotContext,
  token: string,
  ownerId: string,
  enableOther: boolean
): Promise<PublicationResponse | { id: string; name: string } | null> {
  try {
    const publicationKeyboard = new PublicationKeyboard(token, 10, enableOther);
    let id: string;
    let name: string;
    let offset = 0;
    let messageId: number | undefined;

    while (true) {
      const resp = await publicationKeyboard.fetchPage(offset, ownerId);

      if (!resp.data || resp.data.length === 0) {
        await ctx.reply("❌ You don't have any publications to select.");
        return null;
      }
      
      const keyboard = publicationKeyboard.buildKeyboard(resp);
      
      if (!messageId) {
        const sent = await ctx.reply("📚 Select a publication:", { reply_markup: keyboard });
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
        return resp.data[index];
      }

      if (data.startsWith("nav|")) {
        offset = Number(data.split("|")[1]);
        continue;
      }

      if (enableOther && data === "other") {
        await ctx.reply("🆕 Enter the name of the new publication:");
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
