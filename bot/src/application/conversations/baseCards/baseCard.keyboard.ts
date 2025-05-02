import { InlineKeyboard } from "grammy";
import { GetRequest } from "../../../client/baseCards/request/get.request";
import { BaseCardsClient } from "../../../client/baseCards/baseCard.client";
import { BaseCardResponse } from "../../../client/baseCards/response/baseCard.response";

export class BaseCardKeyboard {
  private baseCardClient: BaseCardsClient;

  constructor(private token: string, private limit: number = 10, private enableOther: boolean) {
    this.baseCardClient = new BaseCardsClient();
  }

  public async fetchPage(offset: number, gameId?: string): Promise<PaginatedResponse<BaseCardResponse>> {
    const request: GetRequest = {
      limit: this.limit,
      offset: offset,
      gameId: gameId
    };

    const response = await this.baseCardClient.getAll(request, this.token);
    return response;
  }

  public buildKeyboard(resp: PaginatedResponse<BaseCardResponse>): InlineKeyboard {
    const kb = new InlineKeyboard();
    const items = resp.data || [];
  
    items.forEach((item, index) => {
      const name = item.nameCard; // ✅ usamos directamente el nombre del juego
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
