import { OfferService } from "../../application/services/OfferService";
import { CreateOfferDTO, OfferUpdatedDTO } from "../../application/dtos/OfferDTO";
import { OfferRepository } from "../../domain/repositories/OfferRepository";
import { userRepository, publicationRepository, cardRepository, offerRepository, statisticsRepository } from "../../infrastructure/repositories/Container";
import { User } from "../../domain/entities/User";  
import { Publication } from "../../domain/entities/Publication";
import { Card } from "../../domain/entities/Card";
import { CardBase } from "../../domain/entities/CardBase";
import { Game } from "../../domain/entities/Game";
import { Offer } from "../../domain/entities/Offer";
import { StatusOffer } from "../../domain/entities/StatusOffer";
import { StatusPublication } from "../../domain/entities/StatusPublication";
import { UnauthorizedException } from "../../domain/entities/exceptions/exceptions";
// Mock the repositories
jest.mock("../../infrastructure/repositories/Container", () => ({
  userRepository: {
    findById: jest.fn(),
  },
  publicationRepository: {
    findById: jest.fn(),
    update: jest.fn(),
  },
  cardRepository: {
    findById: jest.fn(),
    findByCardsByIds: jest.fn(),
    update: jest.fn(),
  },
  statisticsRepository: {
    increment: jest.fn(),
  },
}));

