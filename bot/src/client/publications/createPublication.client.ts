import { BaseApiClient } from "../base/BaseApiClient";
import { PublicationResponse } from "./response/publication.response";
import { CreateRequest } from "./request/create.request";
import { API_BASE_URL } from "../base/config";

export class CreatePublicationClient extends BaseApiClient {
  async execute(request: CreateRequest, token: string): Promise<PublicationResponse> {
    return this.requestWithBody<PublicationResponse>(
      "POST",
      "/publications",
      "",
      request,
      token,
    );
  }
}
