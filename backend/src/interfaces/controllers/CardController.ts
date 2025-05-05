import { CardFilterDTO, CardUpdatedDTO, CreateCardDTO } from '@/application/dtos/CardsDTO';
import { CardService } from '@/application/services/CardService';
import { Request, Response } from 'express';
import { UnauthorizedException } from '../../domain/entities/exceptions/exceptions';
import { PaginationDTO } from '@/application/dtos/PaginationDTO';

export class CardController {
    constructor(private readonly cardService: CardService) {}

    public async createCard(req: Request, res: Response): Promise<void> {
        try {
            const userId = req.user?.userId;
            const cardData: CreateCardDTO = { 
                ...req.body,
                ownerId: userId,
            };
            const card = await this.cardService.createCard(cardData);
            res.status(201).json(card);
        } catch (error) {
            if (error instanceof UnauthorizedException) {
                res.status(401).json({ error: error.message });
            } else if (error instanceof Error) {
                res.status(400).json({ error: error.message }); 
            } else {
                res.status(500).json({ error: 'An unexpected error occurred' });
            }
        }
    }

    public async getAllCards(req: Request, res: Response): Promise<void> {
        try {
            const filters: CardFilterDTO = {
                name: req.query.name ? (req.query.name as string) : undefined,
                game: req.query.game ? (req.query.game as string) : undefined,
                ownerId: req.query.ownerId as string
            };
        
            const cards = await this.cardService.getAllCards(filters);
            res.status(200).json(cards);
        } catch (error) {
            if (error instanceof UnauthorizedException) {
                res.status(401).json({ error: error.message });
            } else if (error instanceof Error) {
                res.status(400).json({ error: error.message });
            } else {
                res.status(500).json({ error: 'An unexpected error occurred' });
            }
        }
    }

    public async getAllCardsPaginated(req: Request, res: Response): Promise<void> {
        try {
            const userId = req.user?.userId;
            const filters: PaginationDTO<CardFilterDTO> = {
                data: {
                    ownerId: userId,
                    name: req.query.name ? (req.query.name as string) : undefined,
                    game: req.query.game ? (req.query.game as string) : undefined,
                },
                limit: req.query.limit ? Number(req.query.limit) : undefined,
                offset: req.query.offset ? Number(req.query.offset) : undefined,
            };

            const cards = await this.cardService.getAllCardsPaginated(filters);
            res.status(200).json(cards);
        } catch (error) {
            if (error instanceof UnauthorizedException) {
                res.status(401).json({ error: error.message });
            } else if (error instanceof Error) {
                res.status(400).json({ error: error.message });
            } else {
                res.status(500).json({ error: 'An unexpected error occurred' });
            }
        }
    }

    public async getCard(req: Request, res: Response): Promise<void> {
        try {
            const id = req.params.id;
            const card = await this.cardService.getCard(id)
            res.status(200).json(card)
        } catch (error) {
            if (error instanceof UnauthorizedException) {
                res.status(401).json({ error: error.message });
            } else if (error instanceof Error) {
              res.status(400).json({ error: error.message });
            } else {
              res.status(500).json({ error: 'An unexpected error occurred' });
            }
          }   
    }

    public async updateCard(req: Request, res: Response): Promise<void> {
        try {
            const id = req.params.id;
            const userId = req.user?.userId;
            const cardData : CardUpdatedDTO = {
                ...req.body,
                ownerId: userId
            }
            const card = await this.cardService.updateCard(id, cardData);
            res.status(200).json(card);
        } catch (error) {
            if (error instanceof UnauthorizedException) {
                res.status(401).json({ error: error.message });
            } else if (error instanceof Error) {
              res.status(400).json({ error: error.message });
            } else {
              res.status(500).json({ error: 'An unexpected error occurred' });
            }
          }   
    }

    public async deleteCard(req: Request, res: Response): Promise<void> {
        try {
            const id = req.params.id;
            const userId = req.user?.userId;
            if (!userId) {
                throw new UnauthorizedException('User not authenticated');
            }
            const result = await this.cardService.deleteCard(userId, id);
            if (result) {
                res.status(204).send();
            } else {
                res.status(404).json({ error: 'Card not found' });
            }
        } catch (error) {
            if (error instanceof UnauthorizedException) {
                res.status(401).json({ error: error.message });
            } else if (error instanceof Error) {
              res.status(400).json({ error: error.message });
            } else {
              res.status(500).json({ error: 'An unexpected error occurred' });
            }
          }   
    }
}