describe('OfferService', () => {
  let offerService: OfferService;
  let mockOfferRepository: jest.Mocked<OfferRepository>;
  
  // Test data
  const testUser = new User({
    name: "Test User",
    email: "test@example.com",
    password: "password123"
  });

  const testUser1 = new User({
    name: "Test User 1",
    email: "test1@example.com",
    password: "password123"
  });
  
  const testGame = new Game({ name: "Pokemon" });
  const testCardBase = new CardBase({ game: testGame, nameCard: "Pikachu" });
  const testCard = new Card({
    cardBase: testCardBase,
    owner: testUser1,
    statusCard: 100
  });
  
  const testPublication = new Publication({
    card: testCard,
    owner: testUser1,
    valueMoney: 100
  });

  beforeEach(() => {
    jest.clearAllMocks();
    
    mockOfferRepository = {
      save: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    
    offerService = new OfferService(mockOfferRepository);
  });

  it('should throw error when creating offer for non-existent publication', async () => {
    const offerData: CreateOfferDTO = {
      publicationId: 'non-existent-id',
      offerOwnerId: 'user-id',
      moneyOffer: 100
    };
    
    (publicationRepository.findById as jest.Mock).mockResolvedValue(null);
    (userRepository.findById as jest.Mock).mockResolvedValue(testUser);

    await expect(offerService.createOffer(offerData))
      .rejects
      .toThrow('Publication not found');
  });

  it('should create an offer with money for a valid publication', async () => {
    // Arrange
    const offerData: CreateOfferDTO = {
      publicationId: 'valid-pub-id',
      offerOwnerId: 'user-id',
      moneyOffer: 100
    };
    
    (publicationRepository.findById as jest.Mock).mockResolvedValue(testPublication);
    (userRepository.findById as jest.Mock).mockResolvedValue(testUser);
    (publicationRepository.update as jest.Mock).mockResolvedValue(testPublication);
    (mockOfferRepository.save as jest.Mock).mockImplementation(offer => offer);

    // Act
    const result = await offerService.createOffer(offerData);

    // Assert
    expect(result).toBeDefined();
    expect(result.getMoneyOffer()).toBe(100);
    expect(publicationRepository.update).toHaveBeenCalled();
    expect(mockOfferRepository.save).toHaveBeenCalled();
  });

  it('should throw error when creating offer with non-existent card', async () => {
    // Arrange

    const existingCard = new Card({
        cardBase: testCardBase,
        statusCard: 100,
        owner: testUser1
      });

    const offerData: CreateOfferDTO = {
      publicationId: 'valid-pub-id',
      offerOwnerId: 'user-id',
      moneyOffer: 50,
      cardExchangeIds: [existingCard.getId(), 'non-existent-card']
    };
    
    
    
    (publicationRepository.findById as jest.Mock).mockResolvedValue(testPublication);
    (userRepository.findById as jest.Mock).mockResolvedValue(testUser);
    (cardRepository.findByCardsByIds as jest.Mock).mockResolvedValue([existingCard]);

    // Act & Assert
    await expect(offerService.createOffer(offerData))
      .rejects
      .toThrow('Invalid cards with IDs: non-existent-card');
  });

  it('should create a valid offer with only cards that belong to the user', async () => {
    // Arrange
    const publicationOwner = new User({
      name: "Publication Owner",
      email: "pub.owner@example.com",
      password: "password123"
    });

    const offerOwner = new User({
      name: "Offer Owner",
      email: "offer.owner@example.com",
      password: "password123"
    });

    const testCard1 = new Card({
      cardBase: testCardBase,
      owner: publicationOwner,
      statusCard: 100
    });

    const publicationWithDifferentOwner = new Publication({
      card: testCard1,
      owner: publicationOwner,
      valueMoney: 100
    });

    const userCard1 = new Card({
      cardBase: testCardBase,
      owner: offerOwner,
      statusCard: 100
    });
    
    const userCard2 = new Card({
      cardBase: testCardBase,
      owner: offerOwner,
      statusCard: 100
    });
    
    const offerData: CreateOfferDTO = {
      publicationId: publicationWithDifferentOwner.getId(),
      offerOwnerId: offerOwner.getId(),
      cardExchangeIds: [userCard1.getId(), userCard2.getId()]
    };
    
    (publicationRepository.findById as jest.Mock).mockResolvedValue(publicationWithDifferentOwner);
    (userRepository.findById as jest.Mock).mockResolvedValue(offerOwner);
    (cardRepository.findByCardsByIds as jest.Mock).mockResolvedValue([userCard1, userCard2]);
    (publicationRepository.update as jest.Mock).mockResolvedValue(publicationWithDifferentOwner);
    (mockOfferRepository.save as jest.Mock).mockImplementation(offer => offer);
    // Act
    const result = await offerService.createOffer(offerData);

    // Assert
    expect(result).toBeDefined();
    expect(result.getCardOffers()).toHaveLength(2);
    expect(result.getOfferOwner()).toBe(offerOwner);
    expect(publicationRepository.update).toHaveBeenCalled();
    expect(mockOfferRepository.save).toHaveBeenCalled();
  });

  it('should throw error when creating offer for own publication', async () => {
    // Arrange
    const owner = new User({
      name: "Same Owner",
      email: "owner@example.com",
      password: "password123"
    });

    const testCard1 = new Card({
      cardBase: testCardBase,
      owner: owner,
      statusCard: 100
    });

    const publicationOwnedByUser = new Publication({
      card: testCard1,
      owner: owner,
      valueMoney: 100
    });

    const offerData: CreateOfferDTO = {
      publicationId: 'own-pub-id',
      offerOwnerId: 'owner-id',
      moneyOffer: 150
    };
    
    (publicationRepository.findById as jest.Mock).mockResolvedValue(publicationOwnedByUser);
    (userRepository.findById as jest.Mock).mockResolvedValue(owner);

    // Act & Assert
    await expect(offerService.createOffer(offerData))
      .rejects
      .toThrow();
  });
  describe('updateOffer', () => {
    it('should throw error when accepting offer for non-existent publication', async () => {
      const offerData: OfferUpdatedDTO = {
        statusOffer: "accepted",
        userId: 'user-id',
        publicationId: 'publication-id'
      };
      (publicationRepository.findById as jest.Mock).mockResolvedValue(null);
      (userRepository.findById as jest.Mock).mockResolvedValue(testUser);
      (mockOfferRepository.findById as jest.Mock).mockResolvedValue(null);
      await expect(offerService.updateOffer('offer-id',offerData))
        .rejects
        .toThrow('Offer or publication not found');
    });
    it('should throw error when accepting offer for non-existent offer', async () => {
      const offerData: OfferUpdatedDTO = {
        statusOffer: "accepted",
        userId: 'user-id',
        publicationId: 'publication-id'
      };
      (publicationRepository.findById as jest.Mock).mockResolvedValue(testPublication);
      (userRepository.findById as jest.Mock).mockResolvedValue(testUser);
      (mockOfferRepository.findById as jest.Mock).mockResolvedValue(null);
      await expect(offerService.updateOffer('offer-id',offerData))
        .rejects
        .toThrow('Offer or publication not found');
    });
    it('should throw an error when accepting an offer for a publication that is not owned by the user', async () => {
      const offerData: OfferUpdatedDTO = {
        statusOffer: "accepted",
        userId: 'user-id',
        publicationId: 'publication-id'
      };
      const publicationOwner = new User({
        name: "Publication Owner",
        email: "pub.owner@example.com",
        password: "password123"
      });
      const offer = new Offer({
        offerOwner: testUser1,
        cardOffers: [testCard],
        moneyOffer: 100,
        statusOffer: StatusOffer.DRAFT
      });

      const testCard1 = new Card({
        cardBase: testCardBase,
        owner: publicationOwner,
        statusCard: 100
      });

      const publicationOwnedByUser = new Publication({
        card: testCard1,
        owner: publicationOwner,
        valueMoney: 100
      });
      (publicationRepository.findById as jest.Mock).mockResolvedValue(publicationOwnedByUser);
      (userRepository.findById as jest.Mock).mockResolvedValue(testUser);
      (mockOfferRepository.findById as jest.Mock).mockResolvedValue(offer);
      await expect(offerService.updateOffer('offer-id',offerData)).rejects.toThrow()
    });
    it('should change the status of the offer to accepted', async () => {
      const offerData: OfferUpdatedDTO = {
        statusOffer: "accepted",
        userId: 'user-id',
        publicationId: 'publication-id'
      };
      const offer = new Offer({
        offerOwner: testUser1,
        cardOffers: [testCard],
        moneyOffer: 100,
        statusOffer: StatusOffer.PENDING
      });
      (mockOfferRepository.findById as jest.Mock).mockResolvedValue(offer);
      (mockOfferRepository.update as jest.Mock).mockResolvedValue(offer);
      (publicationRepository.findById as jest.Mock).mockResolvedValue(testPublication);
      (userRepository.findById as jest.Mock).mockResolvedValue(testUser1);
      (cardRepository.update as jest.Mock).mockResolvedValue(testCard);

      const result = await offerService.updateOffer('offer-id',offerData);
      expect(result).toBeDefined();
      expect(result.getStatusOffer()).toBe(StatusOffer.ACCEPTED);
      expect(cardRepository.update).toHaveBeenCalled();
      expect(publicationRepository.update).toHaveBeenCalled();
    });
    it('should change the status of the offer to accepted, transfer card ownership, and close publication', async () => {
      // Arrange
      const publicationOwner = new User({
        name: "Publication Owner",
        email: "pub.owner@example.com",
        password: "password123"
      });

      const offerOwner = new User({
        name: "Offer Owner",
        email: "offer.owner@example.com",
        password: "password123"
      });

      const testCard1 = new Card({
        cardBase: testCardBase,
        owner: publicationOwner,
        statusCard: 100
      });

      const publicationWithDifferentOwner = new Publication({
        card: testCard1,
        owner: publicationOwner,
        valueMoney: 100
      });

      const testCard2 = new Card({
        cardBase: testCardBase,
        owner: offerOwner,
        statusCard: 100
      });

      const offer = new Offer({
        offerOwner: offerOwner,
        cardOffers: [testCard2],
        moneyOffer: 100,
        statusOffer: StatusOffer.PENDING
      });

      const offerData: OfferUpdatedDTO = {
        statusOffer: "accepted",
        userId: publicationOwner.getId(),
        publicationId: publicationWithDifferentOwner.getId()
      };

      // Mock repository calls
      (mockOfferRepository.findById as jest.Mock).mockResolvedValue(offer);
      (mockOfferRepository.update as jest.Mock).mockImplementation(updatedOffer => updatedOffer);
      (publicationRepository.findById as jest.Mock).mockResolvedValue(publicationWithDifferentOwner);
      (userRepository.findById as jest.Mock).mockResolvedValue(publicationOwner);
      (cardRepository.update as jest.Mock).mockImplementation(updatedCard => updatedCard);

      // Act
      const result = await offerService.updateOffer('offer-id', offerData);

      // Assert
      expect(result).toBeDefined();
      expect(result.getStatusOffer()).toBe(StatusOffer.ACCEPTED);
      
      // Verify offered card ownership was transferred to publication owner
      const updatedOfferedCard = (cardRepository.update as jest.Mock).mock.calls[0][0];
      expect(updatedOfferedCard.getOwner()).toBe(publicationOwner);
            

      // Verify publication card ownership was transferred to offer owner
      const updatedPublicationCard = (cardRepository.update as jest.Mock).mock.calls[1][0];
      expect(updatedPublicationCard.getOwner()).toBe(offerOwner);
      

      // Verify publication was closed
      const updatedPublication = (publicationRepository.update as jest.Mock).mock.calls[0][0];
      expect(updatedPublication.getStatusPublication()).toBe(StatusPublication.CLOSED);
      
      // Verify all repositories were called
      expect(cardRepository.update).toHaveBeenCalledTimes(2); // Called twice: once for publication card, once for offered card
      expect(publicationRepository.update).toHaveBeenCalled();
      expect(mockOfferRepository.update).toHaveBeenCalled();
    });
    it('should change the status of the offer to rejected', async () => {
      const offerData: OfferUpdatedDTO = {
        statusOffer: "rejected",
        userId: 'user-id',
        publicationId: 'publication-id'
      };
      const offer = new Offer({
        offerOwner: testUser1,
        cardOffers: [testCard],
        moneyOffer: 100,
        statusOffer: StatusOffer.PENDING
      });
      (mockOfferRepository.findById as jest.Mock).mockResolvedValue(offer);
      (mockOfferRepository.update as jest.Mock).mockResolvedValue(offer);
      (publicationRepository.findById as jest.Mock).mockResolvedValue(testPublication);
      (userRepository.findById as jest.Mock).mockResolvedValue(testUser1);

      const result = await offerService.updateOffer('offer-id',offerData);
      expect(result).toBeDefined();
      expect(result.getStatusOffer()).toBe(StatusOffer.REJECTED);
    });
    it('should not change card ownership when offer is rejected', async () => {
      // Arrange
      const publicationOwner = new User({
        name: "Publication Owner",
        email: "pub.owner@example.com",
        password: "password123"
      });

      const offerOwner = new User({
        name: "Offer Owner",
        email: "offer.owner@example.com",
        password: "password123"
      });

      const testCard1 = new Card({
        cardBase: testCardBase,
        owner: publicationOwner,
        statusCard: 100
      });

      const testCard2 = new Card({
        cardBase: testCardBase,
        owner: offerOwner,
        statusCard: 100
      });

      const publicationWithDifferentOwner = new Publication({
        card: testCard1,
        owner: publicationOwner,
        valueMoney: 100
      });

      const offer = new Offer({
        offerOwner: offerOwner,
        cardOffers: [testCard2],
        moneyOffer: 100,
        statusOffer: StatusOffer.PENDING
      });

      const offerData: OfferUpdatedDTO = {
        statusOffer: "rejected",
        userId: publicationOwner.getId(),
        publicationId: publicationWithDifferentOwner.getId()
      };

      // Mock repository calls
      (mockOfferRepository.findById as jest.Mock).mockResolvedValue(offer);
      (mockOfferRepository.update as jest.Mock).mockImplementation(updatedOffer => updatedOffer);
      (publicationRepository.findById as jest.Mock).mockResolvedValue(publicationWithDifferentOwner);
      (userRepository.findById as jest.Mock).mockResolvedValue(publicationOwner);

      // Act
      const result = await offerService.updateOffer('offer-id', offerData);

      // Assert
      expect(result).toBeDefined();
      expect(result.getStatusOffer()).toBe(StatusOffer.REJECTED);
      
      // Verify publication card ownership was NOT changed
      expect(testCard1.getOwner()).toBe(publicationOwner);
      
      // Verify offered card ownership was NOT changed
      expect(testCard2.getOwner()).toBe(offerOwner);
      
      // Verify publication was NOT closed
      expect(publicationWithDifferentOwner.getStatusPublication()).toBe(StatusPublication.OPEN);
      
      // Verify only offer repository was updated
      expect(mockOfferRepository.update).toHaveBeenCalled();
      expect(publicationRepository.update).toHaveBeenCalledTimes(1);
      expect(cardRepository.update).not.toHaveBeenCalled();
    });
  });
});
