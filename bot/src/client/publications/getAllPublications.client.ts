import { BaseApiClient } from "../base/BaseApiClient";
import { PublicationResponse } from "./response/publication.response";
import { GetRequest } from "./request/get.request";

export class GetAllPublicationsClient extends BaseApiClient {
  async execute(request: GetRequest, token: string): Promise<PaginatedResponse<PublicationResponse>> {
    return this.requestWithOutBody<PaginatedResponse<PublicationResponse>>(
      "GET",
      "/publications",
      "",
      token,
      request,
    );
  }
}
