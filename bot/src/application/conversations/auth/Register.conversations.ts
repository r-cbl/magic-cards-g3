import { Conversation } from "@grammyjs/conversations";
import { BotContext } from "../../../types/botContext";
import { AuthClient } from "../../../client/auth/auth.client";
import { session } from "../../../bot/middleware";
import { handleError } from "../../../types/errors";
import { showMainMenu } from "../../../application/menus/main.menus";

export async function registerConversation(
  conversation: Conversation<BotContext, BotContext>,
  ctx: BotContext
) {
  const authClient = new AuthClient();
  const userId = ctx.from!.id.toString();

  try {
    await ctx.reply("🧑‍💻 What is your name?");
    const name = await conversation.form.text();

    await ctx.reply("📧 What is your email?");
    const email = await conversation.form.text();

    await ctx.reply("🔐 Choose a password:");
    const password = await conversation.form.text();

    const result = await authClient.register({ name, email, password });
    session.save(userId!, result);

    await ctx.reply("✅ You have successfully registered!");
  } catch (error) {
    await handleError(ctx, error);
  }
}
