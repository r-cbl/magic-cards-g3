import { CardsClient } from "@/client/cards/cards.client";
import { GetRequest } from "@/client/cards/request/get.request";
import { CardResponse } from "@/client/cards/response/card.response";
import { BotContext } from "@/types/botContext";
import { Conversation } from "@grammyjs/conversations";
import { PaginationUtils } from "../utils/pagination.utils";
import { CreateRequest } from "@/client/cards/request/create.request";

// export async function selectBaseCardConversation(this: any, 
//     conversation: Conversation<BotContext,BotContext>,
//     ctx: BotContext,
//     request: GetRequest,
//     enableOther: boolean,
//     token: string
//   ): Promise<CardResponse> {

//     // const cardsClient = new CardsClient();
//     // const cardsPaginator = new PaginationUtils<GetRequest, CardResponse>(
//     //     cardsClient,
//     //     "Select a card",
//     //     card => `${card.cardBase.name}`,
//     //     token,
//     //     {},
//     //     10,
//     //     enableOther,
//     // );

//     // let card = cardsPaginator.handle(conversation,ctx);
//     // if (card.id === "0") {
//     //   const request: CreateRequest = {
//     //     cardBaseId: this.request.id,
//     //     statusCard: 
//     //     gameId: gameId,
//     //   };
//     //   const createdBaseCard = await baseCardsClient.create(
//     //     request,
//     //     token
//     //   );
//     //   await ctx.reply(`✅ Base card creada: ${createdBaseCard.nameCard}`);
//     //   return createdBaseCard;
//     // }
//     // return card as CardResponse ;
//   }