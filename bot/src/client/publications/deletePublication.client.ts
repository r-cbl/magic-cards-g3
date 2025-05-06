import { BaseApiClient } from "../base/BaseApiClient";
import { PublicationResponse } from "./response/publication.response";

export class DeletePublicationClient extends BaseApiClient {
  async execute(publicationId: string, token: string): Promise<void> {
    this.requestWithOutBody<PublicationResponse>(
        "DELETE",
        `http://localhost:3001/api/publications/${publicationId}`,
        "Error fetching publication by ID.",
        token,
    );
  }
}
