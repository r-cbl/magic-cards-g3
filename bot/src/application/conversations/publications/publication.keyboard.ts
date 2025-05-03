import { InlineKeyboard } from "grammy";
import { GetRequest } from "../../../client/publications/request/get.request";
import { PublicationsClient } from "../../../client/publications/publications.client";
import { PublicationResponse } from "../../../client/publications/response/publication.response";

export class PublicationKeyboard {
  private publicationsClient: PublicationsClient;

  constructor(private token: string, private limit: number = 10, private enableOther: boolean) {
    this.publicationsClient = new PublicationsClient();
  }

  public async fetchPage(offset: number,ownerId: string): Promise<PaginatedResponse<PublicationResponse>> {
    const request: GetRequest = {
      limit: this.limit,
      offset: offset,
      ownerId: ownerId
    };

    const response = await this.publicationsClient.getAll(request, this.token);
    return response;
  }

  public buildKeyboard(resp: PaginatedResponse<PublicationResponse>): InlineKeyboard {
    const kb = new InlineKeyboard();
    const items = resp.data || [];
  
    items.forEach((item, index) => {
      const name = item.name;
      kb.text(name, `select|${index}`).row();
    });
  
    if (resp.offset > 0 || resp.hasMore) {
      kb.row();
      if (resp.offset > 0) {
        kb.text("« Previous", `nav|${Math.max(resp.offset - this.limit, 0)}`);
      }
      if (resp.hasMore) {
        kb.text("Next »", `nav|${resp.offset + this.limit}`);
      }
    }
  
    if (this.enableOther) {
      kb.row().text("➕ Other", "other");
    }
  
    return kb;
  }
  
}
