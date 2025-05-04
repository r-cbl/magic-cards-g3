import { Conversation } from "@grammyjs/conversations";
import { BotContext } from "../../../types/botContext";
import { OfferResponse } from "../../../client/offers/response/offer.response";
import { handleError } from "../../../types/errors";
import { Keyboard } from "../utils/keyboard.utils";
import { GetRequest } from "../../../client/offers/request/get.request";
import { OffersClient } from "../../../client/offers/offers.client";

export async function selectOfferConversation(
  conversation: Conversation<BotContext, BotContext>,
  ctx: BotContext,
  token: string,
  request: GetRequest,
  enableNone: boolean
): Promise<OfferResponse | null> {
  try {
    const offerClient = new OffersClient();
    let offset = 0;
    let messageId: number | undefined;

    const keyboardGeneric = new Keyboard<GetRequest, OfferResponse>(
      offerClient,
      token,
      request,
      10,
      false,
      enableNone,
      (offer) =>
        `💰 $${offer.moneyOffer ?? 0} | 📅 ${new Date(offer.createdAt).toLocaleDateString()}`
    );

    let resp = await keyboardGeneric.fetchPage(offset);

    while (true) {
      const keyboard = keyboardGeneric.buildKeyboard(resp);

      if (!messageId) {
        const msg = await ctx.reply("📨 Select an offer:", { reply_markup: keyboard });
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
        continue;
      }

      if (data === "none" && enableNone) {
        return { id: "none", publicationId: "", status: "none", ownerId: "", createdAt: new Date(), updatedAt: new Date() };
      }
    }
  } catch (error) {
    await handleError(ctx, error);
    return null;
  }
}
