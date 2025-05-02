import { InlineKeyboard } from "grammy";
import { GetRequest } from "../../../client/cards/request/get.request";
import { CardResponse } from "../../../client/cards/response/card.response";
import { CardsClient } from "../../../client/cards/cards.client";

export class CardKeyboard {
  private cardsClient: CardsClient;

  constructor(private token: string, private limit: number = 10, private enableOther: boolean) {
    this.cardsClient = new CardsClient();
  }

  public async fetchPage(offset: number): Promise<PaginatedResponse<CardResponse>> {
    const request: GetRequest = {
      limit: this.limit,
      offset: offset,
    };

    const response = await this.cardsClient.getAll(request, this.token);
    return response;
  }

  public buildKeyboard(resp: PaginatedResponse<CardResponse>): InlineKeyboard {
    const kb = new InlineKeyboard();
    const items = resp.data || [];
  
    items.forEach((item, index) => {
      const name = item.cardBase.Name;
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
