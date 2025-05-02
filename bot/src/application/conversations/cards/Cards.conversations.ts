import { BotContext } from "@/types/botContext";
import { createConversation } from "@grammyjs/conversations";
import { Bot } from "grammy";
import logger from '../../../utils/logger';
import { createCardConversation } from "./Create.conversations";

export function registerCardConversations(bot: Bot<BotContext>) {
    logger.info('Registering card conversations');
    bot.use(createConversation(createCardConversation));
    logger.info('Card conversations registered successfully');
}