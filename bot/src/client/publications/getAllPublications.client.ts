import { BaseApiClient } from "../base/BaseApiClient";
import { PublicationResponse } from "./response/publication.response";
import { GetRequest } from "./request/get.request";

export class GetAllPublicationsClient extends BaseApiClient {
  async execute(request: GetRequest, token: string): Promise<PaginatedResponse<PublicationResponse>> {
    return this.requestWithOutBody<PaginatedResponse<PublicationResponse>>(
      "GET",
      "http://localhost:3001/api/publications",
      "",
      token,
      request,
    );
  }
}
