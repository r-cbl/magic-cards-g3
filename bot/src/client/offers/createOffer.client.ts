import { BaseApiClient } from "../base/BaseApiClient";
import { OfferResponse } from "./response/offer.response";
import { CreateRequest } from "./request/create.request";

export class CreateOfferClient extends BaseApiClient {
  async execute(request: CreateRequest, token: string): Promise<OfferResponse> {
    return this.requestWithBody<OfferResponse>(
      "POST",
      "http://localhost:3001/api/offers",
      "",
      request,
      token,
    );
  }
}
