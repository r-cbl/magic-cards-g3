import { Context, InlineKeyboard } from "grammy";
import { Conversation } from "@grammyjs/conversations";

// Firma mínima del cliente con getAll
export interface PaginatedClient<Req, T> {
  getAll(request: Req, token: string): Promise<PaginatedResponse<T>>;
}

export class PaginationUtils<Req extends { limit?: number; offset?: number }, T> {
  constructor(
    private apiClient: PaginatedClient<Req, T>,
    private promptText: string,
    private labelFn: (item: T) => string,
    private callbackDataFn: (item: T) => string,
    private token: string,
    private initialParams: Omit<Req, "limit" | "offset"> = {} as Omit<Req, "limit" | "offset">,
    private userErrorMessage: string = "Error al obtener datos",
    private limit: number = 10,
    private enableOther: boolean = true // Nuevo: permitir crear "Otro"
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
    return this.apiClient.getAll(request, this.token);
  }

  private buildKeyboard(resp: PaginatedResponse<T>): InlineKeyboard {
    const kb = new InlineKeyboard();

    for (let index = 0; index < resp.data.length; index++) {
      const item = resp.data[index];
      const name = this.labelFn(item);
      kb.text(name, `select|${index}`).row();
    }

    if (resp.offset > 0 || resp.hasMore) {
      kb.row();
      if (resp.offset > 0) {
        kb.text("« Anterior", `nav|${Math.max(resp.offset - this.limit, 0)}`);
      }
      if (resp.hasMore) {
        kb.text("Siguiente »", `nav|${resp.offset + this.limit}`);
      }
    }

    if (this.enableOther) {
      kb.row().text("➕ Otro", "other");
    }

    return kb;
  }

  public async handle(
    conversation: Conversation<any, any>,
    ctx: Context
  ): Promise<T | { id: "0", name: string }> {
    let offset = 0;
    let firstRender = true; // Nuevo: para controlar el primer render sin callback
  
    while (true) {
      const resp = await this.fetchPage(offset);
  
      if (resp.data.length === 0) {
        if (this.enableOther) {
          await ctx.reply("No hay ningún elemento creado. ¡Crea el primero!");
          await ctx.reply("Por favor, escribe el nombre:");
          const msgCtx = await conversation.waitFor("message:text");
          return { id: "0", name: msgCtx.message.text! };
        } else {
          await ctx.reply("No hay datos disponibles. Es necesaria la creación previa para continuar.");
          throw new Error("No hay datos para seleccionar y no está habilitado crear 'Otro'");
        }
      }
  
      const kb = this.buildKeyboard(resp);
  
      if (!ctx.callbackQuery && firstRender) {
        // Primer render: mandamos reply normal
        await ctx.reply(this.promptText, { reply_markup: kb });
        firstRender = false;
      } else {
        // Respuesta a navegación o selección
        await ctx.editMessageText(this.promptText, { reply_markup: kb }).catch(async () => {
          // Si falla (por ejemplo, mensaje muy viejo o borrado), mandamos un nuevo reply
          await ctx.reply(this.promptText, { reply_markup: kb });
        });
        if (ctx.callbackQuery) {
          await ctx.answerCallbackQuery();
        }
      }
  
      // 1. Esperar que el usuario toque algo en el teclado (callback_query)
      const nextCtx = await conversation.waitFor("callback_query");
      await nextCtx.answerCallbackQuery();
      const data = nextCtx.callbackQuery.data!;
  
      // 2. Procesar acción
      if (data.startsWith("select|")) {
        const [_, indexStr] = data.split('|');
        const index = Number(indexStr);
        const selectedItem = resp.data[index];
        return selectedItem;
      }
      if (data.startsWith("nav|")) {
        offset = Number(data.split('|')[1]);
        ctx = nextCtx; // Actualizamos ctx para la próxima vuelta
        continue;
      }
      if (data === "other" && this.enableOther) {
        // Eliminar el teclado anterior (limpiar markup)
        if (nextCtx.callbackQuery?.message?.message_id) {
          await ctx.api.editMessageReplyMarkup(
            ctx.chat!.id,
            nextCtx.callbackQuery.message.message_id,
            { reply_markup: undefined }
          );
        }
      
        // Preguntar nombre
        await nextCtx.reply("Por favor, escribe el nombre:");
        const msgCtx = await conversation.waitFor("message:text");
      
        return { id: "0", name: msgCtx.message.text! };
      }      
    }
  }
  
}