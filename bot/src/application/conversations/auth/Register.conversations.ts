import { Conversation } from "@grammyjs/conversations";
import { BotContext } from "../../../types/botContext";
import { AuthClient } from "../../../client/auth/auth.client";
import { session } from "../../../bot/middleware";
import logger from '../../../utils/logger';

export async function registerConversation(
  conversation: Conversation<BotContext, BotContext>,
  ctx: BotContext
) {
  const authClient = new AuthClient();
  const userId = ctx.from!.id.toString();

  try {
    logger.info(`Starting registration process for user ${userId}`);

    await ctx.reply("🧑‍💻 ¿Cual es tu nombre?");
    const name = await conversation.form.text();
    logger.info(`User ${userId} entered name`);

    await ctx.reply("📧 ¿Cual es tu mail?");
    const email = await conversation.form.text();
    logger.info(`User ${userId} entered email`);

    await ctx.reply("🔐 Elije una contraseña:");
    const password = await conversation.form.text();
    logger.info(`User ${userId} entered password`);

    logger.info(`Attempting registration for user ${userId} with email ${email}`);
    const result = await authClient.register({ name, email, password });

    session.save(userId!, result);
    logger.info(`Successful registration for user ${userId}`);

    await ctx.reply("✅ Te has registrado correctamente!");
  } catch (error) {
    logger.error(`Registration error for user ${userId}:`, error);
    await ctx.reply("❌ Registro fallido. Por favor, intenta nuevamente.");
  }
}
