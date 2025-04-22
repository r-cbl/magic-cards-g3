import { Conversation } from "@grammyjs/conversations";
import { BotContext } from "../../../types/botContext";
import { AuthClient } from "../../../client/auth/auth.client";
import { session } from "../../../bot/middleware";


export async function loginConversation(
  conversation: Conversation<BotContext, BotContext>,
  ctx: BotContext
) {
  const authClient = new AuthClient();

  try {
    await ctx.reply("📧 Ingresa tu email:");
    const email = await conversation.form.text();

    await ctx.reply("🔐 Ingresa tu contraseña:");
    const password = await conversation.form.text();

    const result = await authClient.login({ email, password });

    if (!result || !result.tokens.accessToken) {
      throw new Error("Invalid credentials");
    }

    const telegramUserId = ctx.from?.id.toString();
    if (!telegramUserId) {
      await ctx.reply("❌ No se pudo obtener tu ID de Telegram.");
      return;
    }
  
    const existingSession = session.get(telegramUserId);
    if (existingSession && existingSession.tokens.expirationDate > new Date()) {
      await ctx.reply("⚠️ Ya estás logueado. Cerrá sesión antes de iniciar una nueva.");
      return;
    }
    
    session.save(telegramUserId, result);
    

    await ctx.reply("✅ Login exitoso!");
      } catch (error) {
    if (error instanceof Error) {
      console.error("Register error:", error.message);
      await ctx.reply("❌ Registro fallido. Por favor, intenta nuevamente.");
    } else {
      await ctx.reply("❌ Registro fallido. Por favor, intenta nuevamente.");
    }
  }

}
