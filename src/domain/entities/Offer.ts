export interface OfferProps {
    id?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export class Offer {
    private readonly id: string;
    private readonly createdAt: Date;
    private updatedAt: Date;

    constructor(props: OfferProps) {
        this.id = props.id || this.generateId();
        this.createdAt = props.createdAt || new Date();
        this.updatedAt = props.updatedAt || new Date();
    }

    private generateId(): string {
        return Math.random().toString(36).substring(2, 9);
    }

}
