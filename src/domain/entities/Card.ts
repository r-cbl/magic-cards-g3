import { CardBase } from "./CardBase";
import { Ownable } from "./Ownable";
import { User } from "./User";



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
        this.id = props.id || this.generateId();
        this.cardBase = props.cardBase;
        this.statusCard = props.statusCard;
        this.urlImage = props.urlImage;
        this.createdAt = props.createdAt || new Date();
        this.updatedAt = props.updatedAt || new Date();
    }

    private generateId(): string {
        return Math.random().toString(36).substring(2, 9);
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

}           
