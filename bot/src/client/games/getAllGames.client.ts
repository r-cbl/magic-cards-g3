import { BaseApiClient } from "../base/BaseApiClient";
import { GameResponse } from "./response/game.response";
import { GetRequest } from "./request/get.request";

export class GetAllGamesClient extends BaseApiClient {
  async execute(request: GetRequest, token: string): Promise<PaginatedResponse<GameResponse>> {
    return this.get<PaginatedResponse<GameResponse>>(
      "http://localhost:3001/api/games/",
      "",
      token,
    );
  }
}
