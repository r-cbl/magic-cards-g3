import { BotContext } from "@/types/botContext";
import { createConversation } from "@grammyjs/conversations";
import { Bot } from "grammy";
import logger from '../../../utils/logger';
import { createOfferConversation } from "./Create.conversations";
import { getReceivedOffersConversation } from "./GetRecived.conversations";

export function registerOffersConversations(bot: Bot<BotContext>) {
    logger.info('Registering offer conversations');
    bot.use(createConversation(createOfferConversation));
    bot.use(createConversation(getReceivedOffersConversation));
    logger.info('Offer conversations registered successfully');
}