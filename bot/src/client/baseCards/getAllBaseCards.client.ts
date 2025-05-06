import { BaseApiClient } from "../base/BaseApiClient";
import { BaseCardResponse } from "./response/baseCard.response";
import { GetRequest } from "./request/get.request";

export class GetAllBaseCardsClient extends BaseApiClient {
  async execute(request: GetRequest, token: string): Promise<PaginatedResponse<BaseCardResponse>> {
    return this.requestWithOutBody<PaginatedResponse<BaseCardResponse>>(
      "GET",
      "/card-bases",
      "",
      token,
      request
    );
  }
}
