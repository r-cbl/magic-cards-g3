export interface GameProps {
    id?: string;
    name: string;
    createdAt?: Date;
    updatedAt?: Date;
  }

export class Game {
    private readonly id: string;
    private name: string;
    private readonly createdAt: Date;
    private updatedAt: Date;

    constructor(props: GameProps) {
        this.id = props.id || this.generateId();
        this.name = props.name;
        this.createdAt = props.createdAt || new Date();
        this.updatedAt = props.updatedAt || new Date();
    }
    private generateId(): string {
        return Math.random().toString(36).substring(2, 9);
    }

    public getName(): string {
        return this.name;
    }

}   