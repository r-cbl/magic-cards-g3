export interface StatusOfferProps {
    id?: string;
    name: string;
    createdAt?: Date;
    updatedAt?: Date;
  }

export class StatusOffer {
    private readonly id: string;
    private name: string;
    private readonly createdAt: Date;
    private updatedAt: Date;

    constructor(props: StatusOfferProps) {
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