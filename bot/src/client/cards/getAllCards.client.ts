import { BaseApiClient } from "../base/BaseApiClient";
import { CardResponse } from "./response/card.response";
import { GetRequest } from "./request/get.request";

export class GetAllCardsClient extends BaseApiClient {
  async execute(request: GetRequest, token: string): Promise<PaginatedResponse<CardResponse>> {
    return this.get<PaginatedResponse<CardResponse>>(
      "http://localhost:3001/api/cards/",
      "",
      token,
      request,
    );
  }
}
