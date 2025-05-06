import { BotContext } from "@/types/botContext";
import { createConversation } from "@grammyjs/conversations";
import { Bot } from "grammy";
import logger from '../../../utils/logger';
import { createPublicationConversation } from "./Create.conversations";
import { deletePublicationConversation } from "./Delete.conversations";

export function registerPublicationsConversations(bot: Bot<BotContext>) {
    logger.info('Registering publication conversations');
    bot.use(createConversation(createPublicationConversation));
    bot.use(createConversation(deletePublicationConversation));
    logger.info('Publication conversations registered successfully');
}