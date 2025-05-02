import { Request, Response } from 'express';
import { GameService } from '../../application/services/GameService';
import { CreateGameDTO, UpdateGameDTO } from '../../application/dtos/GameDTO';
import { PaginationDTO } from '@/application/dtos/PaginationDTO';

export class GameController {
  constructor(private readonly gameService: GameService) {}

  public async createGame(req: Request, res: Response): Promise<void> {
    try {
      const gameData: CreateGameDTO = req.body;
      const game = await this.gameService.createGame(gameData);
      res.status(201).json(game);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'An unexpected error occurred' });
      }
    }
  }

  public async getGame(req: Request, res: Response): Promise<void> {
    try {
      const gameId = req.params.id;
      const game = await this.gameService.getGame(gameId);
      res.status(200).json(game);
    } catch (error) {
      if (error instanceof Error && error.message === 'Game not found') {
        res.status(404).json({ error: error.message });
      } else if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'An unexpected error occurred' });
      }
    }
  }

  public async getAllGames(req: Request, res: Response): Promise<void> {
    try {
      const games = await this.gameService.getAllGames();
      res.status(200).json(games);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'An unexpected error occurred' });
      }
    }
  }

  public async getAllGamesPaginated(req: Request, res: Response): Promise<void> {
    try {
      const filters: PaginationDTO<String> = {
        data: req.query.game ? (req.query.game as string) : "",
        limit: req.query.limit ? Number(req.query.limit) : undefined,
        offset: req.query.offset ? Number(req.query.offset) : undefined,
    };
      const games = await this.gameService.getAllGamesPaginated(filters);
      res.status(200).json(games);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'An unexpected error occurred' });
      }
    }
  }

  public async updateGame(req: Request, res: Response): Promise<void> {
    try {
      const gameId = req.params.id;
      const gameData: UpdateGameDTO = req.body;
      const game = await this.gameService.updateGame(gameId, gameData);
      res.status(200).json(game);
    } catch (error) {
      if (error instanceof Error && error.message === 'Game not found') {
        res.status(404).json({ error: error.message });
      } else if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'An unexpected error occurred' });
      }
    }
  }

  public async deleteGame(req: Request, res: Response): Promise<void> {
    try {
      const gameId = req.params.id;
      await this.gameService.deleteGame(gameId);
      res.status(204).send();
    } catch (error) {
      if (error instanceof Error && error.message === 'Game not found') {
        res.status(404).json({ error: error.message });
      } else if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'An unexpected error occurred' });
      }
    }
  }
} 