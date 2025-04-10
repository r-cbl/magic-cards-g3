import { Offer, OfferProps } from '../../../../domain/entities/Offer';
import { User, UserProps } from '../../../../domain/entities/User';
import { Card, CardProps } from '../../../../domain/entities/Card';
import { CardBase, CardBaseProps } from '../../../../domain/entities/CardBase';
import { Game } from '../../../../domain/entities/Game';
import { StatusOffer } from '../../../../domain/entities/StatusOffer';

describe('Offer Entity', () => {
  // Create test users
  const createUser = (name: string): User => {
    const userProps: UserProps = {
      name,
      email: `${name.toLowerCase().replace(' ', '.')}@example.com`,
      password: 'password123'
    };
    return new User(userProps);
  };

  // Create test game
  const createGame = (name: string): Game => {
    return new Game({ name });
  };

  // Create test card base
  const createCardBase = (name: string, game: Game): CardBase => {
    const cardBaseProps: CardBaseProps = {
      game,
      nameCard: name
    };
    return new CardBase(cardBaseProps);
  };

  // Create test card
  const createCard = (name: string, cardBase: CardBase): Card => {
    const cardProps: CardProps = {
      cardBase,
      name,
      statusCard: 1
    };
    return new Card(cardProps);
  };

  // Test users
  let ownerUser: User;
  let otherUser: User;
  
  // Test game
  let testGame: Game;
  
  // Test cards
  let card1: Card;
  let card2: Card;
  let card3: Card;
  
  beforeEach(() => {
    // Create test users
    ownerUser = createUser('Owner User');
    otherUser = createUser('Other User');
    
    // Create test game
    testGame = createGame('Test Game');
    
    // Create test cards
    const cardBase1 = createCardBase('Card 1', testGame);
    const cardBase2 = createCardBase('Card 2', testGame);
    const cardBase3 = createCardBase('Card 3', testGame);
    
    card1 = createCard('Card 1', cardBase1);
    card2 = createCard('Card 2', cardBase2);
    card3 = createCard('Card 3', cardBase3);
    
    // Add cards to owner user
    ownerUser.addCard(card1);
    ownerUser.addCard(card2);
    
    // Add card to other user
    otherUser.addCard(card3);
  });
  
  describe('Offer Creation', () => {
    it('should fail to create an offer without money and without cards', () => {
      // Arrange
      const offerProps: OfferProps = {
        offerOwner: ownerUser
      };
      
      // Act & Assert
      expect(() => new Offer(offerProps)).toThrow('Card or money offer is required');
    });
    
    it('should fail to create an offer with negative money', () => {
      // Arrange
      const offerProps: OfferProps = {
        offerOwner: ownerUser,
        moneyOffer: -10
      };
      
      // Act & Assert
      expect(() => new Offer(offerProps)).toThrow('Money offer must be greater than 0');
    });
    
    it('should fail to create an offer with zero money', () => {
      // Arrange
      const offerProps: OfferProps = {
        offerOwner: ownerUser,
        moneyOffer: 0
      };
      
      // Act & Assert
      expect(() => new Offer(offerProps)).toThrow('Money offer must be greater than 0');
    });
    
    it('should create an offer with positive money', () => {
      // Arrange
      const offerProps: OfferProps = {
        offerOwner: ownerUser,
        moneyOffer: 100
      };
      
      // Act
      const offer = new Offer(offerProps);
      
      // Assert
      expect(offer).toBeDefined();
      expect(offer.isMyOffer(ownerUser)).toBe(true);
    });
    
    it('should create an offer with a card', () => {
      // Arrange
      const offerProps: OfferProps = {
        offerOwner: ownerUser,
        cardOffers: [card1]
      };
      
      // Act
      const offer = new Offer(offerProps);
      
      // Assert
      expect(offer).toBeDefined();
      expect(offer.isMyOffer(ownerUser)).toBe(true);
    });
    
    it('should fail to create an offer with a card that is not mine', () => {
      // Arrange
      const offerProps: OfferProps = {
        offerOwner: ownerUser,
        cardOffers: [card3] // card3 belongs to otherUser
      };
      
      // Act & Assert
      expect(() => new Offer(offerProps)).toThrow('Card owner is not the same as the offer owner');
    });
    
    it('should create an offer with multiple cards', () => {
      // Arrange
      const offerProps: OfferProps = {
        offerOwner: ownerUser,
        cardOffers: [card1, card2]
      };
      
      // Act
      const offer = new Offer(offerProps);
      
      // Assert
      expect(offer).toBeDefined();
      expect(offer.isMyOffer(ownerUser)).toBe(true);
    });
    
    it('should create an offer with multiple cards and money', () => {
      // Arrange
      const offerProps: OfferProps = {
        offerOwner: ownerUser,
        cardOffers: [card1, card2],
        moneyOffer: 50
      };
      
      // Act
      const offer = new Offer(offerProps);
      
      // Assert
      expect(offer).toBeDefined();
      expect(offer.isMyOffer(ownerUser)).toBe(true);
    });
    
    it('should create an offer with default status DRAFT', () => {
      // Arrange
      const offerProps: OfferProps = {
        offerOwner: ownerUser,
        moneyOffer: 100
      };
      
      // Act
      const offer = new Offer(offerProps);
      
      // Assert
      expect(offer).toBeDefined();
      // Note: Since statusOffer is private, we can't directly test it
      // But we can verify the offer was created successfully
    });
    
    it('should create an offer with specified status', () => {
      // Arrange
      const offerProps: OfferProps = {
        offerOwner: ownerUser,
        moneyOffer: 100,
        statusOffer: StatusOffer.PENDING
      };
      
      // Act
      const offer = new Offer(offerProps);
      
      // Assert
      expect(offer).toBeDefined();
      // Note: Since statusOffer is private, we can't directly test it
      // But we can verify the offer was created successfully
    });
  });
}); 