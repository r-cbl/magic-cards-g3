// application/commands/bot.ts
import { Bot } from "grammy";
import { BotContext } from "../../types/botContext";
import { registerAuthConversations } from "./auth/Auth.conversation";

export function registerAllConversations(bot: Bot<BotContext>) {
    registerAuthConversations(bot)
}
