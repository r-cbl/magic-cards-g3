import { Conversation } from "@grammyjs/conversations";
import { BotContext } from "../../../types/botContext";
import { CardsClient } from "../../../client/cards/cards.client";
import { session } from "../../../bot/middleware";
import { CreateRequest as CreateRequestCards } from "../../../client/cards/request/create.request";
import { selectGameConversation } from "../games/SelectGame.conversations";
import { selectBaseCardConversation } from "../baseCards/SelectBaseCard.conversations";
import { handleError } from "../../../types/errors";
import { BaseCardsClient } from "../../../client/baseCards/baseCard.client";
import { GamesClient } from "../../../client/games/games.client";

export async function createCardConversation(
  conversation: Conversation<BotContext, BotContext>,
  ctx: BotContext
) {
  const userId = ctx.from!.id.toString();
  const user = session.get(userId)!;
  const token = user.tokens.accessToken;
  const cardsClient = new CardsClient();
  const baseCardClient = new BaseCardsClient();
  const gameClient = new GamesClient();

  try {

    let game = await selectGameConversation(conversation,ctx,token)
    if (!game){
      conversation.halt()
      return;
    }
    let baseCard = await selectBaseCardConversation(conversation, ctx, token,true,false, game.id);
    if (!baseCard){
      conversation.halt()
      return;
    }
    
    await ctx.reply("What is the condition of the card? (Enter a number from 1 to 100)");

    let statusCard: number;
    while (true) {
      const raw = await conversation.form.text(); 
      const parsed = parseInt(raw.trim(), 10);
    
      if (!isNaN(parsed) && parsed >= 1 && parsed <= 100) {
        statusCard = parsed;
        break;
      }
    
      await ctx.reply("Invalid value. Please enter a number between 1 and 100:");
    }
    

    // 2) Ask for photo instead of URL
    await ctx.reply("Now, take or send a photo of the card:");

    // Wait for a photo message
    const photoCtx = await conversation.waitFor("message:photo");

    const photos = photoCtx.message.photo!;
    const bestPhoto = photos[photos.length - 1];
    // const fileId = bestPhoto.file_id;

    const fileUrl = "www";
    if(game.id === "0"){
      const newGame = await gameClient.create({name: game.name},token)
      game.id = newGame.id
    }
    if (baseCard.id === "0"){
      const newBaseCard = await baseCardClient.create({nameCard:baseCard.name, gameId:game.id},token);
      baseCard.id = newBaseCard.id;
    }
    const request: CreateRequestCards = {
      cardBaseId: baseCard.id,
      statusCard: statusCard,
      urlImage: fileUrl,
      ownerId: user.user.id,
    };

    await cardsClient.create(request, token);
    await ctx.reply(`✅ Card successfully created!`);
  } catch (error) {
    await handleError(ctx, error);
  }
}
