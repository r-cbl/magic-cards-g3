import { Game } from "./Game";

export interface CardProps {
    id?: string;
    game: Game;
    nameCard: string;
    urlImage?: string;
    valueMoney?: number;
    createdAt?: Date;
    updatedAt?: Date;
}

export class Card {
    private readonly id: string;
    private game: Game;
    private nameCard: string;
    private urlImage?: string;
    private valueMoney?: number;
    private readonly createdAt: Date;
    private updatedAt: Date;

    constructor(props: CardProps) {
        this.id = props.id || this.generateId();
        this.game = props.game;
        this.nameCard = props.nameCard;
        this.urlImage = props.urlImage;
        this.valueMoney = props.valueMoney;
        this.createdAt = props.createdAt || new Date();
        this.updatedAt = props.updatedAt || new Date();
    }

    private generateId(): string {
        return Math.random().toString(36).substring(2, 9);
    }
    
}           
