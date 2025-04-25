import { BotContext } from "@/types/botContext";
import { context } from "../../../domain/repository/container";
import { Bot } from "grammy";
import { AuthClient } from "../../../client/authClient";

export function registerAuthMeCommand(bot: Bot<BotContext>) {
  bot.command("me", async (ctx) => {
    const authClient = new AuthClient();

    try {
      const userId = ctx.from!.id.toString();
      const rta = context.get(userId);

      if (!rta) {
        await ctx.reply("❌ No estás logueado.");
        return;
      }

      const result = await authClient.getCurrentUser(rta.tokens.accessToken);
      await ctx.reply(`👤 Usuario: ${result.user.email} + ${result.user.id}`);
    } catch (error) {
      console.error("Login error:", error);
      await ctx.reply("❌ Falló la autenticación.");
    }
  });
}
