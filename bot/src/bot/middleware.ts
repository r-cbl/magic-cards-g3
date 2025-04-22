import { MiddlewareFn } from "grammy";
import { BotContext } from "../types/botContext";
import { mainMenu } from "../application/menus/main.menus";
import { InMemoryAuthSessionRepository } from "./session/InMemoryAuthSession.repository";

export const session = new InMemoryAuthSessionRepository()
const shownMenuToUsers = new Set<string>();


export function withAuth(handler: (ctx: BotContext) => Promise<void>) {
  return async (ctx: BotContext) => {
    const userId = ctx.from?.id.toString();
    if (!userId) {
      await ctx.reply("❌ No se pudo obtener tu ID de usuario.");
      return;
    }

    const authSession = session.get(userId);

    if (!authSession) {
      await ctx.reply("❌ Debes iniciar sesión primero.");
      return;
    }

    const now = new Date();
    const expires = authSession.tokens.expirationDate;

    if (expires && expires < now) {
      session.delete(userId);
      await ctx.reply("⚠️ Tu sesión ha expirado. Por favor, iniciá sesión nuevamente.");
      return;
    }

    await handler(ctx);
  }
};

export function withPreventDuplicateLogin(handler: (ctx: BotContext) => Promise<void>) {
  return async (ctx: BotContext) => {
    const userId = ctx.from?.id.toString();
    if (!userId) {
      await ctx.reply("❌ No se pudo obtener tu ID de Telegram.");
      return;
    }

    const existingSession = session.get(userId);
    const now = new Date();

    if (existingSession && existingSession.tokens.expirationDate > now) {
      await ctx.reply("⚠️ Ya estás logueado. Cerrá sesión antes de iniciar una nueva.");
      return;
    }

    await handler(ctx);
  };
}

export const showMenuOnFirstMessage: MiddlewareFn<BotContext> = async (ctx, next) => {
  const userId = ctx.from?.id?.toString();
  if (!userId) return await next();


  if (!session.get(userId) && !shownMenuToUsers.has(userId)) {
    await ctx.reply("👋 ¡Bienvenido! Elegí una opción desde el menú de abajo 👇", {
      reply_markup: mainMenu,
    });

    await ctx.reply("ℹ️ Si más adelante querés volver a ver el menú, escribí: *Menu*", {
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