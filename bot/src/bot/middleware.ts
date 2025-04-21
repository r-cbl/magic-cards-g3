import { MiddlewareFn } from "grammy";
import { BotContext } from "../types/botContext";
import { context } from "../domain/repository/container";
import { mainMenu } from "../application/menus/main.menus";

export const authenticate: MiddlewareFn<BotContext> = async (ctx, next) => {
  const userId = ctx.from?.id.toString();
  if (!userId) {
    await ctx.reply("❌ User ID not found");
    return;
  }

  const user = context.get(userId);
  if (!user) {
    await ctx.reply("❌ Please login first");
    return;
  }

  return next();
};

export const showMenuOnFirstMessage: MiddlewareFn<BotContext> = async (ctx, next) => {
  if (!context.get(ctx.from!.id.toString())) {
    await ctx.reply("👋 ¡Bienvenido! Elegí una opción:", {
      reply_markup: mainMenu,
    });
  }

  await next();
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