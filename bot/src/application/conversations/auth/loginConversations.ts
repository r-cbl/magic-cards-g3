import { Conversation } from "@grammyjs/conversations";
import { BotContext } from "../../../types/botContext";
import { AuthClient } from "../../../client/auth/auth.client";
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

    if (!result || !result.tokens.accessToken) {
      throw new Error("Invalid credentials");
    }

    const userId = ctx.from!.id.toString();
    context.save(userId, result);

    await ctx.reply("✅ Successfully logged in!");
  } catch (error) {
    console.error("Login error:", error);
    if (error instanceof Error) {
      await ctx.reply(`❌ Login failed: ${error.message}`);
    } else {
      await ctx.reply("❌ Login failed. Please check your credentials and try again.");
    }
  }
}
