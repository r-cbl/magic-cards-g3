import { User } from "../entities/User";

export interface Ownable {
  getOwner(): User;
}

    export function validateOwnership(entity: Ownable, userId: String, entityName: string): void {
        if (entity.getOwner().getId() !== userId) {
            throw new Error(`Unauthorized: only the owner can perform this action on the ${entityName}`);
        }
    }
  
    export function mustBeDifferentOwners(a: Ownable, b: Ownable, c: string, d: string): void {
        if (a.getOwner().getId() === b.getOwner().getId()) {
            throw new Error(`${c} owner is the same as the ${d} owner`);
        }
    }

    export function mustBelongToOwner(entities: Ownable[], expectedOwner: User): void {
        const invalid = entities.find((e) => e.getOwner().getId() !== expectedOwner.getId());
        if (invalid) {
            throw new Error("Found entity not owned by expected user");
        }
    }
  