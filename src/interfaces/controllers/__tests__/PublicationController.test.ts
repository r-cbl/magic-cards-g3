import { Request, Response } from 'express';
import { PublicationController } from '../PublicationController';
import { PublicationService } from '../../../application/services/PublicationService';
import { CreatePublicationDTO, PublicationFilterDTO, PublicationUpdatedDTO, PublicationResponseDTO } from '../../../application/dtos/PublicationDTO';
import { PublicationRepository } from '../../../domain/repositories/PublicationRepository';

// Mock the PublicationService
jest.mock('../../../application/services/PublicationService');

describe('PublicationController', () => {
    let publicationController: PublicationController;
    let mockPublicationService: jest.Mocked<PublicationService>;
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let mockNext: jest.Mock;

    beforeEach(() => {
        // Reset all mocks before each test
        jest.clearAllMocks();

        // Create mock service with a mock repository implementation
        const mockRepository: PublicationRepository = {
            save: jest.fn(),
            findById: jest.fn(),
            findAll: jest.fn(),
            update: jest.fn(),
            delete: jest.fn()
        };

        mockPublicationService = new PublicationService(mockRepository) as jest.Mocked<PublicationService>;
        publicationController = new PublicationController(mockPublicationService);

        // Setup mock request and response
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

        mockNext = jest.fn();
    });

    describe('createPublication', () => {
        it('should create a publication successfully', async () => {
            const publicationData: CreatePublicationDTO = {
                cardId: 'test-card-id',
                ownerId: 'test-user-id',
                cardExchangeIds: ['exchange1', 'exchange2'],
                valueMoney: 100
            };

            mockRequest.body = publicationData;
            const expectedPublication: PublicationResponseDTO = {
                id: 'test-id',
                name: 'Test Publication',
                valueMoney: 100,
                cardExchangeIds: ['exchange1', 'exchange2'],
                cardBase: {
                    Id: 'test-card-id',
                    Name: 'Test Card'
                },
                game: {
                    Id: 'test-game-id',
                    Name: 'Test Game'
                },
                owner: {
                    ownerId: 'test-user-id',
                    ownerName: 'Test User'
                },
                offers: [],
                createdAt: new Date()
            };

            mockPublicationService.createPublication.mockResolvedValue(expectedPublication);

            await publicationController.createPublication(
                mockRequest as Request,
                mockResponse as Response
            );

            expect(mockPublicationService.createPublication).toHaveBeenCalledWith(publicationData);
            expect(mockResponse.status).toHaveBeenCalledWith(201);
            expect(mockResponse.json).toHaveBeenCalledWith(expectedPublication);
        });

        it('should handle errors when creating publication', async () => {
            const error = new Error('Test error');
            mockPublicationService.createPublication.mockRejectedValue(error);

            await publicationController.createPublication(
                mockRequest as Request,
                mockResponse as Response
            );

            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Test error' });
        });
    });

    describe('getAllPublications', () => {
        it('should get all publications with filters', async () => {
            const filters: PublicationFilterDTO = {
                gamesIds: ['game1', 'game2'],
                cardBaseIds: ['card1', 'card2'],
                ownerId: 'test-owner',
                initialDate: new Date('2023-01-01'),
                endDate: new Date('2023-12-31'),
                minValue: 10,
                maxValue: 100
            };

            mockRequest.query = {
                gamesIds: 'game1,game2',
                cardBaseIds: 'card1,card2',
                ownerId: 'test-owner',
                initialDate: '2023-01-01',
                endDate: '2023-12-31',
                minValue: '10',
                maxValue: '100'
            };

            const expectedPublications: PublicationResponseDTO[] = [
                {
                    id: 'pub1',
                    name: 'Publication 1',
                    valueMoney: 50,
                    cardExchangeIds: ['card1'],
                    cardBase: {
                        Id: 'card1',
                        Name: 'Card 1'
                    },
                    game: {
                        Id: 'game1',
                        Name: 'Game 1'
                    },
                    owner: {
                        ownerId: 'owner1',
                        ownerName: 'Owner 1'
                    },
                    offers: [],
                    createdAt: new Date()
                }
            ];

            mockPublicationService.getAllPublications.mockResolvedValue(expectedPublications);

            await publicationController.getAllPublications(
                mockRequest as Request,
                mockResponse as Response
            );

            expect(mockPublicationService.getAllPublications).toHaveBeenCalledWith(filters);
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith(expectedPublications);
        });
    });

    describe('getPublication', () => {
        it('should get a single publication by id', async () => {
            const publicationId = 'test-id';
            mockRequest.params = { id: publicationId };
            const expectedPublication: PublicationResponseDTO = {
                id: publicationId,
                name: 'Test Publication',
                valueMoney: 100,
                cardExchangeIds: ['card1'],
                cardBase: {
                    Id: 'card1',
                    Name: 'Test Card'
                },
                game: {
                    Id: 'game1',
                    Name: 'Test Game'
                },
                owner: {
                    ownerId: 'owner1',
                    ownerName: 'Test Owner'
                },
                offers: [],
                createdAt: new Date()
            };

            mockPublicationService.getPublication.mockResolvedValue(expectedPublication);

            await publicationController.getPublication(
                mockRequest as Request,
                mockResponse as Response
            );

            expect(mockPublicationService.getPublication).toHaveBeenCalledWith(publicationId);
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith(expectedPublication);
        });
    });

    describe('updatePublication', () => {
        it('should update a publication successfully', async () => {
            const publicationId = 'test-id';
            const updateData: PublicationUpdatedDTO = {
                valueMoney: 150,
                cardExchangeIds: ['card1', 'card2']
            };

            mockRequest.params = { id: publicationId };
            mockRequest.body = updateData;
            const expectedPublication: PublicationResponseDTO = {
                id: publicationId,
                name: 'Updated Publication',
                valueMoney: 150,
                cardExchangeIds: ['card1', 'card2'],
                cardBase: {
                    Id: 'card1',
                    Name: 'Test Card'
                },
                game: {
                    Id: 'game1',
                    Name: 'Test Game'
                },
                owner: {
                    ownerId: 'owner1',
                    ownerName: 'Test Owner'
                },
                offers: [],
                createdAt: new Date()
            };

            mockPublicationService.updatePublication.mockResolvedValue(expectedPublication);

            await publicationController.updatePublication(
                mockRequest as Request,
                mockResponse as Response
            );

            expect(mockPublicationService.updatePublication).toHaveBeenCalledWith(
                'test-user-id',
                publicationId,
                updateData
            );
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith(expectedPublication);
        });
    });

    describe('deletePublication', () => {
        it('should delete a publication successfully', async () => {
            const publicationId = 'test-id';
            mockRequest.params = { id: publicationId };

            mockPublicationService.deletePublication.mockResolvedValue(true);

            await publicationController.deletePublication(
                mockRequest as Request,
                mockResponse as Response
            );

            expect(mockPublicationService.deletePublication).toHaveBeenCalledWith(
                'test-user-id',
                publicationId
            );
            expect(mockResponse.status).toHaveBeenCalledWith(204);
            expect(mockResponse.send).toHaveBeenCalled();
        });
    });
}); 