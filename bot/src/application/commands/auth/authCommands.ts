import { Bot } from "grammy";
import { BotContext } from "../../../types/botContext";
import { registerAuthLoginCommand } from "../auth/authLoginCommands";
import { registerAuthMeCommand } from "./authMeCommnd";
import { registerAuthRegisterCommand } from "./authRegisterCommand";

export function registerAuthCommands(bot: Bot<BotContext>) {
  registerAuthLoginCommand(bot);
  registerAuthMeCommand(bot);
  registerAuthRegisterCommand(bot);
}
