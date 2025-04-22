import { Conversation } from "@grammyjs/conversations";
import { BotContext } from "../../../types/botContext";
import { AuthClient } from "../../../client/auth/auth.client";
import { session } from "../../../bot/middleware";
import logger from '../../../utils/logger';

export async function loginConversation(
  conversation: Conversation<BotContext, BotContext>,
  ctx: BotContext
) {
  const authClient = new AuthClient();
  const userId = ctx.from!.id.toString();

  try {
    logger.info(`Starting login process for user ${userId}`);

    await ctx.reply("📧 Ingresa tu email:");
    const email = await conversation.form.text();
    logger.info(`User ${userId} entered email`);

    await ctx.reply("🔐 Ingresa tu contraseña:");
    const password = await conversation.form.text();
    logger.info(`User ${userId} entered password`);

    logger.info(`Attempting login for user ${userId} with email ${email}`);
    const result = await authClient.login({ email, password });

    if (!result || !result.tokens.accessToken) {
      logger.warn(`Invalid credentials for user ${userId}`);
      throw new Error("Invalid credentials");
    }

    session.save(userId!, result);
    logger.info(`Successful login for user ${userId}`);
    
    await ctx.reply("✅ Login exitoso!");
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`Login error for user ${userId}:`, error.message);
      await ctx.reply("❌ Inicio de sesion fallido. Por favor, intenta nuevamente.");
    } else {
      logger.error(`Unknown login error for user ${userId}:`, error);
      await ctx.reply("❌ Inicio de sesion fallido. Por favor, intenta nuevamente.");
    }
  }
}
