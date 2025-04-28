import { GameResponse } from "../../../client/games/response/game.response";
import { GetRequest as GetRequestGame } from "../../../client/games/request/get.request";
import { BotContext } from "../../../types/botContext";
import { Conversation } from "@grammyjs/conversations";
import { PaginationUtils } from "../utils/pagination.utils";
import { GamesClient } from "../../../client/games/games.client";

export async function selectGameConversation(
    conversation: Conversation<BotContext,BotContext>,
    ctx: BotContext,
    token: string
): Promise<GameResponse> {
    const gamesClient = new GamesClient();
    const gamesPaginator = new PaginationUtils<GetRequestGame, GameResponse>(
        gamesClient,
        "Select a game",
        game => `${game.name}`,
        game => game.id,
        token,
        {},
        "No se pudieron cargar juegos",
        10
    );

    const game = await gamesPaginator.handle(conversation, ctx);

    if ((game as any).id === "0") {
        const createdGame = await gamesClient.create({ name: (game as any).name }, token);
        await ctx.reply(`✅ Juego creado: ${createdGame.name}`);
        return createdGame;
    }

    // Si eligió uno existente
    return game as GameResponse;
}
