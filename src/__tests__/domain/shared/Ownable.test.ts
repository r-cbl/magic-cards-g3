import { Ownable, validateOwnership, mustBeDifferentOwners, mustBelongToOwner } from '../../../domain/shared/Ownable';
import { User } from '../../../domain/entities/User';

class TestOwnable implements Ownable {
    constructor(private owner: User) {}

    getOwner(): User {
        return this.owner;
    }
}

describe('Ownable', () => {
    let owner: User;
    let testOwnable: TestOwnable;

    beforeEach(() => {
        owner = new User({
            name: 'Test Owner',
            email: 'test@example.com',
            password: 'password'
        });

        testOwnable = new TestOwnable(owner);
    });

    describe('validateOwnership', () => {
        it('should not throw error when user is the owner', () => {
            expect(() => validateOwnership(testOwnable, owner.getId(), 'test entity'))
                .not.toThrow();
        });

        it('should throw error when user is not the owner', () => {
            const otherUser = new User({
                name: 'Other User',
                email: 'other@example.com',
                password: 'password'
            });

            expect(() => validateOwnership(testOwnable, otherUser.getId(), 'test entity'))
                .toThrow('Unauthorized: only the owner can perform this action on the test entity');
        });
    });

    describe('mustBeDifferentOwners', () => {
        it('should not throw error when objects have different owners', () => {
            const otherUser = new User({
                name: 'Other User',
                email: 'other@example.com',
                password: 'password'
            });

            const otherOwnable = new TestOwnable(otherUser);

            expect(() => mustBeDifferentOwners(testOwnable, otherOwnable, 'first', 'second'))
                .not.toThrow();
        });

        it('should throw error when objects have the same owner', () => {
            const sameOwnable = new TestOwnable(owner);

            expect(() => mustBeDifferentOwners(testOwnable, sameOwnable, 'first', 'second'))
                .toThrow('first owner is the same as the second owner');
        });
    });

    describe('mustBelongToOwner', () => {
        it('should not throw error when all entities belong to the expected owner', () => {
            const entities = [
                new TestOwnable(owner),
                new TestOwnable(owner)
            ];

            expect(() => mustBelongToOwner(entities, owner))
                .not.toThrow();
        });

        it('should throw error when any entity does not belong to the expected owner', () => {
            const otherUser = new User({
                name: 'Other User',
                email: 'other@example.com',
                password: 'password'
            });

            const entities = [
                new TestOwnable(owner),
                new TestOwnable(otherUser)
            ];

            expect(() => mustBelongToOwner(entities, owner))
                .toThrow('Found entity not owned by expected user');
        });
    });
});
