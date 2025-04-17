import { BotContext } from "@/types/botContext";
import { createConversation } from "@grammyjs/conversations";
import { Bot } from "grammy";
import { loginConversation } from "./loginConversations";
import { registerConversation } from "./registerConversations";

export function registerAuthConversations(bot: Bot<BotContext>) {
    bot.use(createConversation(loginConversation));
    bot.use(createConversation(registerConversation))
  }