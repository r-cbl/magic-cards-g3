import { BaseApiClient } from "../base/BaseApiClient";
import { CardResponse } from "./response/card.response";
import { CreateRequest } from "./request/create.request";

export class CreateCardClient extends BaseApiClient {
  async execute(request: CreateRequest, token: string): Promise<CardResponse> {
    return this.requestWithBody<CardResponse>(
      "POST",
      "http://localhost:3001/api/cards",
      "",
      request,
      token,
    );
  }
}
