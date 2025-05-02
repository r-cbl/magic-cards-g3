import { MiddlewareFn } from "grammy";
import { BotContext } from "../types/botContext";
import { mainMenu } from "../application/menus/main.menus";
import { InMemoryAuthSessionRepository } from "./session/InMemoryAuthSession.repository";
import { SessionError, handleError } from "../types/errors";

export const session = new InMemoryAuthSessionRepository()
const shownMenuToUsers = new Set<string>();


export function withAuth(handler: (ctx: BotContext) => Promise<void>) {
  return async (ctx: BotContext) => {
    try {
      const userId = ctx.from?.id.toString();
      if (!userId) {
        throw new SessionError("Could not retrieve user ID", "❌ Unable to get your user ID.");
      }

      const authSession = session.get(userId);
      if (!authSession) {
        throw new SessionError("Session not found", "❌ You must log in first.");
      }

      const now = new Date();
      const expires = authSession.tokens.expirationDate;
      if (expires && expires < now) {
        session.delete(userId);
        throw new SessionError("Session expired", "⚠️ Your session has expired. Please log in again.");
      }

      await handler(ctx);

    } catch (error) {
      await handleError(ctx, error);
    }
  };
}

export function withPreventDuplicateLogin(handler: (ctx: BotContext) => Promise<void>) {
  return async (ctx: BotContext) => {
    try {
      const userId = ctx.from?.id.toString();
      if (!userId) {
        throw new SessionError("Could not retrieve Telegram user ID", "❌ Unable to get your Telegram user ID.");
      }

      const existingSession = session.get(userId);
      const now = new Date();

      if (existingSession && existingSession.tokens.expirationDate > now) {
        throw new SessionError(
          "Active session detected",
          "⚠️ You are already logged in. Please log out before starting a new session."
        );
      }

      await handler(ctx);
    } catch (error) {
      await handleError(ctx, error);
    }
  };
}

export const showMenuOnFirstMessage: MiddlewareFn<BotContext> = async (ctx, next) => {
  const userId = ctx.from?.id?.toString();
  if (!userId) return await next();


  if (!session.get(userId) && !shownMenuToUsers.has(userId)) {
    await ctx.reply("👋 Welcome! Choose an option from the menu below 👇", {
      reply_markup: mainMenu,
    });
    
    await ctx.reply("ℹ️ If you want to see the menu again later, type: *Menu*", {
      parse_mode: "Markdown",
    });

    shownMenuToUsers.add(userId);
  }

  return next();
};


export const validateEmail: MiddlewareFn<BotContext> = async (ctx, next) => {
  const email = ctx.match as string;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!emailRegex.test(email)) {
    await ctx.reply("❌ Invalid email format. Please enter a valid email address.");
    return;
  }

  return next();
};

export const validatePassword: MiddlewareFn<BotContext> = async (ctx, next) => {
  const password = ctx.match as string;
  
  if (password.length < 6) {
    await ctx.reply("❌ Password must be at least 6 characters long.");
    return;
  }

  return next();
}; 