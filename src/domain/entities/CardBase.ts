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
    
    public getCreatedAt(): Date {
        return this.createdAt;
    }

    public getUpdatedAt(): Date {
        return this.updatedAt;
    }

    public setName(name: string): void {
        this.nameCard = name;
        this.updatedAt = new Date();
    }

    public setGame(game: Game): void {
        this.game = game;
        this.updatedAt = new Date();
    }

    public toJSON() {
        return {
            id: this.id,
            game: this.game.toJSON(),
            nameCard: this.nameCard,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        };
    }
}           