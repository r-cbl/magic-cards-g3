import { Conversation } from "@grammyjs/conversations";
import { BotContext } from "../../../types/botContext";
import { session } from "../../../bot/middleware";
import { CreateRequest as CreateRequestCards } from "../../../client/cards/request/create.request";
import { selectGameConversation } from "../games/SelectGame.conversations";
import { selectBaseCardConversation } from "../baseCards/SelectBaseCard.conversations";
import { handleError } from "../../../types/errors";
import { baseCardsClient, cardsClient, gamesClient } from "../../../client/client";

export async function createCardConversation(
  conversation: Conversation<BotContext, BotContext>,
  ctx: BotContext
) {
  const userId = ctx.from!.id.toString();
  const user = session.get(userId)!;
  const token = user.tokens.accessToken;

  try {

    let game = await selectGameConversation(conversation,ctx,token,{limit:10,offset:0},true,false)
    if (!game){
      conversation.halt()
      return;
    }
    let baseCard = await selectBaseCardConversation(conversation, ctx, token,{limit:10,offset:0,gameId:game.id},true,false);
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
    // await ctx.reply("Now, take or send a photo of the card:");

    // // Wait for a photo message
    // const photoCtx = await conversation.waitFor("message:photo");

    // const photos = photoCtx.message.photo!;
    // const bestPhoto = photos[photos.length - 1];
    // // const fileId = bestPhoto.file_id;
    await ctx.reply("Now send the url image:");
    const fileCtx = await conversation.waitFor("message:text");

    const fileUrl = "www";
    if(game.id === "0"){
      const newGame = await gamesClient.create({name: game.name},token)
      game.id = newGame.id
    }
    if (baseCard.id === "0"){
      const newBaseCard = await baseCardsClient.create({nameCard:baseCard.nameCard, gameId:game.id},token);
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
