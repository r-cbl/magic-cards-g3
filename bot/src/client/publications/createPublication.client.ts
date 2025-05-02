import { BaseApiClient } from "../base/BaseApiClient";
import { PublicationResponse } from "./response/publication.response";
import { CreateRequest } from "./request/create.request";

export class CreatePublicationClient extends BaseApiClient {
  async execute(request: CreateRequest, token: string): Promise<PublicationResponse> {
    return this.requestWithBody<PublicationResponse>(
      "POST",
      "http://localhost:3001/api/publications",
      "",
      request,
      token,
    );
  }
}
