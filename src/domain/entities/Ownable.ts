import { User } from "../entities/User";
import { UnauthorizedException } from "./exceptions/exceptions";

export class Ownable {
    private owner: User;

    constructor(owner: User) {
        this.owner = owner;
    }

    public getOwner(): User {
        return this.owner;
    }

    public setOwner(owner: User) {
        this.owner = owner;
    }

    public validateOwnership(owner: User, entityName: string): void {
        if (this.getOwner().getId() !== owner.getId()) {
            throw new UnauthorizedException(`Only the owner can perform this action on the ${entityName}`);
        }
    }

    public mustBeDifferentOwners(b: Ownable, c: string, d: string): void {
        if (this.getOwner().getId() === b.getOwner().getId()) {
            throw new Error(`${c} owner is the same as the ${d} owner`);
        }
    }


}