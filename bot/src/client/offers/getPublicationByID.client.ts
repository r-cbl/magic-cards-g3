import { BaseApiClient } from "../base/BaseApiClient";
import { OfferResponse } from "./response/offer.response";

export class GetByIdOfferClient extends BaseApiClient {
  async execute(offerId: string, token: string): Promise<OfferResponse> {
    return this.requestWithOutBody<OfferResponse>(
      "GET",
      `http://localhost:3001/api/offers/${offerId}`,
      "Error fetching publication by ID.",
      token,
    );
  }
}
