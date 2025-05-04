import { InlineKeyboard } from "grammy";

export class Keyboard< R extends { limit?: number; offset?: number },T extends { id: string }> {
  constructor(
    private client: { getAll: (request: R, token: string) => Promise<PaginatedResponse<T>> },
    private token: string,
    private baseRequest: Omit<R, "limit" | "offset">,
    private limit: number = 10,
    private enableOther: boolean = true,
    private getLabel: (item: T) => string
  ) {}

  public async fetchPage(offset: number): Promise<PaginatedResponse<T>> {
    const fullRequest = {
      ...this.baseRequest,
      limit: this.limit,
      offset,
    } as R;

    return this.client.getAll(fullRequest, this.token);
  }

  public buildKeyboard(resp: PaginatedResponse<T>): InlineKeyboard {
    console.log(resp.data)
    const kb = new InlineKeyboard();
    const items = resp.data ?? [];
  
    if (items.length === 0 && !this.enableOther) {
      return kb;
    }
  
    // ✅ Mostrar solo si hay elementos
    if (items.length > 0) {
      items.forEach((item, index) => {
        const label = this.getLabel(item) || "Unnamed";
        kb.text(label, `select|${index}`).row();
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
    }
  
    if (this.enableOther) {
      kb.row().text("➕ Other", "other");
    }
  
    return kb;
  }
}
