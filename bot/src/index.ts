// src/index.ts
import { setupBot } from './bot/setupBot'; // Ajustá el path si cambió
import 'dotenv/config';

async function main() {
  try {
    const bot = await setupBot();
    console.log('🤖 Bot is starting...');
    await bot.start();
  } catch (err) {
    console.error('❌ Failed to start the bot:', err);
  }
}

main();
