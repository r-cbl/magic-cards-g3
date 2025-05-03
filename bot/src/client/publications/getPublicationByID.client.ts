import { BaseApiClient } from "../base/BaseApiClient";
import { PublicationResponse } from "./response/publication.response";

export class GetByIdPublicationClient extends BaseApiClient {
  async execute(publicationId: string, token: string): Promise<PublicationResponse> {
    return this.requestWithOutBody<PublicationResponse>(
      "GET",
      `http://localhost:3001/api/publications/${publicationId}`,
      "Error fetching publication by ID.",
      token,
    );
  }
}
