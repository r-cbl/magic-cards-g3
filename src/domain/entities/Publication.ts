import { Card } from "./Card";
import { User } from "./User";
import { Offer } from "./Offer";
import { CardBase } from "./CardBase";
import { Ownable } from "./Ownable";
import { StatusPublication } from "./StatusPublication";

export interface PublicationProps {
    id?: string;
    owner: User;
    cardExchange?: CardBase[];
    offersExisting?: Offer[];
    valueMoney?: number;
    card: Card;
    createdAt?: Date;
    updatedAt?: Date;
}

export class Publication extends Ownable {
    private readonly id: string;
    private cardExchange?: CardBase[];
    private offersExisting: Offer[];
    private valueMoney?: number;
    private card: Card;
    private readonly createdAt: Date;
    private updatedAt: Date;
    private statusPublication: StatusPublication;

    constructor(props: PublicationProps) {
        super(props.owner);
        this.validateOwnership(props.owner,"publication");
        this.id = props.id || this.generateId();
        this.statusPublication = StatusPublication.OPEN;
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
        this.mustBeDifferentOwners(offer,"offer","publication");
        this.offersExisting.push(offer);
    }
    public getId(): string {
        return this.id;
      }

    public closePublication(): void {
        this.statusPublication = StatusPublication.CLOSED;
    }

    public acceptOffer(offer: Offer): void {
      offer.acceptOffer();
      this.closePublication();
    }

    public rejectOffer(offer: Offer): void {
      offer.rejectOffer();
    }

    public getStatusPublication(): StatusPublication {
        return this.statusPublication;
    }
      
    public getCardExchange(): CardBase[] | undefined {
      return this.cardExchange;
    }
      
    public getOffersExisting(): Offer[] | undefined {
      return this.offersExisting;
    }
      
    public getValueMoney(): number | undefined {
      return this.valueMoney;
    }
    
    public getCard(): Card {
      return this.card;
    }
    
    public getCreatedAt(): Date {
      return this.createdAt;
    }
    
    public getUpdatedAt(): Date {
      return this.updatedAt;
    }

    public setCardExchange(cards: CardBase[]){
      this.cardExchange = cards;
    }

    public setValueMoney(money: number) {
      this.valueMoney = money;
    }

    public setUpdatedAt(date : Date) {
      this.updatedAt = date;
    }
      
} 