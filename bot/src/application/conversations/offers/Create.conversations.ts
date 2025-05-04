import { Conversation } from "@grammyjs/conversations";
import { BotContext } from "../../../types/botContext";
import { handleError } from "../../../types/errors";
import { session } from "../../../bot/middleware";
import { selectGameConversation } from "../games/SelectGame.conversations";
import { selectBaseCardConversation } from "../baseCards/SelectBaseCard.conversations";
import { selectPublicationConversation } from "../publications/Select.conversations";
import { selectCardConversation } from "../cards/SelectCard.conversations";
import { InlineKeyboard } from "grammy";
import { offersClient } from "../../../client/client";

export async function createOfferConversation(
  conversation: Conversation<BotContext, BotContext>,
  ctx: BotContext
) {
  const userId = ctx.from!.id.toString();
  const user = session.get(userId)!;
  const token = user.tokens.accessToken;

  try {
    let selectedGameId: string[] = [];
    let selectedCardId: string[] = [];
    let minValue: number | null = null;
    let maxValue: number | null = null;

    // Step 1: Apply Filters
    while (true) {
      const filterMenu = new InlineKeyboard()
        .text("🎮 Game", "game")
        .text("🃏 Base Card", "card")
        .row()
        .text("💰 Min Value", "min")
        .text("💸 Max Value", "max")
        .row()
        .text("✅ All Done", "done")
        .text("❌ Clear All", "clear");

      await ctx.reply("Apply filters to find a publication:", { reply_markup: filterMenu });

      const filterCtx = await conversation.waitFor("callback_query");
      await filterCtx.answerCallbackQuery();
      const filterChoice = filterCtx.callbackQuery?.data;

      if (filterChoice === "game") {
        const game = await selectGameConversation(conversation, ctx, token,{limit:10,offset:0},false,true);
        if (game && game.id !== "none") selectedGameId.push(game.id);

      } else if (filterChoice === "card") {
        const baseCard = await selectBaseCardConversation(conversation,ctx,token,{ limit: 10, offset: 0 },false,false);
        if (baseCard && baseCard.id !== "none") selectedCardId.push(baseCard.id);
      } else if (filterChoice === "min") {

        await ctx.reply("Enter the minimum value:");
        const min = parseFloat(await conversation.form.text());
        if (!isNaN(min)) minValue = min;

      } else if (filterChoice === "max") {

        await ctx.reply("Enter the maximum value:");
        const max = parseFloat(await conversation.form.text());
        if (!isNaN(max)) maxValue = max;

      } else if (filterChoice === "clear") {

        selectedGameId = [];
        selectedCardId = [];
        minValue = null;
        maxValue = null;
        await ctx.reply("🧹 Filters cleared.");
        
      } else if (filterChoice === "done") {
        break;
      }
    }

    // Step 2: Select publication
    while (true) {
      await ctx.reply("📦 Select a publication based on the filters.");
      const publication = await selectPublicationConversation(
        conversation,
        ctx,
        token,
        {
          excludeId: user.user.id,
          gamesIds: selectedGameId,
          cardBaseIds: selectedCardId,
          minValue: minValue ?? undefined,
          maxValue: maxValue ?? undefined,
          limit: 10,
          offset: 0
        },
        false,
        true
      );

      if (!publication || publication.id === "none") {
        await ctx.reply("❌ No publication selected. Offer creation cancelled.");
        return;
      }

      // Step 3: What to offer
      const modeKb = new InlineKeyboard()
        .text("💰 Money", "money")
        .text("🃏 Cards", "cards")
        .text("🔀 Both", "both");

      await ctx.reply("What would you like to offer?", { reply_markup: modeKb });
      const modeCtx = await conversation.waitFor("callback_query");
      await modeCtx.answerCallbackQuery();
      const mode = modeCtx.callbackQuery?.data;

      let valueMoney = 0;
      let cardIds: string[] = [];
      let cancelled = false;

      if (mode === "money" || mode === "both") {
        await ctx.reply("💵 How much money would you like to offer?");
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

      if (mode === "cards" || mode === "both") {
        await ctx.reply("🃏 Now select the cards you want to offer.");
        while (true) {
          const card = await selectCardConversation(
            conversation,
            ctx,
            token,
            { ownerId: user.user.id, limit: 10, offset: 0 },
            false,
            true
          );

          if (!card || card.id === "none") {
            await ctx.reply("❌ Card selection cancelled.");
            cancelled = true;
            break;
          }

          cardIds.push(card.id);

          const decisionKeyboard = new InlineKeyboard()
            .text("➕ Add another", "yes")
            .text("✅ Done", "no");

          await ctx.reply("Do you want to add another card?", {
            reply_markup: decisionKeyboard,
          });

          const decisionCtx = await conversation.waitFor("callback_query");
          await decisionCtx.answerCallbackQuery();
          if (decisionCtx.callbackQuery?.data === "no") break;
        }
      }

      if (cancelled) continue;

      if (valueMoney === 0 && cardIds.length === 0) {
        await ctx.reply("⚠️ You must offer at least money or cards.");
        continue;
      }

      // Step 4: Confirmation
      await ctx.reply(
        `✅ Offer Summary:\n\n📦 Target Publication: ${publication.cardBase?.Name}` +
        `\n💰 Money Offered: $${valueMoney}` +
        `\n🃏 Cards Offered: ${cardIds.length === 0 ? "None" : cardIds.length + " card(s)"}`
      );

      const confirmKb = new InlineKeyboard()
        .text("✅ Confirm", "confirm")
        .text("🔄 Restart", "restart")
        .text("❌ Cancel", "cancel");

      await ctx.reply("Do you want to confirm this offer?", { reply_markup: confirmKb });

      const confirmCtx = await conversation.waitFor("callback_query");
      await confirmCtx.answerCallbackQuery();
      const confirm = confirmCtx.callbackQuery?.data;

      if (confirm === "cancel") {
        await ctx.reply("❌ Offer cancelled.");
        return;
      }

      if (confirm === "restart") {
        continue;
      }

      // Step 5: Submit offer
      await offersClient.create(
        {
          publicationId: publication.id,
          moneyOffer: valueMoney,
          cardExchangeIds: cardIds,
        },
        token
      );

      await ctx.reply("🎉 Offer sent successfully!");
      break;
    }
  } catch (error) {
    await handleError(ctx, error);
  }
}
