import { Menu } from "@grammyjs/menu";
import { BotContext } from "@/types/botContext";
import { getCurrentUser } from "../../../application/conversations/auth/CurrentUser.conversations";
import { session, withAuth } from "../../../bot/middleware";

export const authMenu = new Menu<BotContext>("auth-menu")
  .text("👤 Ver Email", withAuth(getCurrentUser))
  .row()
  .text("🔓 Cerrar sesión", withAuth(async (ctx) => {
    session.delete(ctx.from!.id.toString());
    await ctx.reply("Sesión cerrada.");
  }))
  .row()
  .back("🔙 Volver");
