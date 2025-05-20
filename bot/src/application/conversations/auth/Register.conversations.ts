import { Conversation } from "@grammyjs/conversations";
import { BotContext } from "../../../types/botContext";
import { session } from "../../../bot/middleware";
import { handleError } from "../../../types/errors";
import { authClient } from "../../../client/client";
import { isValidEmailFormat, isValidPasswordFormat } from "../utils/validate.utils";

export async function registerConversation(
  conversation: Conversation<BotContext, BotContext>,
  ctx: BotContext
) {
  const userId = ctx.from!.id.toString();

  try {
    await ctx.reply("🧑‍💻 What is your name?");
    const name = await conversation.form.text();

    let email: string;
    do {
      await ctx.reply("📧 What is your email?");
      email = await conversation.form.text();

      if (!isValidEmailFormat(email)) {
        await ctx.reply("❌ Invalid email format. Please enter a valid email address.");
      }
    } while (!isValidEmailFormat(email));

    let password: string;
    do {
      await ctx.reply("🔐 Choose a password:");
      password = await conversation.form.text();

      if (!isValidPasswordFormat(password)) {
        await ctx.reply("❌ Password must be at least 6 characters long.");
      }
    } while (!isValidPasswordFormat(password));

    const result = await authClient.register({ name, email, password });
    session.save(userId, result);

    await ctx.reply("✅ You have successfully registered!");
  } catch (error) {
    await handleError(ctx, error);
  }
}
