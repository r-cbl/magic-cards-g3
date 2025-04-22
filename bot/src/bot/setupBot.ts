import { Bot} from "grammy";
import 'dotenv/config';
import { conversations } from "@grammyjs/conversations";
import { BotContext } from "../types/botContext";
import { registerAllConversations } from "../application/conversations/Bot.conversations";
import { registerAllMenus } from "../application/menus/Bot.menus";
import { showMenuOnFirstMessage } from "./Middleware";
import { showMainMenu } from "../application/menus/Main.menus";



export async function setupBot(): Promise<Bot<BotContext>> {
  const bot = new Bot<BotContext>(process.env.BOT_TOKEN!);

  bot.use(conversations());
  registerAllConversations(bot);
  registerAllMenus(bot);
  bot.use(showMenuOnFirstMessage);
  bot.hears("Menu", showMainMenu)

  bot.catch((err) => {
    console.error("💥 Uncaught error:", err.error);
  });

  return bot;
}
