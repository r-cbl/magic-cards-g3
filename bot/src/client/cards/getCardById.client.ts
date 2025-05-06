import { BaseApiClient } from "../base/BaseApiClient";
import { CardResponse } from "./response/card.response";

export class GetByIdCardClient extends BaseApiClient {
  async execute(cardId: string, token: string): Promise<CardResponse> {
    return this.requestWithOutBody<CardResponse>(
      "GET",
      `/cards/${cardId}`,
      "Error fetching publication by ID.",
      token,
    );
  }
}
