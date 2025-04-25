import { Conversation } from "@grammyjs/conversations";
import { BotContext } from "../../../types/botContext";
import { AuthClient } from "../../../client/authClient";
import { context } from "../../../domain/repository/container";

export async function loginConversation(
  conversation: Conversation<BotContext, BotContext>,
  ctx: BotContext
) {
  const authClient = new AuthClient();

  try {
    await ctx.reply("📧 Enter your email:");
    const email = await conversation.form.text();

    await ctx.reply("🔐 Enter your password:");
    const password = await conversation.form.text();

    const result = await authClient.login({ email, password });

    if (!result || result.user.email !== email) {
      throw new Error("Invalid credentials");
    }

    // Guardar sesión por ID de Telegram
    const userId = ctx.from!.id.toString();
    context.get(userId);

    await ctx.reply("✅ Logged in!");
  } catch (error) {
    console.error("Login error:", error);
    await ctx.reply("❌ Login failed. Please check your credentials and try again.");
  }
}
