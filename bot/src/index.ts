// src/index.ts
import { setupBot } from './bot/setupBot';
import 'dotenv/config';
import logger from './utils/logger';

async function main() {
  try {
    const bot = await setupBot();
    logger.info('🤖 Bot is starting...');
    await bot.start();
  } catch (err) {
    logger.error('❌ Failed to start the bot:', err);
  }
}

main();
