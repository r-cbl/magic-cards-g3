import { handleError } from "../../../types/errors";
import { session } from "../../../bot/middleware";
import { CardsClient } from "../../../client/cards/cards.client";
import { BotContext } from "../../../types/botContext";
import { Conversation } from "@grammyjs/conversations";
import { GetRequest } from "../../../client/cards/request/get.request";
import { CardResponse } from "../../../client/cards/response/card.response";
import { PaginationUtils } from "../utils/pagination.utils";

export async function getAllCardConversation(
    ctx: BotContext
  ) {
    const userId = ctx.from!.id.toString();
    const user = session.get(userId)!;
    const ownerId = user.user.id;
    const token = user.tokens.accessToken;
    const cardsClient = new CardsClient();
    try{
        const cardsPaginator = new PaginationUtils<GetRequest, CardResponse>(
            cardsClient,
            "Cards: ",
            card => `🃏 ${card.cardBase.Name} - 🎮 ${card.game.Name}`,
            token,
            {ownerId},
            10,
            false
        );
        await cardsPaginator.handleReadOnly( ctx);
    } catch(error){
        handleError(ctx,error);
    }
  }