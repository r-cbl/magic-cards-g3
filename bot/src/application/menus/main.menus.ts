import { Menu } from "@grammyjs/menu";
import { BotContext } from "@/types/botContext";
import { authMenu } from "./auth/auth.menus";

export const mainMenu = new Menu<BotContext>("main-menu")
    .text("Registrarse", async (ctx) => {
        await ctx.conversation.enter("registerConversation")
    })
    .text("🔐 Iniciar sesión", async (ctx) => {
        await ctx.conversation.enter("loginConversation");
    })
    .row()
    .submenu("📢 Publicaciones", "publications-menu")
    .row()
    .submenu("🃏 Cartas", "cards-menu")
    .submenu("💸 Ofertas", "offers-menu")
    .row()
    .text("👤 Ver Perfil", async (ctx) => {
        await ctx.reply("Mostrando perfil...");
    })
    .text("🔓 Cerrar sesión", async (ctx) => {
        await ctx.reply("Sesión cerrada.");
    })
    .row()
    .submenu("⚙️ Cuenta", "auth-menu");

mainMenu.register(authMenu);

export async function showMainMenu(ctx: BotContext) {
    await ctx.reply("📋 Menú principal:", {
      reply_markup: mainMenu,
    });
  }
  
  