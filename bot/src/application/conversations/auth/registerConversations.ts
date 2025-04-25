import { Conversation } from "@grammyjs/conversations";
import { BotContext } from "../../../types/botContext";
import { AuthClient } from "../../../client/authClient";
import { context } from "../../../domain/repository/container";

export async function registerConversation(
  conversation: Conversation<BotContext, BotContext>,
  ctx: BotContext
) {
  const authClient = new AuthClient();

  try {
    await ctx.reply("🧑‍💻 What's your name?");
    const name = await conversation.form.text();

    await ctx.reply("📧 What's your email?");
    const email = await conversation.form.text();

    await ctx.reply("🔐 Choose a password:");
    const password = await conversation.form.text();

    const result = await authClient.register({ name, email, password });

        // Guardar sesión por ID de Telegram
    const telegramUserId = ctx.from?.id.toString();
    console.log(ctx.from?.id.toString())
    if (telegramUserId) {
        context.save(telegramUserId, result);
    }

    await ctx.reply("✅ You're registered and logged in!");
  } catch (error) {
    console.error("Register error:", error);
    await ctx.reply("❌ Registration failed. Please try again.");
  }
}
