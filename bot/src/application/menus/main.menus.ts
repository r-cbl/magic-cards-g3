import { Menu } from "@grammyjs/menu";
import { BotContext } from "@/types/botContext";
import { authMenu } from "./auth/auth.menus";
import { withPreventDuplicateLogin } from "../../bot/middleware";
import { cardsMenu } from "./cards/cards.menus";
import { publicationMenu } from "./publications/publications.menus";
import { offersMenu } from "./offers/offers.menu";

export const mainMenu = new Menu<BotContext>("main-menu")
  .text("🔐 Login", withPreventDuplicateLogin(async (ctx) => {
    await ctx.conversation.enter("loginConversation");
  }))
  .text("📝 Register", withPreventDuplicateLogin(async (ctx) => {
    await ctx.conversation.enter("registerConversation");
  }))
  .row()
  .submenu("📢 Publications", "publication-menu")
  .row()
  .submenu("🃏 Cards", "cards-menu")
  .submenu("💸 Offers", "offers-menu")
  .row()
  .submenu("⚙️ Account", "auth-menu");

  mainMenu.register(authMenu);
  mainMenu.register(cardsMenu);
  mainMenu.register(publicationMenu);
  mainMenu.register(offersMenu);

export async function showMainMenu(ctx: BotContext) {
  await ctx.reply("📋 Main Menu:", {
    reply_markup: mainMenu,
  });
}
