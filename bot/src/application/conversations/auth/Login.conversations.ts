import { Conversation } from "@grammyjs/conversations";
import { BotContext } from "../../../types/botContext";
import { session } from "../../../bot/middleware";
import { handleError } from "../../../types/errors";
import { authClient } from "../../../client/client";

export async function loginConversation(
  conversation: Conversation<BotContext, BotContext>,
  ctx: BotContext
) {
  const userId = ctx.from!.id.toString();

  try {
    await ctx.reply("📧 Enter your email:");
    const email = await conversation.form.text();

    await ctx.reply("🔐 Enter your password:");
    const password = await conversation.form.text();

    const result = await authClient.login({ email, password });

    if (!result || !result.tokens.accessToken) {
      throw new Error("Invalid credentials");
    }

    session.save(userId!, result);

    await ctx.reply("✅ Login successful!");
  } catch (error) {
    await handleError(ctx, error);
  }
}
