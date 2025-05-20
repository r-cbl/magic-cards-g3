import { session } from "../../../bot/middleware";
import { offersClient, publicationsClient } from "../../../client/client";
import { BotContext } from "../../../types/botContext";
import { handleError } from "../../../types/errors";
import { InlineKeyboard } from "grammy";
import { selectOfferConversation } from "./SelectOffer.conversations";
import { Conversation } from "@grammyjs/conversations";

export async function getReceivedOffersConversation(
  conversation: Conversation<BotContext, BotContext>,
  ctx: BotContext
) {
  const userId = ctx.from!.id.toString();
  const user = session.get(userId)!;
  const token = user.tokens.accessToken;

  try {
    const offer = await selectOfferConversation(
      conversation,
      ctx,
      token,
      { userId: user.user.id, status:"pending" },
      true
    );

    if (!offer || offer.id === "none") {
      await ctx.reply("📭 You didn't select any offer.");
      return;
    }

    // Get publication name
    const publication = await publicationsClient.getById(offer.publicationId, token);
    const publicationName = publication.cardBase?.Name ?? "Unknown";

    const message =
      `📨 Offer received\n` +
      `📦 Publication: ${publicationName}\n` +
      (offer.moneyOffer != null ? `💰 Money offered: $${offer.moneyOffer}\n` : "") +
      `🃏 Cards offered: ${offer.cardExchangeIds?.length ?? 0}\n` +
      `📅 Date: ${new Date(offer.createdAt).toLocaleDateString()}\n` +
      `📌 Status: ${offer.status}`;

    const keyboard = new InlineKeyboard()
      .text("✅ Accept", `accept:${offer.id}`)
      .text("❌ Reject", `reject:${offer.id}`)
      .row()
      .text("🔙 Back", `back`);

    await ctx.reply(message, { reply_markup: keyboard });

    const actionCtx = await conversation.waitFor("callback_query");
    await actionCtx.answerCallbackQuery();
    const data = actionCtx.callbackQuery?.data;

    if (!data) return;

    if (data === "back") return;

    const [action, offerId] = data.split(":");

    if (action === "accept") {
      await offersClient.update({ offerId: offerId, statusOffer: "accepted", publicationId: publication.id, userId: user.user.id }, token);
      await ctx.reply("✅ Offer accepted.");
    } else if (action === "reject") {
      await offersClient.update({ offerId: offerId, statusOffer: "rejected", publicationId: publication.id, userId: user.user.id }, token);
      await ctx.reply("❌ Offer rejected.");
    }
  } catch (error) {
    await handleError(ctx, error);
  }
}
