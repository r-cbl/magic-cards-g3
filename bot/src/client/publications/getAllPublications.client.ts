import { BaseApiClient } from "../base/BaseApiClient";
import { PublicationResponse } from "./response/publication.response";
import { GetRequest } from "./request/get.request";

export class GetAllPublicationClient extends BaseApiClient {
  async execute(request: GetRequest, token: string): Promise<PublicationResponse> {
    return this.get<PublicationResponse>(
      "http://localhost:3001/api/publications/",
      "",
      token,
      request,
    );
  }
}
