import { OfferService } from "../../application/services/OfferService";
import { CreateOfferDTO } from "../../application/dtos/OfferDTO";
import { OfferRepository } from "../../domain/repositories/OfferRepository";
import { userRepository, publicationRepository, cardRepository } from "../../infrastructure/repositories/Container";
import { User } from "../../domain/entities/User";
import { Publication } from "../../domain/entities/Publication";
import { Card } from "../../domain/entities/Card";
import { CardBase } from "../../domain/entities/CardBase";
import { Game } from "../../domain/entities/Game";

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
    findByCardsByIds: jest.fn(),
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
    name: "Pikachu",
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
        name: "Existing Card",
        statusCard: 100
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

    const publicationWithDifferentOwner = new Publication({
      card: testCard,
      owner: publicationOwner,
      valueMoney: 100
    });

    const userCard1 = new Card({
      cardBase: testCardBase,
      name: "User Card 1",
      statusCard: 100
    });
    
    const userCard2 = new Card({
      cardBase: testCardBase,
      name: "User Card 2",
      statusCard: 100
    });

    offerOwner.addCard(userCard1);
    offerOwner.addCard(userCard2);
    
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

    const publicationOwnedByUser = new Publication({
      card: testCard,
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
      .toThrow('Offer owner is the same as the publication owner');
  });
});
