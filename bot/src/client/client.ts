import { AuthClient } from "./auth/auth.client";
import { BaseCardsClient } from "./baseCards/baseCard.client";
import { CardsClient } from "./cards/cards.client";
import { GamesClient } from "./games/games.client";
import { OffersClient } from "./offers/offers.client";
import { PublicationsClient } from "./publications/publications.client";

export const gamesClient = new GamesClient();
export const baseCardsClient = new BaseCardsClient();
export const cardsClient = new CardsClient();
export const publicationsClient = new PublicationsClient();
export const offersClient = new OffersClient();
export const authClient = new AuthClient();
