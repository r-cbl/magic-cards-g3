import { Card } from "./Card";
import { User } from "./User";
import { Offer } from "./Offer";
import { CardBase } from "./CardBase";
import { Ownable } from "./Ownable";
import { StatusPublication } from "./StatusPublication";
import { StatusOffer } from "./StatusOffer";
import { generateUUID } from "./utils";

export interface PublicationProps {
    id?: string;
    owner: User;
    cardExchange?: CardBase[];
    offersExisting?: Offer[];
    valueMoney?: number;
    card: Card;
    createdAt?: Date;
    updatedAt?: Date;
    statusPublication?: StatusPublication;
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
      this.id = props.id || generateUUID();
      this.statusPublication = props.statusPublication || StatusPublication.OPEN;
      this.cardExchange = props.cardExchange;
      this.offersExisting = props.offersExisting || [];
      this.valueMoney = props.valueMoney;
      this.card = props.card;
      this.createdAt = props.createdAt || new Date();
      this.updatedAt = props.updatedAt || new Date();
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

    public closePublication(acceptedOffer?: Offer): Offer[] {
      this.statusPublication = StatusPublication.CLOSED;
      this.updatedAt = new Date();
      if(!acceptedOffer){
        const rejectedOffers: Offer[] = [];
        this.offersExisting
            .filter(offer => offer.getStatusOffer() === StatusOffer.PENDING)
            .forEach(offer => {
                offer.rejectOffer();
                rejectedOffers.push(offer);
            });

        return rejectedOffers;
      }
      const rejectedOffers: Offer[] = [];
      this.offersExisting
            .filter(offer => offer.getId() !== acceptedOffer.getId())
            .forEach(offer => {
                offer.rejectOffer();
                rejectedOffers.push(offer);
            });

      return rejectedOffers;
    }

    public acceptOffer(offer: Offer): [Offer[], Card[]] {
      if (this.statusPublication === StatusPublication.CLOSED) {
        throw new Error("Publication already closed");
      }      
      this.updatedAt = new Date();
      const cards = offer.acceptOffer(this.getOwner());
      const offers = this.closePublication(offer);
      offers.push(offer);
      this.card.setOwner(offer.getOfferOwner());
      cards.push(this.card);
      return [offers, cards];
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