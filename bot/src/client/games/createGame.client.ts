import { BaseApiClient } from "../base/BaseApiClient";
import { GameResponse } from "./response/game.response";
import { CreateRequest } from "./request/create.request";

export class CreateGameClient extends BaseApiClient {
  async execute(request: CreateRequest, token: string): Promise<GameResponse> {
    return this.requestWithBody<GameResponse>(
      "POST",
      "/games",
      "",
      request,
      token,
    );
  }
}
