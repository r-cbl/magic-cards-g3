import { BaseApiClient } from "../base/BaseApiClient";
import { CardResponse } from "./response/card.response";
import { UpdateRequest } from "./request/update.request";

export class UpdateCardClient extends BaseApiClient {
  async execute(request: UpdateRequest, token: string): Promise<CardResponse> {
    return this.requestWithBody<CardResponse>(
      "PUT",
      `http://localhost:3001/api/publications/${request.cardId}`,
      "",
      request,
      token,
    );
  }
}
