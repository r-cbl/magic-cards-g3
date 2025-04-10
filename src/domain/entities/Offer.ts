import { Card } from "./Card";
import { StatusOffer } from "./StatusOffer";
import { User } from "./User";

export interface OfferProps {
    id?: string;
    offerOwner: User;
    cardOffers?: Card[];
    statusOffer?: StatusOffer;
    moneyOffer?: number;
    closedAt?: Date;
    createdAt?: Date;
    updatedAt?: Date;
}

export class Offer {
    private readonly id: string;
    private offerOwner: User;
    private cardOffers?: Card[];
    private statusOffer: StatusOffer;
    private moneyOffer?: number;
    private closedAt?: Date;
    private readonly createdAt: Date;
    private updatedAt: Date;

    constructor(props: OfferProps) {

        if(!props.cardOffers && !props.moneyOffer) {
            throw new Error("Card or money offer is required");
        }

        if (props.moneyOffer && props.moneyOffer <= 0) {
            throw new Error("Money offer must be greater than 0");
        }

        if(props.cardOffers) {
            this.areMyCards(props.cardOffers, props.offerOwner);
        }

        this.id = props.id || this.generateId();
        this.offerOwner = props.offerOwner;
        this.cardOffers = props.cardOffers;
        this.statusOffer = props.statusOffer || StatusOffer.DRAFT;
        this.moneyOffer = props.moneyOffer;
        this.closedAt = props.closedAt;
        this.createdAt = props.createdAt || new Date();
        this.updatedAt = props.updatedAt || new Date();
    }

    private generateId(): string {
        return Math.random().toString(36).substring(2, 9);
    }

    private areMyCards(cards: Card[], offerOwner: User): void {
        if (cards.some(card => offerOwner.doIHaveThisCard(card))) {
            throw new Error("Card owner is not the same as the offer owner");
        }
    }
    
    public isMyOffer(offerOwner: User): boolean {
        return this.offerOwner.getId() === offerOwner.getId(); //TODO: despues hay que cambiarlo para que use el repositorio. 
    }           

}
