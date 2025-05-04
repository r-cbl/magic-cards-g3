import { Conversation } from "@grammyjs/conversations";
import { BotContext } from "../../../types/botContext";
import { PublicationsClient } from "../../../client/publications/publications.client";
import { session } from "../../../bot/middleware";
import { handleError } from "../../../types/errors";
import { selectBaseCardConversation } from "../baseCards/SelectBaseCard.conversations";
import { InlineKeyboard } from "grammy";
import { selectCardConversation } from "../cards/SelectCard.conversations";

export async function createPublicationConversation(
  conversation: Conversation<BotContext, BotContext>,
  ctx: BotContext
) {
  const userId = ctx.from!.id.toString();
  const user = session.get(userId)!;
  const token = user.tokens.accessToken;

  const publicationsClient = new PublicationsClient();

  try {
    // 1. Select a card to publish
    const selected = await selectCardConversation(conversation, ctx, token,{ownerId: user.user.id, limit:10,offset:10}, false);
    if (!selected || !("cardBase" in selected)) {
      await ctx.reply("❌ Could not select a valid card.");
      return;
    }

    let valueMoney = 0;

    while (true) {
      // 2. Ask what the user wants in exchange
      const modeKb = new InlineKeyboard()
        .text("💰 Money", "money")
        .text("🃏 Base cards", "cards")
        .text("🔀 Both", "both");

      await ctx.reply("What would you like to receive in exchange?", { reply_markup: modeKb });
      const modeCtx = await conversation.waitFor("callback_query");
      await modeCtx.answerCallbackQuery();
      const mode = modeCtx.callbackQuery?.data;

      valueMoney = 0;
      let baseCardIds: string[] = [];
      let baseCardNames: string[] = [];

      // 3a. Enter money value
      if (mode === "money" || mode === "both") {
        await ctx.reply("💵 How much money would you like to receive?");
        while (true) {
          const moneyText = await conversation.form.text();
          const value = parseFloat(moneyText);
          if (!isNaN(value) && value >= 0) {
            valueMoney = value;
            break;
          }
          await ctx.reply("❌ Invalid value. Please enter a valid number.");
        }
      }

      let cancelled = false;

      if (mode === "cards" || mode === "both") {
        await ctx.reply("🃏 Now select the base cards you are willing to accept.");
        while (true) {
          const baseCard = await selectBaseCardConversation(
            conversation,
            ctx,
            token,
            {limit:10,offset:0},
            false,  
            true,   
          );

          if (!baseCard) {
            await ctx.reply("🔙 Selection cancelled. Returning to the previous menu.");
            cancelled = true;
            break;
          }

          if (baseCard.id === "none") {
            await ctx.reply("👌 No base cards selected. Only money will be accepted.");
            break;
          }

          baseCardIds.push(baseCard.id);
          baseCardNames.push(baseCard.nameCard);

          const decisionKeyboard = new InlineKeyboard()
            .text("➕ Yes, add another", "yes")
            .text("✅ No, finish", "no");

          await ctx.reply("Would you like to add another base card?", { reply_markup: decisionKeyboard });

          const decCtx = await conversation.waitFor("callback_query");
          await decCtx.answerCallbackQuery();
          if (decCtx.callbackQuery?.data === "no") break;
        }
      }

      if (cancelled) continue;

      if (valueMoney === 0 && baseCardIds.length === 0) {
        await ctx.reply("⚠️ You must offer at least money or base cards as an exchange.");
        continue;
      }

      // 4. Confirmation
      await ctx.reply(
        `✅ Publication summary:\n\n📦 Card: ${selected.cardBase!.Name}` +
        `\n💰 Money: $${valueMoney}` +
        `\n🃏 Accepted base cards: ${
          baseCardIds.length === 0 ? "None" : baseCardNames.join(", ")
        }`
      );

      const confirmKb = new InlineKeyboard()
        .text("✅ Confirm", "confirm")
        .text("❌ Cancel", "cancel");

      await ctx.reply("Do you want to confirm the publication?", { reply_markup: confirmKb });

      const confirmCtx = await conversation.waitFor("callback_query");
      await confirmCtx.answerCallbackQuery();
      if (confirmCtx.callbackQuery?.data !== "confirm") {
        await ctx.reply("❌ Publication cancelled.");
        return;
      }

      // 5. Create the publication
      await publicationsClient.create(
        {
          cardId: selected.id,
          valueMoney,
          cardExchangeIds: baseCardIds,
        },
        token
      );

      await ctx.reply("🎉 Publication created successfully!");
      break;
    }
  } catch (error) {
    await handleError(ctx, error);
  }
}
