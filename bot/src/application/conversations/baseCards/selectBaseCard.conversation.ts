import { BaseCardResponse } from "@/client/baseCards/response/baseCard.response";
import { GetRequest as GetRequestBaseCards } from "../../../client/baseCards/request/get.request";
import { BotContext } from "../../../types/botContext";
import { Conversation } from "@grammyjs/conversations";
import { PaginationUtils } from "../utils/pagination.utils";
import { BaseCardsClient } from "../../../client/baseCards/baseCard.client";
import { CreateRequest } from "@/client/baseCards/request/create.request";

export async function selectBaseCardConversation(
  conversation: Conversation<BotContext,BotContext>,
  ctx: BotContext,
  gameId: string,
  token: string
): Promise<BaseCardResponse> {
  const baseCardsClient = new BaseCardsClient();

  const baseCardsPaginator = new PaginationUtils<GetRequestBaseCards, BaseCardResponse>(
    baseCardsClient,
    "Select a base card",
    baseCard => `${baseCard.nameCard}`,
    baseCard => baseCard.id,
    token,
    { gameId }, // ✅ Pasar directamente el gameId al principio
    "No se pudieron cargar las cartas base",
    10
  );

  const baseCard = await baseCardsPaginator.handle(conversation, ctx);
  
  if (baseCard.id === "0") {
    const request: CreateRequest = {
      nameCard: (baseCard as { id: "0"; name: string }).name,
      gameId: gameId,
    };
    const createdBaseCard = await baseCardsClient.create(
      request,
      token
    );
    await ctx.reply(`✅ Base card creada: ${createdBaseCard.nameCard}`);
    return createdBaseCard;
  }

  return baseCard as BaseCardResponse;
}
