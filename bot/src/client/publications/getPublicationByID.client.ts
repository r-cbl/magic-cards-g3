import { BaseApiClient } from "../base/BaseApiClient";
import { API_BASE_URL } from "../base/config";
import { PublicationResponse } from "./response/publication.response";

export class GetByIdPublicationClient extends BaseApiClient {
  async execute(publicationId: string, token: string): Promise<PublicationResponse> {
    return this.requestWithOutBody<PublicationResponse>(
      "GET",
      `/publications/${publicationId}`,
      "Error fetching publication by ID.",
      token,
    );
  }
}
