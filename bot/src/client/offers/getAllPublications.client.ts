import { BaseApiClient } from "../base/BaseApiClient";
import { OfferResponse } from "./response/offer.response";
import { GetRequest } from "./request/get.request";

export class GetAllOffersClient extends BaseApiClient {
  async execute(request: GetRequest, token: string): Promise<PaginatedResponse<OfferResponse>> {
    return this.requestWithOutBody<PaginatedResponse<OfferResponse>>(
      "GET",
      "http://localhost:3001/api/offers/",
      "",
      token,
      request,
    );
  }
}
