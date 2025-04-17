import { Request, Response } from 'express';
import { CardController } from '../../../interfaces/controllers/CardController';
import { CardService } from '../../../application/services/CardService';
import { CreateCardDTO, CardUpdatedDTO, CardResponseDTO } from '../../../application/dtos/CardsDTO';
import { cardRepository } from '../../../infrastructure/repositories/Container';

// Mock the repositories
jest.mock('../../../infrastructure/repositories/Container', () => ({
    cardRepository: {
        save: jest.fn(),
        find: jest.fn(),
        findById: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
    },
}));

// Mock the CardService methods
jest.mock('../../../application/services/CardService');

describe('CardController', () => {
    let cardController: CardController;
    let mockCardService: jest.Mocked<CardService>;
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;

    beforeEach(() => {
        jest.clearAllMocks();

        mockCardService = new CardService(cardRepository) as jest.Mocked<CardService>;
        cardController = new CardController(mockCardService);

        mockRequest = {
            user: { userId: 'test-user-id', email: 'test@example.com' },
            params: {},
            query: {},
            body: {}
        };

        mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
            send: jest.fn().mockReturnThis()
        };
    });

    describe('createCard', () => {
        it('should create a card successfully', async () => {
            const cardData: CreateCardDTO = {
                cardBaseId: 'test-card-base-id',
                statusCard: 1,
                urlImage: 'http://example.com/image.png',
                ownerId: 'test-user-id'
            };

            mockRequest.body = cardData;
            const expectedCard: CardResponseDTO = {
                id: 'test-id',
                urlImage: 'http://example.com/image.png',
                cardBase: {
                    Id: 'test-card-base-id',
                    Name: 'Test Card Base'
                },
                game: {
                    Id: 'test-game-id',
                    Name: 'Test Game'
                },
                owner: {
                    ownerId: 'test-user-id',
                    ownerName: 'Test User'
                },
                createdAt: new Date()
            };

            (cardRepository.save as jest.Mock).mockImplementation((card) => {
                return { ...card, id: expectedCard.id };
            });

            // Mock the service method
            mockCardService.createCard.mockResolvedValue(expectedCard);

            await cardController.createCard(mockRequest as Request, mockResponse as Response);

            expect(mockCardService.createCard).toHaveBeenCalledWith(cardData);
            expect(mockResponse.status).toHaveBeenCalledWith(201);
            expect(mockResponse.json).toHaveBeenCalledWith(expectedCard);
        });

        it('should handle errors when creating card', async () => {
            const error = new Error('Test error');
            mockCardService.createCard.mockRejectedValue(error);

            await cardController.createCard(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Test error' });
        });
    });

    describe('getAllCards', () => {
        it('should get all cards with filters', async () => {
            const filters = {
                ownerId: 'test-user-id'
            };

            mockRequest.query = filters;

            const expectedCards: CardResponseDTO[] = [
                {
                    id: 'card1',
                    urlImage: 'http://example.com/image1.png',
                    cardBase: {
                        Id: 'test-card-base-id',
                        Name: 'Test Card Base'
                    },
                    game: {
                        Id: 'test-game-id',
                        Name: 'Test Game'
                    },
                    owner: {
                        ownerId: 'test-user-id',
                        ownerName: 'Test User'
                    },
                    createdAt: new Date()
                }
            ];

            mockCardService.getAllCards.mockResolvedValue(expectedCards);

            await cardController.getAllCards(mockRequest as Request, mockResponse as Response);

            expect(mockCardService.getAllCards).toHaveBeenCalledWith(filters);
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith(expectedCards);
        });

        it('should handle errors when getting cards', async () => {
            const error = new Error('Test error');
            mockCardService.getAllCards.mockRejectedValue(error);

            await cardController.getAllCards(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Test error' });
        });
    });

    describe('getCard', () => {
        it('should get a single card by id', async () => {
            const cardId = 'test-id';
            mockRequest.params = { id: cardId };
            const expectedCard: CardResponseDTO = {
                id: cardId,
                urlImage: 'http://example.com/image.png',
                cardBase: {
                    Id: 'test-card-base-id',
                    Name: 'Test Card Base'
                },
                game: {
                    Id: 'test-game-id',
                    Name: 'Test Game'
                },
                owner: {
                    ownerId: 'test-user-id',
                    ownerName: 'Test User'
                },
                createdAt: new Date()
            };

            mockCardService.getCard.mockResolvedValue(expectedCard);

            await cardController.getCard(mockRequest as Request, mockResponse as Response);

            expect(mockCardService.getCard).toHaveBeenCalledWith(cardId);
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith(expectedCard);
        });

        it('should handle errors when getting a card', async () => {
            const error = new Error('Test error');
            mockCardService.getCard.mockRejectedValue(error);

            await cardController.getCard(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Test error' });
        });
    });

    describe('updateCard', () => {
        it('should update a card successfully', async () => {
            const cardId = 'test-id';
            const updateData: CardUpdatedDTO = {
                ownerId: 'test-user-id',
                urlImage: 'http://example.com/updated-image.png',
                statusCard: 2
            };

            mockRequest.params = { id: cardId };
            mockRequest.body = updateData;
            const expectedCard: CardResponseDTO = {
                id: cardId,
                urlImage: 'http://example.com/updated-image.png',
                cardBase: {
                    Id: 'test-card-base-id',
                    Name: 'Test Card Base'
                },
                game: {
                    Id: 'test-game-id',
                    Name: 'Test Game'
                },
                owner: {
                    ownerId: 'test-user-id',
                    ownerName: 'Test User'
                },
                createdAt: new Date()
            };

            mockCardService.updateCard.mockResolvedValue(expectedCard);

            await cardController.updateCard(mockRequest as Request, mockResponse as Response);

            expect(mockCardService.updateCard).toHaveBeenCalledWith(cardId, updateData);
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith(expectedCard);
        });

        it('should handle errors when updating a card', async () => {
            const error = new Error('Test error');
            mockCardService.updateCard.mockRejectedValue(error);

            await cardController.updateCard(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Test error' });
        });
    });

    describe('deleteCard', () => {
        it('should delete a card successfully', async () => {
            const cardId = 'test-id';
            mockRequest.params = { id: cardId };

            mockCardService.deleteCard.mockResolvedValue(true);

            await cardController.deleteCard(mockRequest as Request, mockResponse as Response);

            expect(mockCardService.deleteCard).toHaveBeenCalledWith('test-user-id', cardId);
            expect(mockResponse.status).toHaveBeenCalledWith(204);
            expect(mockResponse.send).toHaveBeenCalled();
        });

        it('should handle errors when deleting a card', async () => {
            const error = new Error('Test error');
            mockCardService.deleteCard.mockRejectedValue(error);

            await cardController.deleteCard(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Test error' });
        });
    });
});
