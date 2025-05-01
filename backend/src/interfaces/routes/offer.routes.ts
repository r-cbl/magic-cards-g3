import { Router, Request, Response } from 'express';
import { OfferService } from '../../application/services/OfferService';
import { JwtService } from '../../infrastructure/auth/jwt.service';
import { AuthMiddleware } from '../middleware/auth.middleware';
import { offerRepository } from '../../infrastructure/repositories/Container';
import { OfferController } from '../../interfaces/controllers/OfferController';

const offerService = new OfferService(offerRepository);
const offerController = new OfferController(offerService);
const jwtService = new JwtService();
const authMiddleware = new AuthMiddleware(jwtService);

const offerRouter = Router();

offerRouter.use(authMiddleware.authenticate);

offerRouter.post('/', (req: Request, res: Response) => offerController.createOffer(req, res));
offerRouter.get('/', (req: Request, res: Response) => offerController.getAllOffersPaginated(req, res));
offerRouter.get('/:id', (req: Request, res: Response) => offerController.getOffer(req, res));
offerRouter.put('/:id', (req: Request, res: Response) => offerController.updateOffer(req, res));
offerRouter.delete('/:id', (req: Request, res: Response) => offerController.deleteOffer(req, res));



export default offerRouter;
