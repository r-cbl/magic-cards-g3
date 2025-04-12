import { CardBase } from "./CardBase";
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

export class Card {
    private readonly id: string;
    private cardBase: CardBase;
    private statusCard: number;
    private urlImage?: string;
    private readonly createdAt: Date;
    private updatedAt: Date;
    private owner: User;

    constructor(props: CardProps) {
        this.id = props.id || this.generateId();
        this.cardBase = props.cardBase;
        this.statusCard = props.statusCard;
        this.urlImage = props.urlImage;
        this.createdAt = props.createdAt || new Date();
        this.updatedAt = props.updatedAt || new Date();
        this.owner = props.owner;
    }

    private generateId(): string {
        return Math.random().toString(36).substring(2, 9);
    }

    public getOwner(): User{
      return this.owner;
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
