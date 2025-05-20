import { Router, Request, Response } from 'express';
import { UserController } from '../controllers/UserController';
import { UserService } from '../../application/services/UserService';
import { JwtService } from '../../infrastructure/auth/jwt.service';
import { AuthMiddleware } from '../middleware/auth.middleware';
import { userRepository } from '../../infrastructure/provider/Container';

// Create dependencies
const userService = new UserService(userRepository);
const userController = new UserController(userService);
const jwtService = new JwtService();
const authMiddleware = new AuthMiddleware(jwtService);

// Create router
const userRouter = Router();

// Protected routes - require authentication
userRouter.use(authMiddleware.authenticate);

// Define routes
userRouter.post('/', (req: Request, res: Response) => userController.createUser(req, res));
userRouter.get('/:id', (req: Request, res: Response) => userController.getUser(req, res));
userRouter.put('/:id', (req: Request, res: Response) => userController.updateUser(req, res));
userRouter.delete('/:id', (req: Request, res: Response) => userController.deleteUser(req, res));

export default userRouter; 