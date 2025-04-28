import { BaseApiClient } from "../base/BaseApiClient";
import { BaseCardResponse } from "./response/baseCard.response";
import { GetRequest } from "./request/get.request";

export class GetAllBaseCardsClient extends BaseApiClient {
  async execute(request: GetRequest, token: string): Promise<BaseCardResponse> {
    return this.get<BaseCardResponse>(
      "http://localhost:3001/api/card-bases/",
      "",
      token,
      request
    );
  }
}
