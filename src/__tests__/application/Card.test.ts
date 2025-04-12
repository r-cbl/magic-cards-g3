import { CardService } from "../../application/services/CardService";
import { CreateCardDTO, CardResponseDTO } from "../../application/dtos/CardsDTO";
import { CardRepository } from "../../domain/repositories/CardRepository";
import { User } from "../../domain/entities/User";
import { CardBase } from "../../domain/entities/CardBase";
import { Game } from "../../domain/entities/Game";
import { Card } from "../../domain/entities/Card";
import { cardBaseRepository, userRepository } from "../../infrastructure/repositories/Container";

// Mock the repositories
jest.mock("../../infrastructure/repositories/Container", () => ({
  cardBaseRepository: {
    findById: jest.fn(),
  },
  userRepository: {
    findById: jest.fn(),
  },
}));

describe('CardService', () => {
  let cardService: CardService;
  let mockCardRepository: jest.Mocked<CardRepository>;

  // Test data
  const testUser = new User({
    name: "Test User",
    email: "test@example.com",
    password: "password123"
  });

  const testGame = new Game({ name: "Pokemon" });
  const testCardBase = new CardBase({ game: testGame, nameCard: "Pikachu" });

  beforeEach(() => {
    jest.clearAllMocks();
    
    mockCardRepository = {
      save: jest.fn(),
      find: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findByCardsByIds: jest.fn(),
    };

    cardService = new CardService(mockCardRepository);
  });

  it('should create a card successfully', async () => {
    const cardData: CreateCardDTO = {
      ownerId: testUser.getId(),
      cardBaseId: testCardBase.getId(),
      urlImage: "http://example.com/image.png",
      statusCard: 100
    };

    (cardBaseRepository.findById as jest.Mock).mockResolvedValue(testCardBase);
    (userRepository.findById as jest.Mock).mockResolvedValue(testUser);

    (mockCardRepository.save as jest.Mock).mockImplementation(card => card);

    const result = await cardService.createCard(cardData);

    expect(result).toBeDefined();
    expect(result.urlImage).toBe(cardData.urlImage);
    expect(mockCardRepository.save).toHaveBeenCalled();
  });

  it('should throw an error when creating a card for a non-existent user', async () => {
    const cardData: CreateCardDTO = {
      ownerId: 'non-existent-id',
      cardBaseId: testCardBase.getId(),
      urlImage: "http://example.com/image.png",
      statusCard: 100
    };

    (mockCardRepository.findById as jest.Mock).mockResolvedValue(null);
    (userRepository.findById as jest.Mock).mockRejectedValue(new Error("User not found"));

    await expect(cardService.createCard(cardData))
      .rejects
      .toThrow('User not found');
  });

  it('should return all cards with filters', async () => {
    const filters = { ownerId: testUser.getId() };
    const mockCards = [new Card({ owner: testUser, cardBase: testCardBase, statusCard: 100 })];

    (mockCardRepository.find as jest.Mock).mockResolvedValue(mockCards);
    (userRepository.findById as jest.Mock).mockResolvedValue(testUser);

    const result = await cardService.getAllCards(filters);

    expect(result).toHaveLength(1);
    expect(result[0].owner.ownerId).toBe(testUser.getId());
  });

  it('should return a card by ID', async () => {
    const cardId = 'card-id';
    const mockCard = new Card({ owner: testUser, cardBase: testCardBase, statusCard: 100, id: cardId });

    (mockCardRepository.findById as jest.Mock).mockResolvedValue(mockCard);

    const result = await cardService.getCard(cardId);

    expect(result).toBeDefined();
    expect(result.id).toBe(cardId);
  });
});
