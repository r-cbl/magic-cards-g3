import { Game, GameProps } from '../../../domain/entities/Game';
import { InMemoryGameRepository } from '../../../infrastructure/repositories/InMemoryGameRepository';

describe('InMemoryGameRepository', () => {
  let repository: InMemoryGameRepository;
  let testGame: Game;
  const gameData: GameProps = {
    name: 'Test Game',
  };

  beforeEach(() => {
    repository = new InMemoryGameRepository();
    testGame = new Game(gameData);
  });

  it('should save a game', async () => {
    const savedGame = await repository.save(testGame);
    expect(savedGame).toEqual(testGame);
    
    const foundGame = await repository.findById(testGame.getId());
    expect(foundGame).toEqual(testGame);
  });

  it('should update a game', async () => {
    await repository.save(testGame);
    
    const updatedGame = new Game({
      id: testGame.getId(),
      name: 'Updated Game',
    });
    
    const result = await repository.update(updatedGame);
    expect(result).toEqual(updatedGame);
    
    const foundGame = await repository.findById(testGame.getId());
    expect(foundGame).toEqual(updatedGame);
  });

  it('should throw error when updating non-existent game', async () => {
    const nonExistentGame = new Game({
      id: 'non-existent-id',
      name: 'Non-existent Game',
    });
    
    await expect(repository.update(nonExistentGame)).rejects.toThrow('Game not found');
  });

  it('should delete a game', async () => {
    await repository.save(testGame);
    
    const result = await repository.delete(testGame.getId());
    expect(result).toBe(true);
    
    const foundGame = await repository.findById(testGame.getId());
    expect(foundGame).toBeUndefined();
  });

  it('should return false when deleting non-existent game', async () => {
    const result = await repository.delete('non-existent-id');
    expect(result).toBe(false);
  });

  it('should find a game by id', async () => {
    await repository.save(testGame);
    
    const foundGame = await repository.findById(testGame.getId());
    expect(foundGame).toEqual(testGame);
  });

  it('should return undefined when finding non-existent game', async () => {
    const foundGame = await repository.findById('non-existent-id');
    expect(foundGame).toBeUndefined();
  });

  it('should find all games', async () => {
    const game1 = new Game({ name: 'Game 1' });
    const game2 = new Game({ name: 'Game 2' });
    
    await repository.save(game1);
    await repository.save(game2);
    
    const allGames = await repository.findAll();
    expect(allGames).toHaveLength(2);
    expect(allGames).toEqual(expect.arrayContaining([game1, game2]));
  });

  it('should return empty array when no games exist', async () => {
    const allGames = await repository.findAll();
    expect(allGames).toHaveLength(0);
  });
}); 