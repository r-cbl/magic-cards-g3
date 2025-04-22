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

    session.save(ctx.from!.id.toString(), result); //El middelware valida que viene. 
    
    await ctx.reply("✅ Login exitoso!");
      } catch (error) {
    if (error instanceof Error) {
      console.error("Register error:", error.message);
      await ctx.reply("❌ Inicio de sesion fallido. Por favor, intenta nuevamente.");
    } else {
      await ctx.reply("❌ Inicio de sesion fallido. Por favor, intenta nuevamente.");
    }
  }

}
