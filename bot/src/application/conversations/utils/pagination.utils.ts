import { Context, InlineKeyboard } from "grammy";
import { Conversation } from "@grammyjs/conversations";

// Minimal client contract with getAll
export interface PaginatedClient<Req, T> {
  getAll(request: Req, token: string): Promise<PaginatedResponse<T>>;
}

export class PaginationUtils<Req extends { limit?: number; offset?: number }, T> {
  constructor(
    private apiClient: PaginatedClient<Req, T>,
    private promptText: string,
    private labelFn: (item: T) => string,
    private token: string,
    private initialParams: Omit<Req, "limit" | "offset"> = {} as Omit<Req, "limit" | "offset">,
    private limit: number = 10,
    private enableOther: boolean = true
  ) {}

  public setInitialParams(params: Omit<Req, "limit" | "offset">) {
    this.initialParams = params;
  }

  private async fetchPage(offset: number): Promise<PaginatedResponse<T>> {
    const request = {
      ...(this.initialParams as object),
      limit: this.limit,
      offset,
    } as Req;

    const response = await this.apiClient.getAll(request, this.token);
    //console.log("fetchPage response:", response);
    return response;
  }

  private buildKeyboard(resp: PaginatedResponse<T>): InlineKeyboard {
    const kb = new InlineKeyboard();
    const items = resp.data || [];

    items.forEach((item, index) => {
      const name = this.labelFn(item);
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

  public async handle(
    conversation: Conversation<any, any>,
    ctx: Context
  ): Promise<T | { id: "0"; name: string }> {
    let offset = 0;
    let firstRender = true;
  
    while (true) {
      const resp = await this.fetchPage(offset);
  
      // 🔒 Manejo seguro cuando no hay ítems
      if (!resp.data || resp.data.length === 0) {
        if (this.enableOther) {
          // ✅ UNA sola respuesta antes del wait
          await ctx.reply("No items found. Please type the name:");
          const msgCtx = await conversation.waitFor("message:text");
          return { id: "0", name: msgCtx.message.text! };
        }
  
        await ctx.reply("No data available.");
        throw new Error("No items to select and 'Other' creation is not enabled.");
      }
  
      const kb = this.buildKeyboard(resp);
  
      // ✅ Primer render (nunca usa callback)
      if (!ctx.callbackQuery && firstRender) {
        await ctx.reply(this.promptText, { reply_markup: kb });
        firstRender = false;
      } else {
        // ✅ Edición o fallback limpio
        await ctx.editMessageText(this.promptText, { reply_markup: kb }).catch(async () => {
          await ctx.reply(this.promptText, { reply_markup: kb });
        });
      }
  
      const nextCtx = await conversation.waitFor("callback_query");
  
      try {
        await nextCtx.answerCallbackQuery();
      } catch {
        // Ignorar errores por query expirada
      }
  
      const data = nextCtx.callbackQuery?.data!;
      ctx = nextCtx; // 🔁 Actualizar el contexto para próximos pasos
  
      if (data.startsWith("select|")) {
        const index = Number(data.split("|")[1]);
        return resp.data[index];
      }
  
      if (data.startsWith("nav|")) {
        offset = Number(data.split("|")[1]);
        continue;
      }
  
      if (data === "other" && this.enableOther) {
        // ✅ limpiar markup viejo
        if (nextCtx.callbackQuery?.message?.message_id) {
          await ctx.api.editMessageReplyMarkup(
            ctx.chat!.id,
            nextCtx.callbackQuery.message.message_id,
            { reply_markup: undefined }
          );
        }
  
        await ctx.reply("Please type the name:");
        const msgCtx = await conversation.waitFor("message:text");
        await conversation.halt()
        return { id: "0", name: msgCtx.message.text! };
      }
    }
  }
  

  public async handleReadOnly(ctx: Context, page: number = 0): Promise<void> {
    const offset = page * this.limit;
    const resp = await this.fetchPage(offset);

    if (!resp.data || resp.data.length === 0) {
      await ctx.reply("No data available to display.");
      return;
    }

    const kb = this.buildKeyboard(resp);
    await ctx.reply(this.promptText, { reply_markup: kb });
  }
}
