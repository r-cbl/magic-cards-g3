import { Menu } from "@grammyjs/menu";
import { BotContext } from "@/types/botContext";
import { authMenu } from "./auth/auth.menus";
import { withPreventDuplicateLogin } from "../../bot/middleware";
import { cardsMenu } from "./cards/cards.menus";

export const mainMenu = new Menu<BotContext>("main-menu")
    .text("Registrarse", withPreventDuplicateLogin( async (ctx) => {
        await ctx.conversation.enter("registerConversation")
    }))
    .text("🔐 Iniciar sesión", withPreventDuplicateLogin(async (ctx) => {
        await ctx.conversation.enter("loginConversation");
    }))
    .row()
    .submenu("📢 Publicaciones", "publications-menu")
    .row()
    .submenu("🃏 Cartas", "cards-menu")
    .submenu("💸 Ofertas", "offers-menu")
    .row()
    .submenu("⚙️ Cuenta", "auth-menu");

mainMenu.register(authMenu);
mainMenu.register(cardsMenu);

export async function showMainMenu(ctx: BotContext) {
    await ctx.reply("📋 Menú principal:", {
      reply_markup: mainMenu,
    });
  }
  
  