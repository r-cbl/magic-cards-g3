import { BaseApiClient } from "../base/BaseApiClient";
import { OfferResponse } from "./response/offer.response";

export class DeleteOfferClient extends BaseApiClient {
  async execute(offerId: string, token: string): Promise<void> {
    this.requestWithOutBody<OfferResponse>(
        "DELETE",
        `http://localhost:3001/api/offers/${offerId}`,
        "Error fetching publication by ID.",
        token,
    );
  }
}
