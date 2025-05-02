import { BotContext } from "@/types/botContext";
import { createConversation } from "@grammyjs/conversations";
import { Bot } from "grammy";
import logger from '../../../utils/logger';
import { createPublicationConversation } from "./Create.conversations";

export function registerPublicationsConversations(bot: Bot<BotContext>) {
    logger.info('Registering publication conversations');
    bot.use(createConversation(createPublicationConversation));
    logger.info('Publication conversations registered successfully');
}