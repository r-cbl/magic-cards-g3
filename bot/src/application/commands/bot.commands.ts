// application/commands/bot.ts
import { Bot } from "grammy";
import { BotContext } from "../../types/botContext";
import { registerAuthCommands } from "./auth/authCommands";

export function registerAllCommands(bot: Bot<BotContext>) {
  bot.command("start", (ctx) => ctx.reply("Welcome!"));
  bot.command("test", (ctx) => ctx.reply("The test is working"));
  
  registerAuthCommands(bot);
}
