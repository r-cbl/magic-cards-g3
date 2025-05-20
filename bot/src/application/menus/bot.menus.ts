// src/application/menus/bot.menus.ts
import { Bot } from "grammy";
import { BotContext } from "../../types/botContext";
import { authMenu } from "./auth/auth.menus";
import { mainMenu } from "./main.menus";
import { cardsMenu } from "./cards/cards.menus";
import { publicationMenu } from "./publications/publications.menus";
import { offersMenu } from "./offers/offers.menu";

export function registerAllMenus(bot: Bot<BotContext>) {
    bot.use(mainMenu);
    bot.use(authMenu);
    bot.use(cardsMenu);
    bot.use(publicationMenu);
    bot.use(offersMenu);
}
