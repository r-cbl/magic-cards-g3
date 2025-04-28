import { Context, InlineKeyboard } from "grammy";
import { Conversation } from "@grammyjs/conversations";

// Respuesta genérica con paginación
type PaginatedResponse<T> = {
  data: T[];
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
};

// Firma mínima del cliente con getAll
export interface PaginatedClient<Req, T> {
  getAll(request: Req, token: string): Promise<PaginatedResponse<T>>;
}

/**
 * Clase genérica para paginar y permitir la selección de un ítem o entrada libre.
 * @template Req Tipo de la request (incluye limit y offset)
 * @template T   Tipo de cada elemento
 */
export class PaginationUtils<Req extends { limit?: number; offset?: number }, T> {
  constructor(
    private apiClient: PaginatedClient<Req, T>,
    /** Texto que se muestra al usuario arriba de los botones */
    private promptText: string,
    /** Genera la etiqueta de cada botón a partir de un ítem */
    private labelFn: (item: T) => string,
    /** Genera el callbackData (sin prefijo) a partir de un ítem */
    private callbackDataFn: (item: T) => string,
    private token: string,
    private initialParams: Omit<Req, "limit" | "offset"> = {} as Omit<Req, "limit" | "offset">,
    private userErrorMessage: string = "Error al obtener datos",
    private limit: number = 10
  ) {}

  /**
   * Recupera una página de datos paginados
   */
  private async fetchPage(offset: number): Promise<PaginatedResponse<T>> {
    const request = {
      ...(this.initialParams as object),
      limit: this.limit,
      offset,
    } as Req;
    return this.apiClient.getAll(request, this.token);
  }

 /**
 * Muestra el menú paginado y devuelve el ID del ítem seleccionado o el texto ingresado.
 * @param conversation Instancia de Conversation para esperar interacciones
 * @param ctx          Contexto inicial para enviar el primer mensaje
 */
 public async handle(
    conversation: Conversation<any, any>,
    ctx: Context
  ): Promise<T | { id: "0", name: string }> {
    let offset = 0;
  
    // Bucle de interacción: navegación y selección
    while (true) {
        // 1) Obtener página
        const resp = await this.fetchPage(offset);
  
        // Construir teclado
        const kb = new InlineKeyboard();

        // Botones de cada item
        for (let index = 0; index < resp.data.length; index++) {
            const item = resp.data[index];
            const name = this.labelFn(item);
            kb.text(name, `select|${index}`).row();
          }
          

        // Botones de navegación
        if (resp.offset > 0 || resp.hasMore) {
        kb.row();
        if (resp.offset > 0) {
            kb.text("« Anterior", `nav|${Math.max(resp.offset - this.limit, 0)}`);
        }
        if (resp.hasMore) {
            kb.text("Siguiente »", `nav|${resp.offset + this.limit}`);
        }
        }

        // Botón \"Otro\"
        kb.row().text("➕ Otro", "other");

  
        // 3) Enviar o editar el mensaje
        if (ctx.callbackQuery) {
            await ctx.editMessageText(this.promptText, { reply_markup: kb });
            await ctx.answerCallbackQuery();
        } else {
            await ctx.reply(this.promptText, { reply_markup: kb });
        }
    
        // 4) Esperar callback
        const nextCtx = await conversation.waitFor("callback_query");
        const data = nextCtx.callbackQuery.data!;
        await nextCtx.answerCallbackQuery();
    
        // 5) Procesar elección
        if (data.startsWith("select|")) {
            const [_, indexStr] = data.split('|');
            const index = Number(indexStr);
            const selectedItem = resp.data[index];
            return selectedItem;
          }          
        if (data.startsWith("nav|")) {
            offset = Number(data.split('|')[1]);
            continue; // seguir bucle para refrescar página
        }
        if (data === "other") {
            await nextCtx.reply("Por favor, escribe el nombre:");
            const msgCtx = await conversation.waitFor("message:text");
            return { id: "0", name: msgCtx.message.text! };
          }
    }
  }
  
}
