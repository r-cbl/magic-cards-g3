import { Request, Response } from 'express';
import { OfferController } from '../../../interfaces/controllers/OfferController';
import { OfferService } from '../../../application/services/OfferService';
import { CreateOfferDTO, OfferUpdatedDTO, OfferResponseDTO } from '../../../application/dtos/OfferDTO';
import { offerRepository } from '../../../infrastructure/provider/Container';

// Mock the repositories
jest.mock('../../../infrastructure/repositories/Container', () => ({
    offerRepository: {
        save: jest.fn(),
        find: jest.fn(),
        findById: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        findPaginated: jest.fn()
    },
}));

// Mock the OfferService methods
jest.mock('../../../application/services/OfferService');

describe('OfferController', () => {
    let offerController: OfferController;
    let mockOfferService: jest.Mocked<OfferService>;
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;

    beforeEach(() => {
        jest.clearAllMocks();

        mockOfferService = new OfferService(offerRepository) as jest.Mocked<OfferService>;
        offerController = new OfferController(mockOfferService);

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

    describe('createOffer', () => {
        it('should create an offer successfully', async () => {
            const offerData: CreateOfferDTO = {
                publicationId: 'valid-publication-id',
                offerOwnerId: 'test-user-id',
                moneyOffer: 100,
                cardExchangeIds: ['card-id-1', 'card-id-2']
            };

            mockRequest.body = offerData;
            const expectedOffer: OfferResponseDTO = {
                id: 'offer-id',
                publicationId: 'valid-publication-id',
                moneyOffer: 100,
                cardExchangeIds: ['card-id-1', 'card-id-2'],
                createdAt: new Date(),
                updatedAt: new Date(),
                status: 'PENDING',
                ownerId: 'test-user-id',
            };

            (offerRepository.save as jest.Mock).mockImplementation((offer) => {
                return { ...offer, id: expectedOffer.id };
            });

            // Mock the service method
            mockOfferService.createOffer.mockResolvedValue(expectedOffer);

            await offerController.createOffer(mockRequest as Request, mockResponse as Response);

            expect(mockOfferService.createOffer).toHaveBeenCalledWith(offerData);
            expect(mockResponse.status).toHaveBeenCalledWith(201);
            expect(mockResponse.json).toHaveBeenCalledWith(expectedOffer);
        });

        it('should handle errors when creating an offer', async () => {
            const error = new Error('Test error');
            mockOfferService.createOffer.mockRejectedValue(error);

            await offerController.createOffer(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Test error' });
        });
    });

    describe('getAllOffers', () => {
        it('should get all offers with filters', async () => {
            const filters = {
                ownerId: 'test-user-id',
                publicationId: 'valid-publication-id',
                status: 'PENDING'
            };

            mockRequest.query = filters;

            const expectedOffers: OfferResponseDTO[] = [
                {
                    id: 'offer-id',
                    publicationId: 'valid-publication-id',
                    moneyOffer: 100,
                    cardExchangeIds: ['card-id-1', 'card-id-2'],
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    status: 'PENDING',
                    ownerId: 'test-user-id',
                }
            ];

            mockOfferService.getAllOffer.mockResolvedValue(expectedOffers);

            await offerController.getAllOffers(mockRequest as Request, mockResponse as Response);

            expect(mockOfferService.getAllOffer).toHaveBeenCalledWith(filters);
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith(expectedOffers);
        });

        it('should handle errors when getting offers', async () => {
            const error = new Error('Test error');
            mockOfferService.getAllOffer.mockRejectedValue(error);

            await offerController.getAllOffers(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Test error' });
        });
    });

    describe('getOffer', () => {
        it('should get a single offer by id', async () => {
            const offerId = 'offer-id';
            mockRequest.params = { id: offerId };
            const expectedOffer: OfferResponseDTO = {
                id: offerId,
                publicationId: 'valid-publication-id',
                moneyOffer: 100,
                cardExchangeIds: ['card-id-1', 'card-id-2'],
                createdAt: new Date(),
                updatedAt: new Date(),
                status: 'PENDING',
                ownerId: 'test-user-id',
            };

            mockOfferService.getOffer.mockResolvedValue(expectedOffer);

            await offerController.getOffer(mockRequest as Request, mockResponse as Response);

            expect(mockOfferService.getOffer).toHaveBeenCalledWith(offerId);
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith(expectedOffer);
        });

        it('should handle errors when getting an offer', async () => {
            const error = new Error('Test error');
            mockOfferService.getOffer.mockRejectedValue(error);

            await offerController.getOffer(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Test error' });
        });
    });

    describe('updateOffer', () => {
        it('should update an offer successfully', async () => {
            const offerId = 'offer-id';
            const updateData: OfferUpdatedDTO = {
                userId: 'test-user-id',
                publicationId: 'valid-publication-id',
                statusOffer: 'ACCEPTED'
            };

            mockRequest.params = { id: offerId };
            mockRequest.body = updateData;
            const expectedOffer: OfferResponseDTO = {
                id: offerId,
                publicationId: 'valid-publication-id',
                moneyOffer: 100,
                cardExchangeIds: ['card-id-1', 'card-id-2'],
                createdAt: new Date(),
                updatedAt: new Date(),
                status: 'ACCEPTED',
                ownerId: 'test-user-id',
            };

            mockOfferService.updateOffer.mockResolvedValue(expectedOffer);

            await offerController.updateOffer(mockRequest as Request, mockResponse as Response);

            expect(mockOfferService.updateOffer).toHaveBeenCalledWith(offerId, updateData);
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith(expectedOffer);
        });

        it('should handle errors when updating an offer', async () => {
            const error = new Error('Test error');
            mockOfferService.updateOffer.mockRejectedValue(error);

            await offerController.updateOffer(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Test error' });
        });
    });

});
