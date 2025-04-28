import { Request, Response } from 'express';
import { UserService } from '../../application/services/UserService';
import { CreateUserDTO, UpdateUserDTO } from '../../application/dtos/UserDTO';

export class UserController {
  constructor(private readonly userService: UserService) {}

  public async createUser(req: Request, res: Response): Promise<void> {
    try {
      const adminId = req.user?.userId;
      const userData: CreateUserDTO = req.body;
      const user = await this.userService.createUserByAdmin(userData, adminId);
      res.status(201).json(user);
    } catch (error) { 
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'An unexpected error occurred' });
      }
    }
  }

  public async getUser(req: Request, res: Response): Promise<void> {
    try {
      const adminId = req.user?.userId;
      const userEmail = req.params.email;
      const user = await this.userService.getUserByAdmin(userEmail, adminId);
      res.status(200).json(user);
    } catch (error) {
      if (error instanceof Error && error.message === 'User not found') {
        res.status(404).json({ error: error.message });
      } else if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'An unexpected error occurred' });
      }
    }
  }

  public async updateUser(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId;
      const toUpdateUserId = req.params.id;
      const userData: UpdateUserDTO = req.body;
      const user = await this.userService.updateUser(toUpdateUserId, userData, userId);
      res.status(200).json(user);
    } catch (error) {
      if (error instanceof Error && error.message === 'User not found') {
        res.status(404).json({ error: error.message });
      } else if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'An unexpected error occurred' });
      }
    }
  }

  public async deleteUser(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId;
      const toDeleteUserId = req.params.id;
      await this.userService.deleteUser(toDeleteUserId, userId);
      res.status(204).send();
    } catch (error) {
      if (error instanceof Error && error.message === 'User not found') {
        res.status(404).json({ error: error.message });
      } else if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'An unexpected error occurred' });
      }
    }
  }
} 