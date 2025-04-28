import { Conversation } from "@grammyjs/conversations";
import { BotContext } from "../../../types/botContext";
import { CardsClient } from "../../../client/cards/cards.client";

export async function createCardConversation(
  conversation: Conversation<BotContext, BotContext>,
  ctx: BotContext
) {
  const cardsClient = new CardsClient();

  try {

  } catch (error) {
    if (error instanceof Error) {

    } else {

    }
  }
}
