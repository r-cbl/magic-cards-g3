import { BotContext } from "./botContext";
import logger from '../utils/logger';

export class BotError extends Error {
  constructor(
    message: string,
    public readonly userMessage?: string,
    public readonly originalError?: unknown
  ) {
    super(message);
    this.name = 'BotError';
  }
}

export class ApiError extends BotError {
  constructor(
    message: string,
    public readonly statusCode: number,
    userMessage?: string,
    originalError?: unknown
  ) {
    super(message, userMessage, originalError);
    this.name = 'ApiError';
  }
}

export class ValidationError extends BotError {
  constructor(message: string, userMessage?: string) {
    super(message, userMessage);
    this.name = 'ValidationError';
  }
}

export class SessionError extends BotError {
  constructor(message: string, userMessage?: string) {
    super(message, userMessage);
    this.name = 'SessionError';
  }
}

export const handleError = async (ctx: BotContext, error: unknown): Promise<void> => {
  logger.error('Bot error:', error);

  let userMessage = 'An unexpected error occurred. Please try again later.';
  
  if (error instanceof BotError) {
    userMessage = error.userMessage || userMessage;
  } else if (error instanceof Error) {
    userMessage = error.message;
  }

  try {
    await ctx.reply(userMessage);
  } catch (replyError) {
    logger.error('Failed to send error message to user:', replyError);
  }
}; 