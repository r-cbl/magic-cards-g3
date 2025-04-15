import { Card } from "./Card";
import { StatusOffer } from "./StatusOffer";
import { User } from "./User";
import { Ownable } from "./Ownable";
import { Publication } from "./Publication";

export interface OfferProps {
    id?: string;
    offerOwner: User;
    cardOffers?: Card[];
    statusOffer?: StatusOffer;
    moneyOffer?: number;
    closedAt?: Date;
    createdAt?: Date;
    updatedAt?: Date;
    publication?: Publication;
}

export class Offer extends Ownable {
    private readonly id: string;
    private offerOwner: User;
    private cardOffers?: Card[];
    private statusOffer: StatusOffer;
    private moneyOffer?: number;
    private closedAt?: Date;
    private readonly createdAt: Date;
    private updatedAt: Date;
    private publication: Publication;

    constructor(props: OfferProps) {
        super(props.offerOwner);
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
        this.statusOffer = props.statusOffer || StatusOffer.PENDING;
        this.moneyOffer = props.moneyOffer;
        this.closedAt = props.closedAt;
        this.createdAt = props.createdAt || new Date();
        this.updatedAt = props.updatedAt || new Date();
        this.publication = props.publication!;
    }

    private generateId(): string {
        return Math.random().toString(36).substring(2, 9);
    }

    public acceptOffer(publicationOwner: User): Card[] {
        this.statusOffer = StatusOffer.ACCEPTED;
        this.updatedAt = new Date();
        return this.changeOwnersOfferCards(publicationOwner);
    }

    public rejectOffer(): void {
        this.statusOffer = StatusOffer.REJECTED;
        this.updatedAt = new Date();
    }

    private changeOwnersOfferCards(publicationOwner: User):Card[] {
        if(this.cardOffers) {
            this.cardOffers.forEach(card => card.setOwner(publicationOwner));
            return this.cardOffers;
        }
        return [];
    }
    
    private areMyCards(cards: Card[], offerOwner: User): boolean {
        return cards.every((card: Card) => card.validateOwnership(offerOwner,"Card"));
    }
    
    public getPublication() : Publication {
        return this.publication;
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
