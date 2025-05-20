import { Conversation } from "@grammyjs/conversations";
import { BotContext } from "../../../types/botContext";
import { handleError } from "../../../types/errors";
import { PublicationResponse } from "../../../client/publications/response/publication.response";
import { Keyboard } from "../utils/keyboard.utils";
import { GetRequest } from "../../../client/publications/request/get.request";
import { publicationsClient } from "../../../client/client";

export async function selectPublicationConversation(
  conversation: Conversation<BotContext, BotContext>,
  ctx: BotContext,
  token: string,
  request: GetRequest,
  enableOther: boolean,
  enableNone: boolean
): Promise<PublicationResponse | null> {
  try {
    let id: string;
    let name: string;
    let offset = 0;
    let messageId: number | undefined;

    const keyboardGeneric = new Keyboard<GetRequest, PublicationResponse>(
      publicationsClient,
      token,
      request,
      10,
      enableOther,
      enableNone,
      (publication) => publication.cardBase?.Name || "Unnamed card"
    );

    let resp = await keyboardGeneric.fetchPage(offset);

    while (true) {
      if (!resp.data || resp.data.length === 0) {
        await ctx.reply("❌ You don't have any publications to select.");
        return null;
      }

      const keyboard = keyboardGeneric.buildKeyboard(resp);

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
            // do nothing
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
        resp = await keyboardGeneric.fetchPage(offset);
        continue;
      }

      if (enableOther && data === "other") {
        await ctx.reply("🆕 Enter the name of the new publication:");
        const nameCtx = await conversation.waitFor("message:text");
        name = nameCtx.message.text;
        id = "0";
        return { id, name } as PublicationResponse;
      }

      if (enableNone && data === "none") {
        return { id: "none", name: "none" } as PublicationResponse;
      }
    }
  } catch (error) {
    console.error("🔥 [selectPublicationConversation] Error:", error);
    await handleError(ctx, error);
    return null;
  }
}
