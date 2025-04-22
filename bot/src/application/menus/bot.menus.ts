// src/application/menus/bot.menus.ts
import { Bot } from "grammy";
import { BotContext } from "../../types/botContext";
import { authMenu } from "./auth/Auth.menus";
import { mainMenu } from "./Main.menus";

export function registerAllMenus(bot: Bot<BotContext>) {
    bot.use(mainMenu)
    bot.use(authMenu);
}
