import { Card } from "./Card";
import { User } from "./User";
import { Offer } from "./Offer";

export interface PublicationProps {
    id?: string;
    owner: User;
    cardExchange?: Card[];
    offersExisting?: Offer[];
    valueMoney?: number;
    card: Card;
    createdAt?: Date;
    updatedAt?: Date;
}

export class Publication {
    private readonly id: string;
    private owner: User;
    private cardExchange?: Card[];
    private offersExisting: Offer[];
    private valueMoney?: number;
    private card: Card;
    private readonly createdAt: Date;
    private updatedAt: Date;

    constructor(props: PublicationProps) {
        this.id = props.id || this.generateId();
        this.owner = props.owner;
        this.cardExchange = props.cardExchange;
        this.offersExisting = props.offersExisting || [];
        this.valueMoney = props.valueMoney;
        this.card = props.card;
        this.createdAt = props.createdAt || new Date();
        this.updatedAt = props.updatedAt || new Date();
    }
    
    private generateId(): string {
        return Math.random().toString(36).substring(2, 9);
    }

    public addOffer(offer: Offer): void {
        if(offer.isMyOffer(this.owner)) {
            throw new Error("Offer owner is not the same as the publication owner");
        }
        this.offersExisting.push(offer);
    }
} 