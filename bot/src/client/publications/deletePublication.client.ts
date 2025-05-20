import { BaseApiClient } from "../base/BaseApiClient";
import { API_BASE_URL } from "../base/config";
import { PublicationResponse } from "./response/publication.response";

export class DeletePublicationClient extends BaseApiClient {
  async execute(publicationId: string, token: string): Promise<void> {
    this.requestWithOutBody<PublicationResponse>(
        "DELETE",
        `/publications/${publicationId}`,
        "Error fetching publication by ID.",
        token,
    );
  }
}
