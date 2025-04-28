import { BaseApiClient } from "../base/BaseApiClient";
import { GameResponse } from "./response/game.response";
import { GetRequest } from "./request/get.request";

export class GetAllGamesClient extends BaseApiClient {
  async execute(token: string): Promise<GameResponse> {
    return this.get<GameResponse>(
      "http://localhost:3001/api/games/",
      "",
      token,
    );
  }
}
