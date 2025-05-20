import { Router, Request, Response } from 'express';
import { AuthController } from '../controllers/AuthController';
import { AuthService } from '../../application/services/AuthService';
import { JwtService } from '../../infrastructure/auth/jwt.service';
import { AuthMiddleware } from '../middleware/auth.middleware';
import { userRepository } from '../../infrastructure/provider/Container';
import { UserService } from '../../application/services/UserService';

// Create dependencies
const jwtService = new JwtService();
const userService = new UserService(userRepository);
const authService = new AuthService(jwtService, userService);
const authController = new AuthController(authService);
const authMiddleware = new AuthMiddleware(jwtService);

// Create router
const authRouter = Router();

// Define routes
authRouter.post('/register', (req: Request, res: Response) => authController.register(req, res));
authRouter.post('/login', (req: Request, res: Response) => authController.login(req, res));
authRouter.get('/me', authMiddleware.authenticate, (req: Request, res: Response) => authController.getCurrentUser(req, res));

export default authRouter; 