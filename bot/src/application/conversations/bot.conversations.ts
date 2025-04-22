// application/commands/bot.ts
import { Bot } from "grammy";
import { BotContext } from "../../types/botContext";
import { registerAuthConversations } from "./auth/Auth.conversation";
import logger from '../../utils/logger';

export function registerAllConversations(bot: Bot<BotContext>) {
    logger.info('Registering all conversations');
    registerAuthConversations(bot);
    logger.info('All conversations registered successfully');
}
