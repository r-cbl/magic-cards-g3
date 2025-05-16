import { Card } from "./Card";
import { User } from "./User";
import { Offer } from "./Offer";
import { CardBase } from "./CardBase";
import { Ownable } from "./Ownable";
import { StatusPublication } from "./StatusPublication";
import { StatusOffer } from "./StatusOffer";

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
      this.id = props.id || this.generateId();
      this.statusPublication = StatusPublication.OPEN;
      this.cardExchange = props.cardExchange;
      this.offersExisting = props.offersExisting || [];
      this.valueMoney = props.valueMoney;
      this.card = props.card;
      this.validateOwnership(this.card.getOwner(),"card");
      this.createdAt = props.createdAt || new Date();
      this.updatedAt = props.updatedAt || new Date();
  }
    
    private generateId(): string {
        return Math.random().toString(36).substring(2, 9);
    }

    public addOffer(offer: Offer):  Offer {
      if (this.statusPublication === StatusPublication.CLOSED) {
        throw new Error("Cannot add offer to a closed publication");
      }
      this.mustBeDifferentOwners(offer,"offer","publication");
      this.offersExisting.push(offer);
      return offer;
    }

    public getId(): string {
        return this.id;
      }

    public closePublication(): Offer[] {
        this.statusPublication = StatusPublication.CLOSED;
        this.updatedAt = new Date();
        const rejectedOffers: Offer[] = [];

        this.offersExisting
            .filter(offer => offer.getStatusOffer() === StatusOffer.PENDING)
            .forEach(offer => {
                offer.rejectOffer();
                rejectedOffers.push(offer);
            });

        return rejectedOffers;
    }

    public acceptOffer(offer: Offer): [Offer, Card[]] {
      if (this.statusPublication === StatusPublication.CLOSED) {
        throw new Error("Publication already closed");
      }      
      this.updatedAt = new Date();
      const cards = offer.acceptOffer(this.getOwner());
      this.closePublication();
      this.card.setOwner(offer.getOfferOwner());
      cards.push(this.card);
      return [offer, cards];
    }

    public rejectOffer(offer: Offer): Offer { 
      this.updatedAt = new Date();
      offer.rejectOffer();
      return offer;
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
      this.updatedAt = new Date();
    }

    public setValueMoney(money: number) {
      this.valueMoney = money;
      this.updatedAt = new Date();
    }

    public setUpdatedAt(date : Date) {
      this.updatedAt = date;
    }
      
} 