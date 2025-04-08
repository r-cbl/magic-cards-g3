import { Card } from "./Card";
import { StatusOffer } from "./StatusOffer";

export interface OfferProps {
    id?: string;
    cardOffers: Card[];
    statusOffer: StatusOffer;
    moneyOffer: number;
    closedAt?: Date;
    createdAt?: Date;
    updatedAt?: Date;
}

export class Offer {
    private readonly id: string;
    private cardOffers: Card[];
    private statusOffer: StatusOffer;
    private moneyOffer: number;
    private closedAt?: Date;
    private readonly createdAt: Date;
    private updatedAt: Date;

    constructor(props: OfferProps) {
        this.id = props.id || this.generateId();
        this.cardOffers = props.cardOffers;
        this.statusOffer = props.statusOffer;
        this.moneyOffer = props.moneyOffer;
        this.closedAt = props.closedAt;
        this.createdAt = props.createdAt || new Date();
        this.updatedAt = props.updatedAt || new Date();
    }

    private generateId(): string {
        return Math.random().toString(36).substring(2, 9);
    }

}
