import { Menu } from "@grammyjs/menu";
import { BotContext } from "@/types/botContext";
import { getCurrentUser } from "../../../application/conversations/auth/CurrentUser.conversations";
import { withAuth } from "../../../bot/middleware";

export const authMenu = new Menu<BotContext>("auth-menu")
  .text("👤 Ver Perfil", withAuth(getCurrentUser))
  .row()
  .text("🔓 Cerrar sesión", async (ctx) => {
    await ctx.reply("Sesión cerrada.");
  })
  .row()
  .back("🔙 Volver");
