import { BaseApiClient } from "../base/BaseApiClient";
import { OfferResponse } from "./response/offer.response";

export class DeleteOfferClient extends BaseApiClient {
  async execute(offerId: string, token: string): Promise<void> {
    this.requestWithOutBody<OfferResponse>(
        "DELETE",
        `/offers/${offerId}`,
        "Error fetching publication by ID.",
        token,
    );
  }
}
