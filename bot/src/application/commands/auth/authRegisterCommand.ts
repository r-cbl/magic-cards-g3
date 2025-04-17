// src/application/commands/auth/authLoginCommand.ts
import { Bot } from "grammy";
import { BotContext } from "../../../types/botContext";

export function registerAuthRegisterCommand(bot: Bot<BotContext>) {
  bot.command("register", async (ctx) => {
    await ctx.conversation.enter("registerConversation");
  });
}

