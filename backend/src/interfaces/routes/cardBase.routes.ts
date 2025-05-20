import { Router, Request, Response } from 'express';
import { CardBaseController } from '../controllers/CardBaseController';
import { CardBaseService } from '../../application/services/CardBaseService';
import { cardBaseRepository, gameRepository } from '../../infrastructure/provider/Container';

// Create dependencies
const cardBaseService = new CardBaseService(cardBaseRepository, gameRepository);
const cardBaseController = new CardBaseController(cardBaseService);

// Create router
const cardBaseRouter = Router();

// Define routes (no authentication required)
cardBaseRouter.post('/', (req: Request, res: Response) => cardBaseController.createCardBase(req, res));
cardBaseRouter.get('/', (req: Request, res: Response) => cardBaseController.getAllCardBasesPaginated(req, res));
cardBaseRouter.get('/:id', (req: Request, res: Response) => cardBaseController.getCardBase(req, res));
cardBaseRouter.put('/:id', (req: Request, res: Response) => cardBaseController.updateCardBase(req, res));
cardBaseRouter.delete('/:id', (req: Request, res: Response) => cardBaseController.deleteCardBase(req, res));

export default cardBaseRouter; 