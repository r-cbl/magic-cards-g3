import { BaseApiClient } from "../base/BaseApiClient";
import { OfferResponse } from "./response/offer.response";
import { CreateRequest } from "./request/create.request";
import { API_BASE_URL } from "../base/config";

export class CreateOfferClient extends BaseApiClient {
  async execute(request: CreateRequest, token: string): Promise<OfferResponse> {
    return this.requestWithBody<OfferResponse>(
      "POST",
      "/offers",
      "",
      request,
      token,
    );
  }
}
