import { BaseApiClient } from "../base/BaseApiClient";
import { PublicationResponse } from "./response/publication.response";
import { UpdateRequest } from "./request/update.request";

export class UpdatePublicationClient extends BaseApiClient {
  async execute(request: UpdateRequest, token: string): Promise<PublicationResponse> {
    return this.requestWithBody<PublicationResponse>(
      "PUT",
      `http://localhost:3001/api/publications/${request.publicationId}`,
      "",
      request,
      token,
    );
  }
}
