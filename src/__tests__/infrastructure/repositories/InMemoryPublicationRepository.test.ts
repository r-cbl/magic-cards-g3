import { InMemoryPublicationRepository } from '../../../infrastructure/repositories/InMemoryPublicationRepository';
import { Publication } from '../../../domain/entities/Publication';
import { User } from '../../../domain/entities/User';
import { Card } from '../../../domain/entities/Card';
import { CardBase } from '../../../domain/entities/CardBase';
import { Game } from '../../../domain/entities/Game';
import { PublicationFilterDTO } from '../../../application/dtos/PublicationDTO';

describe('InMemoryPublicationRepository', () => {
    let repository: InMemoryPublicationRepository;
    let user: User;
    let game: Game;
    let cardBase: CardBase;
    let card: Card;
    let publication: Publication;

    beforeEach(() => {
        repository = new InMemoryPublicationRepository();
        
        user = new User({
            name: 'Test User',
            email: 'test@example.com',
            password: 'password'
        });

        game = new Game({
            name: 'Test Game'
        });

        cardBase = new CardBase({
            game: game,
            nameCard: 'Test Card'
        });

        card = new Card({
            owner: user,
            cardBase: cardBase,
            statusCard: 1
        });

        publication = new Publication({
            owner: user,
            card: card,
            valueMoney: 100
        });
    });

    describe('save', () => {
        it('should save a publication', async () => {
            const savedPublication = await repository.save(publication);
            expect(savedPublication).toBe(publication);
        });

        it('should throw error when saving a publication with existing ID', async () => {
            await repository.save(publication);
            await expect(repository.save(publication)).rejects.toThrow(
                `Publication with ID '${publication.getId()}' already exists`
            );
        });
    });

    describe('findById', () => {
        it('should find a publication by ID', async () => {
            await repository.save(publication);
            const foundPublication = await repository.findById(publication.getId());
            expect(foundPublication).toBe(publication);
        });

        it('should throw error when publication is not found', async () => {
            await expect(repository.findById('non-existent-id')).rejects.toThrow('Publication not found');
        });
    });

    describe('findAll', () => {
        it('should return all publications', async () => {
            await repository.save(publication);
            const publications = await repository.findAll();
            expect(publications).toContain(publication);
        });

        it('should return empty array when no publications exist', async () => {
            const publications = await repository.findAll();
            expect(publications).toEqual([]);
        });
    });

    describe('update', () => {
        it('should update a publication', async () => {
            await repository.save(publication);
            publication.setValueMoney(200);
            const updatedPublication = await repository.update(publication);
            expect(updatedPublication.getValueMoney()).toBe(200);
        });

        it('should throw error when updating non-existent publication', async () => {
            await expect(repository.update(publication)).rejects.toThrow('Publication not found');
        });
    });

    describe('delete', () => {
        it('should delete a publication', async () => {
            await repository.save(publication);
            const result = await repository.delete(publication.getId());
            expect(result).toBe(true);
            await expect(repository.findById(publication.getId())).rejects.toThrow('Publication not found');
        });

        it('should return false when deleting non-existent publication', async () => {
            const result = await repository.delete('non-existent-id');
            expect(result).toBe(false);
        });
    });

    describe('find', () => {
        beforeEach(async () => {
            await repository.save(publication);
        });

        it('should filter by game ID', async () => {
            const filters: PublicationFilterDTO = {
                gamesIds: [game.getId()]
            };
            const publications = await repository.find(filters);
            expect(publications).toContain(publication);
        });

        it('should filter by card base ID', async () => {
            const filters: PublicationFilterDTO = {
                cardBaseIds: [cardBase.getId()]
            };
            const publications = await repository.find(filters);
            expect(publications).toContain(publication);
        });

        it('should filter by owner ID', async () => {
            const filters: PublicationFilterDTO = {
                ownerId: user.getId()
            };
            const publications = await repository.find(filters);
            expect(publications).toContain(publication);
        });

        it('should filter by date range', async () => {
            const filters: PublicationFilterDTO = {
                initialDate: new Date(Date.now() - 1000),
                endDate: new Date(Date.now() + 1000)
            };
            const publications = await repository.find(filters);
            expect(publications).toContain(publication);
        });

        it('should filter by value range', async () => {
            const filters: PublicationFilterDTO = {
                minValue: 50,
                maxValue: 150
            };
            const publications = await repository.find(filters);
            expect(publications).toContain(publication);
        });

        it('should return empty array when no publications match filters', async () => {
            const filters: PublicationFilterDTO = {
                gamesIds: ['non-existent-game']
            };
            const publications = await repository.find(filters);
            expect(publications).toEqual([]);
        });
    });
});
