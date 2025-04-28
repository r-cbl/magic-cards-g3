import { BaseApiClient } from "../base/BaseApiClient";
import { BaseCardResponse } from "./response/baseCard.response";
import { CreateRequest } from "./request/create.request";

export class CreateBaseCardClient extends BaseApiClient {
  async execute(request: CreateRequest, token: string): Promise<BaseCardResponse> {
    return this.requestWithBody<BaseCardResponse>(
      "POST",
      "http://localhost:3001/api/games",
      "",
      request,
      token,
    );
  }
}
