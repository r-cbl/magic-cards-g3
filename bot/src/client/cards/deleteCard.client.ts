import { BaseApiClient } from "../base/BaseApiClient";
import { CardResponse } from "./response/card.response";

export class DeleteCardClient extends BaseApiClient {
  async execute(cardId: string, token: string): Promise<void> {
    this.requestWithOutBody<CardResponse>(
        "DELETE",
        `http://localhost:3001/api/cards/${cardId}`,
        "Error fetching card by ID.",
        token,
    );
  }
}
