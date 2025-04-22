import { BotContext } from "@/types/botContext";
import { createConversation } from "@grammyjs/conversations";
import { Bot } from "grammy";
import { loginConversation } from "./Login.conversations";
import { registerConversation } from "./Register.conversations";
import logger from '../../../utils/logger';

export function registerAuthConversations(bot: Bot<BotContext>) {
    logger.info('Registering auth conversations');
    bot.use(createConversation(loginConversation));
    bot.use(createConversation(registerConversation));
    logger.info('Auth conversations registered successfully');
}