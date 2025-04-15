import { PublicationService } from '../../application/services/PublicationService';
import { PublicationRepository } from '../../domain/repositories/PublicationRepository';
import { userRepository, cardRepository, cardBaseRepository, offerRepository } from '../../infrastructure/repositories/Container';
import { Card } from '../../domain/entities/Card';
import { CardBase } from '../../domain/entities/CardBase';
import { Game } from '../../domain/entities/Game';
import { Publication } from '../../domain/entities/Publication';
import { User } from '../../domain/entities/User';
import { CreatePublicationDTO, PublicationFilterDTO, PublicationUpdatedDTO } from '../../application/dtos/PublicationDTO';
import { StatusOffer } from '../../domain/entities/StatusOffer';
import { Offer } from '../../domain/entities/Offer';
import { StatusPublication } from '../../domain/entities/StatusPublication';

jest.mock('../../infrastructure/repositories/Container', () => ({
  userRepository: { findById: jest.fn() },
  cardRepository: { findById: jest.fn() },
  cardBaseRepository: { findById: jest.fn() },
  offerRepository: { update: jest.fn() }
}));

describe('PublicationService', () => {
  let publicationService: PublicationService;
  let mockRepository: jest.Mocked<PublicationRepository>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockRepository = {
      save: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      find: jest.fn(),
    };
    publicationService = new PublicationService(mockRepository);
  });

  const createEntities = () => {
    const otherUser = new User({ name: 'Other User', email: 'other@test.com', password: 'pass' });
    const user = new User({ name: 'User', email: 'user@test.com', password: 'pass' });
    const game = new Game({ name: 'Game' });
    const cardBase = new CardBase({ game, nameCard: 'CardBase' });
    const card = new Card({ cardBase, owner: user, statusCard: 1 });
    const publication = new Publication({ owner: user, card, cardExchange: [], valueMoney: 100 });
    return { user, otherUser, game, cardBase, card, publication };
  };

  describe('createPublication', () => {
    it('should create a publication with valueMoney', async () => {
      const { user, card, publication } = createEntities();
      const dto: CreatePublicationDTO = { cardId: 'card1', ownerId: user.getId(), cardExchangeIds: [], valueMoney: 100 };

      (userRepository.findById as jest.Mock).mockResolvedValue(user);
      (cardRepository.findById as jest.Mock).mockResolvedValue(card);
      mockRepository.save.mockResolvedValue(publication);

      const result = await publicationService.createPublication(dto);
      expect(result.valueMoney).toBe(100);
    });

    it('should create with cardExchangeIds', async () => {
      const { user, card, publication } = createEntities();
      const cardBase2 = new CardBase({ game: card.getCardBase().getGame(), nameCard: 'Exchange' });

      const dto: CreatePublicationDTO = { cardId: 'card1', ownerId: user.getId(), cardExchangeIds: ['cb1', 'cb2'] };

      (userRepository.findById as jest.Mock).mockResolvedValue(user);
      (cardRepository.findById as jest.Mock).mockResolvedValue(card);
      (cardBaseRepository.findById as jest.Mock).mockResolvedValueOnce(cardBase2).mockResolvedValueOnce(cardBase2);
      mockRepository.save.mockResolvedValue(publication);

      const result = await publicationService.createPublication(dto);
      expect(result.cardExchangeIds.length).toBeGreaterThan(0);
    });

    it('should fail if neither money nor cards provided', async () => {
      const dto: CreatePublicationDTO = { cardId: 'card1', ownerId: 'u1', cardExchangeIds: [] };
      await expect(publicationService.createPublication(dto)).rejects.toThrow();
    });
  });

  describe('getAllPublications', () => {
    it('should return filtered publications', async () => {
      const { user, publication } = createEntities();
      const filters: PublicationFilterDTO = { ownerId: user.getId() };

      (userRepository.findById as jest.Mock).mockResolvedValue(user);
      mockRepository.find.mockResolvedValue([publication]);

      const result = await publicationService.getAllPublications(filters);
      expect(result).toHaveLength(1);
    });

    it('should throw if initialDate > endDate', async () => {
      const filters: PublicationFilterDTO = { initialDate: new Date('2023-12-31'), endDate: new Date('2023-01-01') };
      await expect(publicationService.getAllPublications(filters)).rejects.toThrow();
    });
  });

  describe('getPublication', () => {
    it('should get publication by id', async () => {
      const { publication } = createEntities();
      mockRepository.findById.mockResolvedValue(publication);
      const result = await publicationService.getPublication(publication.getId());
      expect(result.id).toBe(publication.getId());
    });
  });

  describe('updatePublication', () => {
    it('should update valueMoney and cards', async () => {
      const { user, publication } = createEntities();
      const dto: PublicationUpdatedDTO = { valueMoney: 150, cardExchangeIds: [], userId: user.getId() };
      (userRepository.findById as jest.Mock).mockResolvedValue(user);
      mockRepository.findById.mockResolvedValue(publication);
      mockRepository.update.mockResolvedValue(publication);

      const result = await publicationService.updatePublication(publication.getId(), dto);
      expect(result.valueMoney).toBe(150);
    });

    it('should fail if not owner', async () => {
      const { user, otherUser, publication } = createEntities();
      (userRepository.findById as jest.Mock).mockResolvedValue(user);
      const dto: PublicationUpdatedDTO = { valueMoney: 150, cardExchangeIds: [], userId: otherUser.getId() };
      mockRepository.findById.mockResolvedValue(publication);
        await expect(publicationService.updatePublication(publication.getId(), dto))
        .rejects.toThrow();
    });

    it('should close publication and reject offers', async () => {
      const { publication, otherUser, game, cardBase } = createEntities(); 
      
      // Create cards for the other user to offer
      const offerCard1 = new Card({ 
        cardBase, 
        owner: otherUser, 
        statusCard: 90 
      });
      
      const offerCard2 = new Card({ 
        cardBase, 
        owner: otherUser, 
        statusCard: 85 
      });
      
      const offerCard3 = new Card({ 
        cardBase, 
        owner: otherUser, 
        statusCard: 80 
      });
      
      // Create offers with cards
      const offer1 = new Offer({
        offerOwner: otherUser,
        cardOffers: [offerCard1],
        moneyOffer: 50,
        statusOffer: StatusOffer.PENDING
      });
      
      const offer2 = new Offer({
        offerOwner: otherUser,
        cardOffers: [offerCard2, offerCard3],
        moneyOffer: 75,
        statusOffer: StatusOffer.PENDING
      });
      
      // Add offers to the publication
      publication.addOffer(offer1);
      publication.addOffer(offer2);
      
      mockRepository.findById.mockResolvedValue(publication);
      mockRepository.update.mockResolvedValue(publication);
      (userRepository.findById as jest.Mock).mockResolvedValue(publication.getOwner());
      (offerRepository.update as jest.Mock).mockResolvedValue((offer: Offer) => offer);

      const result = await publicationService.updatePublication(
        publication.getId(), 
        { 
          userId: publication.getOwner().getId(), 
          cancel: true, 
          cardExchangeIds: [] 
        }
      );
      
      // Verify all offers are rejected
      expect(result.offers.every(offer => offer.statusOffer === StatusOffer.REJECTED)).toBe(true);
      
      // Verify the cards ownership hasn't changed
      expect(offerCard1.getOwner()).toBe(otherUser);
      expect(offerCard2.getOwner()).toBe(otherUser);
      expect(offerCard3.getOwner()).toBe(otherUser);
      
      // Verify publication is closed
      expect(publication.getStatusPublication()).toBe(StatusPublication.CLOSED);
    });
  });

  describe('deletePublication', () => {
    it('should delete publication if owner', async () => {
      const { user, publication } = createEntities();
      mockRepository.findById.mockResolvedValue(publication);
      mockRepository.delete.mockResolvedValue(true);
      (userRepository.findById as jest.Mock).mockResolvedValue(user);

      const result = await publicationService.deletePublication(user.getId(), publication.getId());
      expect(result).toBe(true);
    });

    it('should fail if not owner', async () => {
      const { publication } = createEntities();
      mockRepository.findById.mockResolvedValue(publication);
      await expect(publicationService.deletePublication('other', publication.getId())).rejects.toThrow();
    });
  });
});
