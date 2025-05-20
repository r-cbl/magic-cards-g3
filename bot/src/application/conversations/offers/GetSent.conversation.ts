import { GetRequest } from "../../../client/offers/request/get.request";
import { session } from "../../../bot/middleware";
import { offersClient, publicationsClient } from "../../../client/client";
import { BotContext } from "../../../types/botContext";
import { handleError } from "../../../types/errors";
import { OfferResponse } from "../../../client/offers/response/offer.response";
import { PaginationUtils } from "../utils/pagination.utils";

export async function getSentOffersConversation(
    ctx: BotContext
  ) {
    const userId = ctx.from!.id.toString();
    const user = session.get(userId)!;
    const ownerId = user.user.id;
    const token = user.tokens.accessToken;
  
    try {
        const offers = await offersClient.getAll({ ownerId, status: "pending" }, token);

        const enrichedOffers = await Promise.all(
          offers.data.map(async (offer) => {
            const publication = await publicationsClient.getById(offer.publicationId, token);
            return {
              ...offer,
              publicationName: publication.cardBase?.Name ?? "Unknown",
            };
          })
        );
        
        const limit = 10;
        const offset = 0;
        
        const offerPaginator = new PaginationUtils<
          GetRequest,
          OfferResponse & { publicationName: string }
        >(
          {
            getAll: async () => ({
              data: enrichedOffers,
              total: enrichedOffers.length,
              hasMore: false,
              limit,
              offset,
            }),
          },
          "📨 Offers you sent:",
          (offer) =>
            `📦 Publication: ${offer.publicationName}` +
            (offer.moneyOffer != null ? ` 💰 Money Offered: $${offer.moneyOffer}` : "") +
            (offer.cardExchangeIds?.length
              ? ` 🃏 Cards Offered: ${offer.cardExchangeIds.length}`
              : " 🃏 Cards Offered: None") +
            ` 📅 Sent: ${new Date(offer.createdAt).toLocaleDateString()}` +
            ` 📌 Status: ${offer.status}`,
          token,
          {},
          limit,
          false
        );
      
        await offerPaginator.handleReadOnly(ctx);

    } catch (error) {
      await handleError(ctx, error);
    }
  }
  
  