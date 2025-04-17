// src/bot/setupBot.ts
import { Bot, session } from "grammy";
import 'dotenv/config';
import { conversations } from "@grammyjs/conversations";
import { registerAllCommands } from "../application/commands/bot.commands";
import { BotContext } from "../types/botContext";
import { registerAllConversations } from "../application/conversations/bot.conversations";


export async function setupBot(): Promise<Bot<BotContext>> {
  const bot = new Bot<BotContext>(process.env.BOT_TOKEN!);

  bot.use(conversations());
  registerAllConversations(bot);
  registerAllCommands(bot);

  return bot;
}
