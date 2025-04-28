import { Conversation } from "@grammyjs/conversations";
import { BotContext } from "../../../types/botContext";
import { CardsClient } from "../../../client/cards/cards.client";
import { session } from "../../../bot/middleware";
import { CreateRequest as CreateRequestCards} from "@/client/cards/request/create.request";
import { selectGameConversation } from "../games/selectGame.conversation";
import { selectBaseCardConversation } from "../baseCards/selectBaseCard.conversation";


export async function createCardConversation(
  conversation: Conversation<BotContext, BotContext>,
  ctx: BotContext
) {
  const userId = ctx.from!.id.toString();
  const user = session.get(userId)!;
  const token = user.tokens.accessToken;
  const cardsClient = new CardsClient();

  try {
    const game = await selectGameConversation(conversation, ctx,token);
    const baseCard = await selectBaseCardConversation(conversation, ctx,token, game.id);

    const request: CreateRequestCards = {
      cardBaseId: baseCard.id,
      statusCard: 100,
      urlImage: "www",
      ownerId: user.user.id,
    };

    //await cardsClient.create(request, token);
    await ctx.reply(`✅ Carta creada exitosamente!`);

  } catch (error) {
    console.error(error);
    await ctx.reply("⚠️ Ocurrió un error inesperado. Intenta nuevamente.");
  }
}
