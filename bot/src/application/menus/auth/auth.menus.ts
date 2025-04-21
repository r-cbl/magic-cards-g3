// src/application/menus/authMenus.ts
import { Menu } from "@grammyjs/menu";
import { BotContext } from "@/types/botContext";

export const authMenu = new Menu<BotContext>("auth-menu")
  .text("👤 Ver Perfil", async (ctx) => {
    await ctx.reply("Mostrando perfil...");
  })
  .row()
  .text("🔓 Cerrar sesión", async (ctx) => {
    await ctx.reply("Sesión cerrada.");
  })
  .row()
  .back("🔙 Volver");
