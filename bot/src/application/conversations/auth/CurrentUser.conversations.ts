import { BotContext } from "../../../types/botContext";
import { AuthClient } from "../../../client/auth/auth.client";
import { session } from "../../../bot/middleware";
import { handleError } from "../../../types/errors";

export async function getCurrentUser(ctx: BotContext) {
  const authClient = new AuthClient();

  try {
    const user = session.get(ctx.from!.id.toString());
    const result = await authClient.getCurrentUser(user!.tokens.accessToken);

    await ctx.reply(`📧 Your email is: ${result.user.email}`);
  } catch (error) {
    await handleError(ctx, error);
  }
}
