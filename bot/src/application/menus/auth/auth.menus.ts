import { Menu } from "@grammyjs/menu";
import { BotContext } from "@/types/botContext";
import { getCurrentUser } from "../../../application/conversations/auth/CurrentUser.conversations";
import { session, withAuth } from "../../../bot/middleware";

export const authMenu = new Menu<BotContext>("auth-menu")
  .text("👤 View Email", withAuth(getCurrentUser))
  .row()
  .text("🔓 Log out", withAuth(async (ctx) => {
    session.delete(ctx.from!.id.toString());
    await ctx.reply("You have been logged out.");
  }))
  .row()
  .back("🔙 Back");
