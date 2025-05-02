import { BotContext } from "@/types/botContext";
import { createConversation } from "@grammyjs/conversations";
import { Bot } from "grammy";
import logger from '../../../utils/logger';
import { createCardConversation } from "./Create.conversations";
import { getAllCardConversation } from "./GetAll.conversations";

export function registerCardConversations(bot: Bot<BotContext>) {
    logger.info('Registering card conversations');
    bot.use(createConversation(createCardConversation));
    
    //bot.use(createConversation(getAllCardConversation));
    logger.info('Card conversations registered successfully');
}