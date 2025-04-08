import { CardBase } from "./CardBase";


export interface CardProps {
    id?: string;
    cardBase: CardBase;
    name: string;
    statusCard: number;
    urlImage?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export class Card {
    private readonly id: string;
    private cardBase: CardBase;
    private name: string;
    private statusCard: number;
    private urlImage?: string;
    private readonly createdAt: Date;
    private updatedAt: Date;

    constructor(props: CardProps) {
        this.id = props.id || this.generateId();
        this.cardBase = props.cardBase;
        this.name = props.name;
        this.statusCard = props.statusCard;
        this.urlImage = props.urlImage;
        this.createdAt = props.createdAt || new Date();
        this.updatedAt = props.updatedAt || new Date();
    }

    private generateId(): string {
        return Math.random().toString(36).substring(2, 9);
    }
    
}           
