import { BaseApiClient } from "../base/BaseApiClient";
import { PublicationResponse } from "./response/publication.response";
import { UpdateRequest } from "./request/update.request";
import { API_BASE_URL } from "../base/config";

export class UpdatePublicationClient extends BaseApiClient {
  async execute(request: UpdateRequest, token: string): Promise<PublicationResponse> {
    return this.requestWithBody<PublicationResponse>(
      "PUT",
      `/publications/${request.publicationId}`,
      "",
      request,
      token,
    );
  }
}
