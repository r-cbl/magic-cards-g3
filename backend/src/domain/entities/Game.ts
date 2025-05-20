import { generateUUID } from "./utils";

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
        this.id = props.id || generateUUID();
        this.name = props.name;
        this.createdAt = props.createdAt || new Date();
        this.updatedAt = props.updatedAt || new Date();
    }

    public getId(): string {
        return this.id;
    }

    public getName(): string {
        return this.name;
    }

    public getCreatedAt(): Date {
        return this.createdAt;
    }

    public getUpdatedAt(): Date {
        return this.updatedAt;
    }

    public setName(name: string): void {
        this.name = name;
        this.updatedAt = new Date();
    }

    public toJSON() {
        return {
            id: this.id,
            name: this.name,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        };
    }
}   