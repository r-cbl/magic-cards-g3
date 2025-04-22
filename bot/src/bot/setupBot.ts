import { Bot } from "grammy";
import 'dotenv/config';
import { conversations } from "@grammyjs/conversations";
import { BotContext } from "../types/botContext";
import { registerAllConversations } from "../application/conversations/bot.conversations";
import { registerAllMenus } from "../application/menus/bot.menus";
import { showMenuOnFirstMessage } from "./middleware";
import { showMainMenu } from "../application/menus/main.menus";
import { handleError } from "../types/errors";

export async function setupBot(): Promise<Bot<BotContext>> {
  const bot = new Bot<BotContext>(process.env.BOT_TOKEN!);

  bot.use(async (ctx, next) => {
    try {
      await next();
    } catch (err) {
      await handleError(ctx, err);
    }
  });

  bot.use(conversations());
  registerAllConversations(bot);
  registerAllMenus(bot);
  bot.use(showMenuOnFirstMessage);
  bot.hears("Menu", showMainMenu);

  bot.catch(async (err) => {
    console.error("💥 Uncaught error:", err.error);
    if (err.ctx) {
      await handleError(err.ctx, err.error);
    }
  });

  return bot;
}
