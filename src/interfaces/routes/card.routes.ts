import { Router } from 'express';
import { CardController } from '../controllers/CardController';
import { CardService } from '../../application/services/CardService';
import { cardRepository } from '../../infrastructure/repositories/Container';
import { JwtService } from '../../infrastructure/auth/jwt.service';
import { AuthMiddleware } from '../middleware/auth.middleware';

const cardService = new CardService(cardRepository);
const cardController = new CardController(cardService);
const jwtService = new JwtService();
const authMiddleware = new AuthMiddleware(jwtService);

const cardRouter = Router();

cardRouter.use(authMiddleware.authenticate);

cardRouter.post('/', cardController.createCard.bind(cardController));
cardRouter.get('/', cardController.getAllCards.bind(cardController));
cardRouter.get('/:id', cardController.getCard.bind(cardController));
cardRouter.put('/:id', cardController.updateCard.bind(cardController));
cardRouter.delete('/:id', cardController.deleteCard.bind(cardController));

export default cardRouter;


