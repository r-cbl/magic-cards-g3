import { BaseApiClient } from "../base/BaseApiClient";
import { CreateResponse } from "./response/publication.response";
import { CreateRequest } from "./request/create.request";

export class CreatePublicationClient extends BaseApiClient {
  async execute(request: CreateRequest, token: string): Promise<CreateResponse> {
    return this.post<CreateResponse>(
      "http://localhost:3001/api/publications",
      request,
      "",
      token,
    );
  }
}
