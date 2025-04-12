import { Card } from "./Card";
import { User } from "./User";
import { Offer } from "./Offer";
import { CardBase } from "./CardBase";
import { mustBeDifferentOwners } from "../shared/Ownable";

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

export class Publication {
    private readonly id: string;
    private owner: User;
    private cardExchange?: CardBase[];
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
        mustBeDifferentOwners(offer,this,"offer","publication");
        this.offersExisting.push(offer);
    }
    public getId(): string {
        return this.id;
      }

    public getOwner(): User {
        return this.owner;
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