import { Router, Request, Response } from 'express';
import { PublicationController } from '../controllers/PublicationController';
import { PublicationService } from '../../application/services/PublicationService';
import { JwtService } from '../../infrastructure/auth/jwt.service';
import { AuthMiddleware } from '../middleware/auth.middleware';
import { publicationRepository } from '../../infrastructure/repositories/Container';


const publicationService = new PublicationService(publicationRepository);
const publicationController = new PublicationController(publicationService);
const jwtService = new JwtService();
const authMiddleware = new AuthMiddleware(jwtService);

const publicationRouter = Router();

publicationRouter.use(authMiddleware.authenticate);

publicationRouter.post('/', (req: Request, res: Response) => publicationController.createPublication(req, res));

export default publicationRouter;


