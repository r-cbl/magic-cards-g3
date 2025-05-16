import { Router, Request, Response } from 'express';
import { GameController } from '../controllers/GameController';
import { GameService } from '../../application/services/GameService';
import { gameRepository } from '../../infrastructure/provider/Container';

// Create dependencies
const gameService = new GameService(gameRepository);
const gameController = new GameController(gameService);

// Create router
const gameRouter = Router();

// Define routes (no authentication required)
gameRouter.post('/', (req: Request, res: Response) => gameController.createGame(req, res));
gameRouter.get('/', (req: Request, res: Response) => gameController.getAllGamesPaginated(req, res));
gameRouter.get('/:id', (req: Request, res: Response) => gameController.getGame(req, res));
gameRouter.put('/:id', (req: Request, res: Response) => gameController.updateGame(req, res));
gameRouter.delete('/:id', (req: Request, res: Response) => gameController.deleteGame(req, res));

export default gameRouter; 