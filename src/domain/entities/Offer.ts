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
            this.areValidCards(props.cardOffers, props.offerOwner);
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

    private areValidCards(cards: Card[], offerOwner: User): boolean {
        if(!this.areMyCards(cards, offerOwner)) {
            throw new Error("Card owner is not the same as the offer owner");
        }
        return true;
    }

    private areMyCards(cards: Card[], offerOwner: User): boolean {
        return cards.every(card => offerOwner.doIHaveThisCard(card));
    }
    
    public isMyOffer(offerOwner: User): boolean {
        return this.offerOwner.getId() === offerOwner.getId();
    }

    public getId(): string {
        return this.id;
    }

    public getOfferOwner(): User {
        return this.offerOwner;
    }

    public getCardOffers(): Card[] | undefined {
        return this.cardOffers;
    }

    public getStatusOffer(): StatusOffer {
        return this.statusOffer;
    }

    public getMoneyOffer(): number | undefined {
        return this.moneyOffer;
    }

    public getClosedAt(): Date | undefined {
        return this.closedAt;
    }

    public getCreatedAt(): Date {
        return this.createdAt;
    }

    public getUpdatedAt(): Date {
        return this.updatedAt;
    }
}
