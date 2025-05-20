import { CardBase } from "./CardBase";
import { Ownable } from "./Ownable";
import { User } from "./User";
import { generateUUID } from "./utils";



export interface CardProps {
    id?: string;
    cardBase: CardBase;
    owner: User;
    statusCard: number;
    urlImage?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export class Card extends Ownable {
    private readonly id: string;
    private cardBase: CardBase;
    private statusCard: number;
    private urlImage?: string;
    private readonly createdAt: Date;
    private updatedAt: Date;

    constructor(props: CardProps) { 
        super(props.owner);
        this.id = props.id || generateUUID();
        this.cardBase = props.cardBase;
        this.statusCard = props.statusCard;
        this.urlImage = props.urlImage;
        this.createdAt = props.createdAt || new Date();
        this.updatedAt = props.updatedAt || new Date();
    }

      
    public getCardBase(): CardBase {
      return this.cardBase;
    }
      
    public getStatusCard(): number {
        return this.statusCard;
    }
      
    public getUrlImage(): string {
        return this.urlImage || '';
    }
      
    public getCreatedAt(): Date {
        return this.createdAt;
    }
      
    public getUpdatedAt(): Date {
        return this.updatedAt;
    }

    public getId(): string {
        return this.id;
    }

    public setUpdatedAt(date : Date) {
        this.updatedAt = date;
    }

    public setCardBase(cardBase: CardBase) {
        this.cardBase = cardBase;
    }

    public setStatusCard(statusCard: number) {
        this.statusCard = statusCard;
    }

    public setUrlImage(urlImage: string) {
        this.urlImage = urlImage;
    }

}           
