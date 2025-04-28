import { Conversation } from "@grammyjs/conversations";
import { BotContext } from "../../../types/botContext";
import { CardsClient } from "../../../client/cards/cards.client";
import { GamesClient } from "../../../client/games/games.client";
import { BaseCardsClient } from "../../../client/baseCards/baseCard.client";
import { session } from "../../../bot/middleware";
import { GetRequest as GetRequestGame} from "../../../client/games/request/get.request";
import { GetRequest as GetRequestBaseCards} from "../../../client/baseCards/request/get.request";
import { GameResponse } from "../../../client/games/response/game.response";
import { PaginationUtils } from "../utils/pagination.utils";
import logger from "../../../utils/logger";
import { BaseCardResponse } from "@/client/baseCards/response/baseCard.response";
import { CreateRequest as CreateRequestCards} from "@/client/cards/request/create.request";
import { CreateRequest as CreateRequestGames} from "@/client/games/request/create.request";


export async function createCardConversation(
  conversation: Conversation<BotContext, BotContext>,
  ctx: BotContext
) {
  const userId = ctx.from!.id.toString();
  const user = session.get(userId)!
  const token = user.tokens.accessToken;
  const cardsClient = new CardsClient();
  const gamesClient = new GamesClient();
  const baseCardsClient = new BaseCardsClient();

  try {

const gamePaginator = new PaginationUtils<GetRequestGame, GameResponse>(
                  gamesClient,
                  "Select a game",
                  game => `${game.id} — ${game.name}`,
                  game => game.id,
                  token,
                  {},
                  "No se pudieron cargar juegos",
                  10
                  );

  const gameObject = await gamePaginator.handle(conversation,ctx);
  let finalGameObject = gameObject;

  if (gameObject.id === "0") {
    const gameRequest: CreateRequestGames = { name: gameObject.name };
    finalGameObject = await gamesClient.create(gameRequest, token);
  
    await ctx.reply(`✅ Juego creado exitosamente: ${finalGameObject.name}`);

  }
  console.log("Llegue!")
  const baseCardsPaginator = new PaginationUtils<GetRequestBaseCards, BaseCardResponse>(
    baseCardsClient,
    "Select a game",
    baseCard => `${baseCard.id} — ${baseCard.nameCard}`,
    baseCard => baseCard.id,
    session.get(userId)!.tokens.accessToken,
    {},
    "No se pudieron cargar las cartas base",
    10
    );
    console.log("Llegue!")
    const baseCardObject = await baseCardsPaginator.handle(conversation,ctx);
    console.log("info:", JSON.stringify(baseCardObject, null, 2));
    const request : CreateRequestCards = {
      cardBaseId: baseCardObject.id,
      statusCard: 100,
      urlImage: "www",
      ownerId: user.user.id,
    }
    cardsClient.create(request,token);

} catch (error) {
    if (error instanceof Error) {

    } else {

    }
  }
}
