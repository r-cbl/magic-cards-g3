import { BotContext } from "../../../types/botContext";
import { AuthClient } from "../../../client/auth/Auth.client";
import { session } from "../../../bot/Middleware";


export async function getCurrentUser(
ctx: BotContext
) {
    const authClient = new AuthClient();
    try {
        const user = session.get(ctx.from!.id.toString())
        const result = await authClient.getCurrentUser(user!.tokens.accessToken);

        await ctx.reply(`📧 Tu email es: ${result.user.email}`);
    }catch (error) {
    if (error instanceof Error) {
        console.error("Register error:", error.message);
        await ctx.reply("❌ Registro fallido. Por favor, intenta nuevamente.");
    } else {
        await ctx.reply("❌ Registro fallido. Por favor, intenta nuevamente.");
    }
  }
}