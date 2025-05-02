import { InlineKeyboard } from "grammy";
import { GamesClient } from "../../../client/games/games.client";
import { GetRequest } from "../../../client/games/request/get.request";
import { GameResponse } from "../../../client/games/response/game.response";

export class GameKeyboard {
  private gameClient: GamesClient;

  constructor(private token: string, private limit: number = 10, private enableOther: boolean) {
    this.gameClient = new GamesClient();
  }

  public async fetchPage(offset: number): Promise<PaginatedResponse<GameResponse>> {
    const request: GetRequest = {
      limit: this.limit,
      offset: offset,
    };

    const response = await this.gameClient.getAll(request, this.token);
    return response;
  }

  public buildKeyboard(resp: PaginatedResponse<GameResponse>): InlineKeyboard {
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
