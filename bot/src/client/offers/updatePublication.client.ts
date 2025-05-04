import { BaseApiClient } from "../base/BaseApiClient";
import { OfferResponse } from "./response/offer.response";
import { UpdateRequest } from "./request/update.request";

export class UpdateOfferClient extends BaseApiClient {
  async execute(request: UpdateRequest, token: string): Promise<OfferResponse> {
    return this.requestWithBody<OfferResponse>(
      "PUT",
      `http://localhost:3001/api/offers/${request.offerId}`,
      "",
      request,
      token,
    );
  }
}
