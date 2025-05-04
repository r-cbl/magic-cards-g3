import { handleError } from "../../../types/errors";
import { session } from "../../../bot/middleware";
import { BotContext } from "../../../types/botContext";
import { GetRequest } from "../../../client/publications/request/get.request";
import { PublicationResponse } from "../../../client/publications/response/publication.response";
import { PaginationUtils } from "../utils/pagination.utils";
import { publicationsClient } from "../../../client/client";

export async function getAllPublicationsConversation(
    ctx: BotContext
  ) {
    const userId = ctx.from!.id.toString();
    const user = session.get(userId)!;
    const ownerId = user.user.id;
    const token = user.tokens.accessToken;
    try{
        const publicationPaginator = new PaginationUtils<GetRequest, PublicationResponse>(
            publicationsClient,
            "Publications: ",
                publication => 
                    `🃏 ${publication.cardBase!.Name}` +
                    (publication.valueMoney != null ? ` - 💰 Value: $${publication.valueMoney}` : "") +
                    (publication.cardExchangeIds?.length ? ` - 🔄 Exchanges: ${publication.cardExchangeIds.length}` : ""),
            token,
            {ownerId},
            10,
            false
        );
        await publicationPaginator.handleReadOnly(ctx);
    } catch(error){
        handleError(ctx,error);
    }
  }