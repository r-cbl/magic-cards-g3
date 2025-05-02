import { Game } from '../../domain/entities/Game';
import { GameRepository } from '../../domain/repositories/GameRepository';
import { CreateGameDTO, UpdateGameDTO, GameResponseDTO } from '../dtos/GameDTO';
import { PaginatedResponseDTO, PaginationDTO } from '../dtos/PaginationDTO';

export class GameService {
  constructor(private readonly gameRepository: GameRepository) {}

  public async createGame(gameData: CreateGameDTO): Promise<GameResponseDTO> {
    const game = new Game({
      name: gameData.name,
    });

    const savedGame = await this.gameRepository.save(game);
    return this.toGameResponseDTO(savedGame);
  }

  public async getGame(id: string): Promise<GameResponseDTO> {
    const game = await this.gameRepository.findById(id);
    
    if (!game) {
      throw new Error('Game not found');
    }
    
    return this.toGameResponseDTO(game);
  }

  public async getAllGames(): Promise<GameResponseDTO[]> {  
    const games = await this.gameRepository.findAll();
    return games.map(game => this.toGameResponseDTO(game));
  }

  public async getAllGamesPaginated(filters: PaginationDTO<String>): Promise<PaginatedResponseDTO<GameResponseDTO>> {
    const paginatedGames = await this.gameRepository.findPaginated(filters);
    return {
        data: paginatedGames.data.map(game => this.toGameResponseDTO(game)),
        total: paginatedGames.total,
        limit: paginatedGames.limit,
        offset: paginatedGames.offset,
        hasMore: paginatedGames.hasMore
    };
}

  public async updateGame(id: string, gameData: UpdateGameDTO): Promise<GameResponseDTO> {
    const existingGame = await this.gameRepository.findById(id);
    
    if (!existingGame) {
      throw new Error('Game not found');
    }

    // Create a new game object with updated properties
    const updatedGame = new Game({
      id: existingGame.getId(),
      name: gameData.name || existingGame.getName(),
    });

    const savedGame = await this.gameRepository.update(updatedGame);
    return this.toGameResponseDTO(savedGame);
  }

  public async deleteGame(id: string): Promise<boolean> {
    const existingGame = await this.gameRepository.findById(id);
    
    if (!existingGame) {
      throw new Error('Game not found');
    }

    return this.gameRepository.delete(id);
  }

  private toGameResponseDTO(game: Game): GameResponseDTO {
    return {
      id: game.getId(),
      name: game.getName(),
      createdAt: game.getCreatedAt(),
      updatedAt: game.getUpdatedAt(),
    };
  }
} 