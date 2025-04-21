import { Bot} from "grammy";
import 'dotenv/config';
import { conversations } from "@grammyjs/conversations";
import { BotContext } from "../types/botContext";
import { registerAllConversations } from "../application/conversations/bot.conversations";
import { registerAllMenus } from "../application/menus/bot.menus";
import { showMenuOnFirstMessage } from "./middleware";


export async function setupBot(): Promise<Bot<BotContext>> {
  const bot = new Bot<BotContext>(process.env.BOT_TOKEN!);

  bot.use(conversations());
  registerAllConversations(bot);
  registerAllMenus(bot)
  bot.use(showMenuOnFirstMessage);


  return bot;
}
