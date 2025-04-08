import { Card } from "./Card";
import { User } from "./User";
import { Offer } from "./Offer";

export interface CardPublishProps {
    id?: string;
    owner: User;
    cardExchange: Card[];
    offersExisting: Offer[];
    card: Card;
    createdAt?: Date;
    updatedAt?: Date;
}

export class CardPublish {
    private readonly id: string;
    private owner: User;
    private cardExchange: Card[];
    private offersExisting: Offer[];
    private card: Card;
    private readonly createdAt: Date;
    private updatedAt: Date;

    constructor(props: CardPublishProps) {
        this.id = props.id || this.generateId();
        this.owner = props.owner;
        this.cardExchange = props.cardExchange;
        this.offersExisting = props.offersExisting;
        this.card = props.card;
        this.createdAt = props.createdAt || new Date();
        this.updatedAt = props.updatedAt || new Date();
    }
    
    private generateId(): string {
        return Math.random().toString(36).substring(2, 9);
    }
}           
