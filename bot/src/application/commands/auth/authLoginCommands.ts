// src/application/commands/auth/authLoginCommand.ts
import { Bot } from "grammy";
import { BotContext } from "../../../types/botContext";

export function registerAuthLoginCommand(bot: Bot<BotContext>) {
  bot.command("login", async (ctx) => {
    await ctx.conversation.enter("loginConversation");
  });
}

