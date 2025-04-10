import { Game } from "./Game";

export interface CardBaseProps {
    id?: string;
    game: Game;
    nameCard: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export class CardBase {
    private readonly id: string;
    private game: Game;
    private nameCard: string;
    private readonly createdAt: Date;
    private updatedAt: Date;

    constructor(props: CardBaseProps) {
        this.id = props.id || this.generateId();
        this.game = props.game;
        this.nameCard = props.nameCard;
        this.createdAt = props.createdAt || new Date();
        this.updatedAt = props.updatedAt || new Date();
    }

    private generateId(): string {
        return Math.random().toString(36).substring(2, 9);
    }

    public getId(): string {
        return this.id;
      }
      
    public getGame(): Game {
        return this.game;
      }

    public getName(): string {
        return this.nameCard
      }
    
}           