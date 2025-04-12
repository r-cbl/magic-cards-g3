import { CardBase, CardBaseProps } from '../../../domain/entities/CardBase';
import { Game } from '../../../domain/entities/Game';
import { InMemoryCardBaseRepository } from '../../../infrastructure/repositories/InMemoryCardBaseRepository';

describe('InMemoryCardBaseRepository', () => {
  let repository: InMemoryCardBaseRepository;
  let testGame: Game;
  let testCardBase: CardBase;

  beforeEach(() => {
    repository = new InMemoryCardBaseRepository();
    testGame = new Game({ name: 'Test Game' });
    testCardBase = new CardBase({
      game: testGame,
      nameCard: 'Test Card Base'
    });
  });

  it('should save a card base', async () => {
    const savedCardBase = await repository.save(testCardBase);
    expect(savedCardBase).toEqual(testCardBase);
    
    const foundCardBase = await repository.findById(testCardBase.getId());
    expect(foundCardBase).toEqual(testCardBase);
  });

  it('should update a card base', async () => {
    await repository.save(testCardBase);
    
    const newGame = new Game({ name: 'New Game' });
    const updatedCardBase = new CardBase({
      id: testCardBase.getId(),
      game: newGame,
      nameCard: 'Updated Card Base'
    });
    
    const result = await repository.update(updatedCardBase);
    expect(result).toEqual(updatedCardBase);
    
    const foundCardBase = await repository.findById(testCardBase.getId());
    expect(foundCardBase).toEqual(updatedCardBase);
  });

  it('should throw error when updating non-existent card base', async () => {
    const nonExistentCardBase = new CardBase({
      id: 'non-existent-id',
      game: testGame,
      nameCard: 'Non-existent Card Base'
    });
    
    await expect(repository.update(nonExistentCardBase)).rejects.toThrow('CardBase not found');
  });

  it('should delete a card base', async () => {
    await repository.save(testCardBase);
    
    const result = await repository.delete(testCardBase.getId());
    expect(result).toBe(true);
    
    const foundCardBase = await repository.findById(testCardBase.getId());
    expect(foundCardBase).toBeUndefined();
  });

  it('should return false when deleting non-existent card base', async () => {
    const result = await repository.delete('non-existent-id');
    expect(result).toBe(false);
  });

  it('should find a card base by id', async () => {
    await repository.save(testCardBase);
    
    const foundCardBase = await repository.findById(testCardBase.getId());
    expect(foundCardBase).toEqual(testCardBase);
  });

  it('should return undefined when finding non-existent card base', async () => {
    const foundCardBase = await repository.findById('non-existent-id');
    expect(foundCardBase).toBeUndefined();
  });

  it('should find card bases by game', async () => {
    const game1 = new Game({ name: 'Game 1' });
    const game2 = new Game({ name: 'Game 2' });
    
    const cardBase1 = new CardBase({ game: game1, nameCard: 'Card Base 1' });
    const cardBase2 = new CardBase({ game: game1, nameCard: 'Card Base 2' });
    const cardBase3 = new CardBase({ game: game2, nameCard: 'Card Base 3' });
    
    await repository.save(cardBase1);
    await repository.save(cardBase2);
    await repository.save(cardBase3);
    
    const cardBasesForGame1 = await repository.findByGame(game1);
    expect(cardBasesForGame1).toHaveLength(2);
    expect(cardBasesForGame1).toEqual(expect.arrayContaining([cardBase1, cardBase2]));
    
    const cardBasesForGame2 = await repository.findByGame(game2);
    expect(cardBasesForGame2).toHaveLength(1);
    expect(cardBasesForGame2[0]).toEqual(cardBase3);
  });

  it('should find all card bases', async () => {
    const cardBase1 = new CardBase({ game: testGame, nameCard: 'Card Base 1' });
    const cardBase2 = new CardBase({ game: testGame, nameCard: 'Card Base 2' });
    
    await repository.save(cardBase1);
    await repository.save(cardBase2);
    
    const allCardBases = await repository.findAll();
    expect(allCardBases).toHaveLength(2);
    expect(allCardBases).toEqual(expect.arrayContaining([cardBase1, cardBase2]));
  });

  it('should return empty array when no card bases exist', async () => {
    const allCardBases = await repository.findAll();
    expect(allCardBases).toHaveLength(0);
  });
}); 